package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.*;
import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Student;
import com.nzpmc.backend.repository.AccountRepository;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountService accountService;
    @Autowired
    private JWTService jwtService;

    // If admin, return all accounts, otherwise only return an individual's
    @GetMapping
    public ResponseEntity<Object> getAllAccounts(@RequestHeader("Authorization") String authorizationHeader) {
        // Get token details
        JWTDetails jwtDetails = jwtService.validateToken(authorizationHeader);

        // If no details returned, then token did not exist
        if (jwtDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Find account based on token
        Account account = accountRepository.findByEmailIgnoreCase(jwtDetails.email());

        // If account doesn't exist then token is also invalid
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // If token details OR account lacks admin permissions, only return the user
        if (!Objects.equals(jwtDetails.accessLevel(), "admin") || !Objects.equals(account.getAccessLevel(), "admin")) {
            // Remove password before sending result back
            account.setPassword(null);
            return ResponseEntity.status(HttpStatus.OK).body(account);
        }

        // Remove passwords before sending result back
        List<Account> accounts = accountRepository.findAll();
        accounts.forEach(a -> a.setPassword(null));
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerAccount(@RequestBody Student student) {
        // Check if email is already in use
        if (accountRepository.findByEmailIgnoreCase(student.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use");
        }

        Account createdAccount = accountService.registerAccount(student);

        // Remove password before sending result back
        createdAccount.setPassword(null);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @PostMapping("/auth")
    public ResponseEntity<Object> authenticateAccount(@RequestBody LoginDetails loginDetails) {
        Account account = accountService.authenticateAccount(loginDetails);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        JWTDetails jwtDetails = new JWTDetails(account.getEmail(), account.getAccessLevel());

        String token = jwtService.createToken(jwtDetails);

        AccessDetails accessDetails = new AccessDetails(token, account.getAccessLevel());

        return ResponseEntity.status(HttpStatus.OK).body(accessDetails);
    }

    // USER AUTH REQUIRED
    @PutMapping("/edit-name")
    public ResponseEntity<Object> editName(@RequestHeader("Authorization") String authorizationHeader, @RequestBody AccountName accountName) {
        JWTDetails jwtDetails = jwtService.validateToken(authorizationHeader);

        if (jwtDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Account account = accountRepository.findByEmailIgnoreCase(jwtDetails.email());

        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        account.setName(accountName.name());
        accountService.updateAccount(account);

        return ResponseEntity.ok(accountName);
    }

    // STUDENT AUTH REQUIRED
    @PutMapping("/join-event")
    public ResponseEntity<Object> joinEvent(@RequestHeader("Authorization") String authorizationHeader, @RequestBody EventName eventName) {
        // Get token details
        JWTDetails jwtDetails = jwtService.validateToken(authorizationHeader);

        // If no details returned, then token did not exist
        if (jwtDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Find account based on token
        Account account = accountRepository.findByEmailIgnoreCase(jwtDetails.email());

        // If account doesn't exist then token is also invalid
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Check if account is a student
        if (account instanceof Student student) {
            // Check if already joined event
            if (student.getJoinedEvents().contains(eventName.name())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Already joined event");
            }

            // Join event
            student.addJoinedEvent(eventName.name());
            accountService.updateAccount(student);
            return ResponseEntity.status(HttpStatus.OK).body(student);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is not a student");
        }
    }
}
