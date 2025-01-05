package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.dtos.QuestionLinkDetails;
import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.CompetitionService;
import com.nzpmc.backend.services.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {

    private final AccountService accountService;
    private final CompetitionService competitionService;
    private final QuestionService questionService;

    public CompetitionController(AccountService accountService, CompetitionService competitionService, QuestionService questionService) {
        this.accountService = accountService;
        this.competitionService = competitionService;
        this.questionService = questionService;
    }

    // ADMIN AUTH REQUIRED
    @GetMapping
    public ResponseEntity<Object> getCompetitions(@RequestHeader("Authorization") String authorizationHeader) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Get and return competitions
        List<Competition> competitions = competitionService.findAllCompetitions();
        return ResponseEntity.status(HttpStatus.OK).body(competitions);
    }

    // ADMIN AUTH REQUIRED
    @PostMapping
    public ResponseEntity<Object> createCompetition(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody Competition competition) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if competition already exists in database
        if (competitionService.competitionExists(competition.getTitle())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Competition already exists");
        }

        // Add questionId array if missing
        if (competition.getQuestionIds() == null) {
            competition.setQuestionIds(new ArrayList<>());
        }

        // Save and return newly created competition
        Competition createdCompetition = competitionService.saveCompetition(competition);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCompetition);
    }

    // ADMIN AUTH REQUIRED
    @PutMapping("/add-question")
    public ResponseEntity<Object> addQuestion(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody QuestionLinkDetails questionLinkDetails) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        Competition competition = competitionService.findCompetition(questionLinkDetails.competitionTitle());

        // Determine if competition exists
        if (competition == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Competition not found");
        }

        Question question = questionService.findQuestion(questionLinkDetails.questionTitle());

        // Determine if question exists
        if (question == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");
        }

        // Update and return the competition
        competition.addQuestionId(question.getTitle());
        Competition savedCompetition = competitionService.saveCompetition(competition);
        return ResponseEntity.status((HttpStatus.OK)).body(savedCompetition);
    }
}
