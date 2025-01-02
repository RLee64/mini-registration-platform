package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.*;
import com.nzpmc.backend.models.Attempt;
import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.services.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AccountService accountService;
    private final CompetitionService competitionService;
    private final AttemptService attemptService;
    private final QuestionService questionService;

    public EventController(EventService eventService, AccountService accountService, CompetitionService competitionService, AttemptService attemptService, QuestionService questionService) {
        this.eventService = eventService;
        this.accountService = accountService;
        this.competitionService = competitionService;
        this.attemptService = attemptService;
        this.questionService = questionService;
    }

    @GetMapping
    public ResponseEntity<Object> getAllEvents() {
        // No check necessary, any user can see receive this regardless of auth
        List<Event> events = eventService.findAllEvents();
        return ResponseEntity.ok(events);
    }

    // ADMIN AUTH REQUIRED
    @PostMapping
    public ResponseEntity<Object> createEvent(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody Event event) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if event already exists in database
        if (eventService.eventExists(event.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Event already exists");
        }

        // Save and return newly created event
        Event createdEvent = eventService.saveEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    // ADMIN AUTH REQUIRED
    @PutMapping("/competition/link")
    public ResponseEntity<Object> linkCompetition(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody CompetitionLinkDetails competitionLinkDetails) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Destructure object
        String competitionTitle = competitionLinkDetails.competitionTitle();
        String eventName = competitionLinkDetails.eventName();

        // Ensure competition exists
        if (!competitionService.competitionExists(competitionTitle)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Competition does not exist");
        }

        // Find event and ensure it exists
        Event event = eventService.findEvent(eventName);

        if (event == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event does not exist");
        }

        if (eventService.competitionAssigned(competitionTitle)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Competition already assigned");
        }

        // Update and return the event
        event.setCompetitionId(competitionTitle);
        eventService.saveEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    @GetMapping("/competition/start/{eventName}")
    public ResponseEntity<Object> startCompetition(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String eventName) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAccount(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if event exists and has a competition tied to it
        Event event = eventService.findEvent(eventName);

        if (event == null || event.getCompetitionId() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event does not exist or has no assigned competition");
        }

        // Fetch the competition object and return the ID & associated questions
        Competition competition = competitionService.findCompetition(event.getCompetitionId());

        List<Question> questions = questionService.findQuestions(competition.getQuestionIds());

        // Remove correct index positions (correctIndexChoice has type int so -1 is used in the place of null)
        questions.forEach(question -> {question.setCorrectIndexChoice(-1);});

        CompetitionData competitionData = new CompetitionData(competition.getTitle(), questions);

        return ResponseEntity.status(HttpStatus.OK).body(competitionData);
    }

    // ADMIN AUTH REQUIRED
    @GetMapping("/competition/mark/{eventName}")
    public ResponseEntity<Object> markCompetition(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String eventName) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAdmin(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if event exists and has a competition tied to it
        Event event = eventService.findEvent(eventName);

        if (event == null || event.getCompetitionId() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event does not exist or has no assigned competition");
        }

        // Fetch the competition object and associated attempts and questions
        Competition competition = competitionService.findCompetition(event.getCompetitionId());
        List<Attempt> attempts = attemptService.findByCompetitionTitle(competition.getTitle());
        List<Question> questions = questionService.findQuestions(competition.getQuestionIds());

        // Hashmap to store results (key is student email and value is their score
        Map<String, Integer> results = new HashMap<>();

        // Loop through each attempt and question, determining whether the student has put the correct option for each question in the competition
        for (Attempt attempt : attempts) {
            int score = 0;

            for (Question question : questions) {
                Integer chosenIndex = attempt.getAttempts().get(question.getTitle());
                if (chosenIndex != null && chosenIndex == question.getCorrectIndexChoice()) {
                    score++;
                }
            }

            results.put(attempt.getStudentEmail(), score);
        }

        // DTO containing the event name, total number of questions, and the results of all attempts
        EventResults eventResults = new EventResults(event.getName(), competition.getQuestionIds().toArray().length, results);
        return ResponseEntity.status(HttpStatus.OK).body(eventResults);
    }
}
