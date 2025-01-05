package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Boolean questionExists(String title) {
        return questionRepository.existsByTitleIgnoreCase(title);
    }

    public List<Question> findAllQuestions() { return questionRepository.findAll(); }

    public List<Question> findQuestions(List<String> titles) { return questionRepository.findByTitleIn(titles); }

    public Question findQuestion(String title) { return questionRepository.findByTitle(title); }

    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
}
