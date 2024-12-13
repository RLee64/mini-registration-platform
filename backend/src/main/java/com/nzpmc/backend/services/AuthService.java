package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticateUser(String email, String rawPassword) {
        Account account = accountRepository.findByEmailIgnoreCase(email);
        if (account == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, account.getPassword());
    }
}
