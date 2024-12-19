package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.dtos.CompetitionLinkDetails;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.CompetitionService;
import com.nzpmc.backend.services.EventService;
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

    public EventController(EventService eventService, AccountService accountService, CompetitionService competitionService) {
        this.eventService = eventService;
        this.accountService = accountService;
        this.competitionService = competitionService;
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
    @PutMapping("/link-Competition")
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

    // MARK REQUEST (GET REQUEST WITH ADMIN AUTH REQUIRED)

    // GET REQUEST TO START COMPETITION
}
