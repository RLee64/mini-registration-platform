package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.dtos.LoginDetails;
import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class AccountService {

    private final PasswordEncoder passwordEncoder;
    private final AccountRepository accountRepository;
    private final JWTService jwtService;

    public AccountService(PasswordEncoder passwordEncoder, AccountRepository accountRepository, JWTService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.accountRepository = accountRepository;
        this.jwtService = jwtService;
    }

    public Boolean accountExists(String email) {
        return accountRepository.existsByEmailIgnoreCase(email);
    }

    public Account findAccount(String email) {
        Account account = accountRepository.findByEmailIgnoreCase(email);
        if (account == null) {
            return null;
        }
        // Remove password for security
        account.setPassword(null);
        return account;
    }

    public List<Account> findAllAccounts() {
        return accountRepository.findAll();
    }

    public Account registerAccount(Account account) {
        // Hash password
        String hashedPassword = passwordEncoder.encode(account.getPassword());
        account.setPassword(hashedPassword);

        // Save account to MongoDB
        return accountRepository.save(account);
    }

    public Account authenticateLogin(LoginDetails loginDetails) {
        Account foundAccount = accountRepository.findByEmailIgnoreCase(loginDetails.email());
        if (foundAccount == null) {
            return null;
        }
        boolean correctPassword = passwordEncoder.matches(loginDetails.password(), foundAccount.getPassword());

        // Remove password for security
        foundAccount.setPassword(null);

        return correctPassword ? foundAccount : null;
    }

    public AuthObjects authenticateAccount(String authorizationHeader) {
        // Instantiate objects needed for authorization
        AuthObjects authObjects = new AuthObjects(null, null, null);

        // Get token details
        authObjects.setJwtDetails(jwtService.validateToken(authorizationHeader));

        // If no details returned, then token did not exist
        if (authObjects.getJwtDetails() == null) {
            authObjects.setResponseEntity(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token"));
            return authObjects;
        }

        // Find account based on token
        authObjects.setAccount(findAccount(authObjects.getJwtDetails().email()));

        // If account doesn't exist then token is also invalid
        if (authObjects.getAccount() == null) {
            authObjects.setResponseEntity(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token"));
        }

        return authObjects;
    }

    public AuthObjects authenticateAdmin(String authorizationHeader) {
        // Run basic authorization checks
        AuthObjects authObjects = authenticateAccount(authorizationHeader);
        if (authObjects.getResponseEntity() != null) {
            return authObjects;
        }

        // If token details OR account lacks admin permissions, deny access
        if (!Objects.equals(authObjects.getJwtDetails().accessLevel(), "admin") || !Objects.equals(authObjects.getAccount().getAccessLevel(), "admin")) {
            authObjects.setResponseEntity(ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied"));
        }

        return authObjects;
    }

    // DO NOT USE WHEN CREATING NEW ACCOUNTS (use registerAccount instead)
    public void saveAccount(Account account) {
        accountRepository.save(account);
    }
}
