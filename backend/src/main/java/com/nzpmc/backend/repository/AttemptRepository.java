package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Attempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends MongoRepository<Attempt, String> {
    List<Attempt> findByCompetitionId(String competitionId);
}
