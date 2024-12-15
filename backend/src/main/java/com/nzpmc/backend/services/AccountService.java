package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.dtos.LoginDetails;
import com.nzpmc.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    public Account findAccount(String email) {
        return accountRepository.findByEmailIgnoreCase(email);
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

    public Account authenticateAccount(LoginDetails loginDetails) {
        Account foundAccount = accountRepository.findByEmailIgnoreCase(loginDetails.email());
        if (foundAccount == null) {
            return null;
        }
        boolean correctPassword = passwordEncoder.matches(loginDetails.password(), foundAccount.getPassword());

        return correctPassword ? foundAccount : null;
    }

    public void updateAccount(Account account) {
        accountRepository.save(account);
    }
}
