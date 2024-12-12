package com.nzpmc.backend.controllers;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Student;
import com.nzpmc.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    AccountRepository accountRepository;

    @GetMapping
    public ResponseEntity<Object> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/student")
    public ResponseEntity<Object> createStudent(@RequestBody Student studentData) {
        accountRepository.save(studentData);
        return ResponseEntity.ok().build();
    }
}
