package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AttemptDetails;
import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Attempt;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.AttemptService;
import com.nzpmc.backend.services.CompetitionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/attempts")
public class AttemptController {

    private final AccountService accountService;
    private final CompetitionService competitionService;
    private final AttemptService attemptService;

    public AttemptController(AccountService accountService, CompetitionService competitionService, AttemptService attemptService) {
        this.accountService = accountService;
        this.competitionService = competitionService;
        this.attemptService = attemptService;
    }

    @PostMapping
    public ResponseEntity<Object> submitAttempt(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody AttemptDetails attemptDetails) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAccount(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Destructure object
        Account account = authObjects.getAccount();

        // Ensure that competition exists
        if (!competitionService.competitionExists(attemptDetails.competitionTitle())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Competition not found");
        }

        // Check if user has already made an attempt
        if (attemptService.findByStudentEmailAndCompetitionId(account.getEmail(), attemptDetails.competitionTitle()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User has already submitted an attempt");
        }

        // Create and store new attempt object
        Attempt attempt = new Attempt(account.getEmail(), attemptDetails.competitionTitle(), attemptDetails.attempts());

        Attempt submittedAttempt = attemptService.saveAttempt(attempt);

        return ResponseEntity.status(HttpStatus.CREATED).body(submittedAttempt);
    }

    @GetMapping("/{competitionName}")
    public ResponseEntity<Object> isSubmitted(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String competitionName) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAccount(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Destructure object
        Account account = authObjects.getAccount();

        // Check if user has made an attempt
        boolean submissionExists = attemptService.findByStudentEmailAndCompetitionId(account.getEmail(), competitionName) != null;

        return ResponseEntity.status(HttpStatus.OK).body(submissionExists);
    }
}
