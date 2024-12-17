package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetitionRepository extends MongoRepository<Event, String> {
}