package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Attempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttemptRepository extends MongoRepository<Attempt, String> {
}
