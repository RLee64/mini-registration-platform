package com.nzpmc.backend.controllers;

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
        // Get token details
        JWTDetails jwtDetails = jwtService.validateToken(authorizationHeader);

        // If no details returned, then token did not exist
        if (jwtDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Find account based on token
        Account account = accountService.findAccount(jwtDetails.email());

        // If account doesn't exist then token is also invalid
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // If token details OR account lacks admin permissions, deny access
        if (!Objects.equals(jwtDetails.accessLevel(), "admin") || !Objects.equals(account.getAccessLevel(), "admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Check if event already exists in database
        if (eventService.findEvent(event.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Event already exists");
        }

        // Save and return newly created event
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }
}
