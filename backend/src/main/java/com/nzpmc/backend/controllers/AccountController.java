package com.nzpmc.backend.controllers;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Student;
import com.nzpmc.backend.repository.AccountRepository;
import com.nzpmc.backend.services.AccountService;
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
    AccountRepository accountRepository;
    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<Object> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> createStudent(@RequestBody Student studentData) {
        // Check if email is already in use
        if (accountRepository.findByEmailIgnoreCase(studentData.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already in use");
        }

        Account createdAccount = accountService.registerAccount(studentData);

        // Remove password before sending result back
        createdAccount.setPassword(null);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }
}
