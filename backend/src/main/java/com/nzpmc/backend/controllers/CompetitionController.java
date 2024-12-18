package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.CompetitionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {

    private final AccountService accountService;
    private final CompetitionService competitionService;

    public CompetitionController(AccountService accountService, CompetitionService competitionService) {
        this.accountService = accountService;
        this.competitionService = competitionService;
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

        // Save and return newly created competition
        Competition createdCompetition = competitionService.createCompetition(competition);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCompetition);
    }
}
