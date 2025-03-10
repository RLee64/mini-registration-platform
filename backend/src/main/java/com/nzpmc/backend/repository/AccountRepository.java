package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
    Boolean existsByEmailIgnoreCase(String email);
    Account findByEmailIgnoreCase(String email);
}
