package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.AuthObjects;
import com.nzpmc.backend.dtos.JWTDetails;
import com.nzpmc.backend.models.Account;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.services.AccountService;
import com.nzpmc.backend.services.EventService;
import com.nzpmc.backend.services.JWTService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final JWTService jwtService;
    private final EventService eventService;
    private final AccountService accountService;

    public EventController(JWTService jwtService, EventService eventService, AccountService accountService) {
        this.jwtService = jwtService;
        this.eventService = eventService;
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<Object> getAllEvents() {
        // No check necessary, any user can see receive this regardless of auth
        List<Event> events = eventService.getAllEvents();
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

        // Destructure object
        Account account = authObjects.getAccount();
        JWTDetails jwtDetails = authObjects.getJwtDetails();

        // Check if event already exists in database
        if (eventService.findEvent(event.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Event already exists");
        }

        // Save and return newly created event
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    // LINK TO COMPETITION ID (PUT REQUEST WITH ADMIN AUTH REQUIRED)

    // MARK REQUEST (GET REQUEST WITH ADMIN AUTH REQUIRED)

    // GET REQUEST TO START COMPETITION
}
