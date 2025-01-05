package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.CompetitionService;
import com.nzpmc.backend.services.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final AccountService accountService;
    private final CompetitionService competitionService;
    private final QuestionService questionService;

    public QuestionController(AccountService accountService, CompetitionService competitionService,QuestionService questionService) {
        this.accountService = accountService;
        this.competitionService = competitionService;
        this.questionService = questionService;
    }

    // ADMIN AUTH REQUIRED
    @GetMapping
    public ResponseEntity<Object> getAllQuestions(@RequestHeader("Authorization") String authorizationHeader) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        List<Question> questions = questionService.findAllQuestions();
        return ResponseEntity.status(HttpStatus.OK).body(questions);
    }

    // ADMIN AUTH REQUIRED
    @PostMapping
    public ResponseEntity<Object> createQuestion(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody Question question) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if question already exists in database
        if (questionService.questionExists(question.getTitle())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A question with this title already exists");
        }

        // Save and return the newly created question
        Question createdQuestion = questionService.saveQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuestion);
    }
}
