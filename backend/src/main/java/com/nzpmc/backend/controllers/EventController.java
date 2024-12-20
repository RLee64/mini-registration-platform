package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.dtos.CompetitionData;
import com.nzpmc.backend.dtos.CompetitionLinkDetails;
import com.nzpmc.backend.dtos.EventName;
import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.models.Question;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.CompetitionService;
import com.nzpmc.backend.services.EventService;
import com.nzpmc.backend.services.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AccountService accountService;
    private final CompetitionService competitionService;
    private final QuestionService questionService;

    public EventController(EventService eventService, AccountService accountService, CompetitionService competitionService, QuestionService questionService) {
        this.eventService = eventService;
        this.accountService = accountService;
        this.competitionService = competitionService;
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

        // Update and return the event
        event.setCompetitionId(competitionTitle);
        eventService.saveEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(event);
    }

    // GET REQUEST TO START COMPETITION
    @GetMapping("/competition/start")
    public ResponseEntity<Object> startCompetition(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody EventName eventName) {
        // Run authorization
        AuthObjects authObjects = accountService.authenticateAccount(authorizationHeader);

        // Check if any errors were found
        if (authObjects.getResponseEntity() != null) {
            return authObjects.getResponseEntity();
        }

        // Check if event exists and has a competition tied to it
        Event event = eventService.findEvent(eventName.name());

        if (event == null || event.getCompetitionId() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event does not exist");
        }

        // Fetch the competition object and return the ID & associated questions
        Competition competition = competitionService.findCompetition(event.getCompetitionId());

        List<Question> questions = questionService.findByTitles(competition.getQuestionIds());

        CompetitionData competitionData = new CompetitionData(competition.getTitle(), questions);

        return ResponseEntity.status(HttpStatus.OK).body(competitionData);
    }

    // MARK REQUEST (GET REQUEST WITH ADMIN AUTH REQUIRED)
}
