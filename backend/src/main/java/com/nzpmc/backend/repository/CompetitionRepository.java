package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Competition;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepository extends MongoRepository<Competition, String> {
    Boolean existsByTitleIgnoreCase(String title);
    Competition findByTitleIgnoreCase(String title);
}