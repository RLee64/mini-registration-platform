package com.nzpmc.backend.repository;

import com.nzpmc.backend.models.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
    Boolean existsByTitleIgnoreCase(String title);
    List<Question> findByTitleIn(List<String> titles);
    Question findByTitle(String title);
}
