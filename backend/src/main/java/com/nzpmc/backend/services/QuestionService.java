package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Boolean questionExists(String title) {
        return questionRepository.existsByTitleIgnoreCase(title);
    }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
}
