package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AccessDetails;
import com.nzpmc.backend.dtos.JWTDetails;
import com.nzpmc.backend.dtos.NameObject;
import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.dtos.LoginDetails;
import com.nzpmc.backend.models.Student;
import com.nzpmc.backend.repository.AccountRepository;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<Object> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
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

        AccessDetails accessDetails = new AccessDetails (token, account.getAccessLevel());

        return ResponseEntity.status(HttpStatus.OK).body(accessDetails);
    }

    @PutMapping("/edit-name")
    public ResponseEntity<Object> editName(@RequestHeader("Authorization") String authorizationHeader, @RequestBody NameObject nameObject) {
        String accessToken = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;

        System.out.println("Token received: " + accessToken);

        JWTDetails jwtDetails = jwtService.validateToken(accessToken);

        System.out.println("Details received");

        if (jwtDetails == null) {
            System.out.println("Invalid token 1");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Account account = accountRepository.findByEmailIgnoreCase(jwtDetails.email());

        if (account == null) {
            System.out.println("Invalid token 2");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        System.out.println(nameObject);

        account.setName(nameObject.name());
        accountService.updateAccount(account);

        return ResponseEntity.ok(nameObject);
    }
}
