package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    public Account registerAccount(Account account) {
        // Hash password
        String hashedPassword = passwordEncoder.encode(account.getPassword());
        account.setPassword(hashedPassword);

        // Save account to MongoDB
        return accountRepository.save(account);
    }
}
