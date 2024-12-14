package com.nzpmc.backend.controllers;

import com.nzpmc.backend.dtos.JWTDetails;
import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.repository.EventRepository;
import com.nzpmc.backend.services.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private JWTService jwtService;

    @GetMapping
    public ResponseEntity<Object> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<Object> createEvent(@RequestHeader("Authorization") String authorizationHeader, @RequestBody Event event) {
        String accessToken = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.substring(7) : authorizationHeader;

        JWTDetails jwtDetails = jwtService.validateToken(accessToken);

        if (jwtDetails == null) {
            System.out.println("Invalid token 1");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        if (!Objects.equals(jwtDetails.accessLevel(), "admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        Event createdEvent = eventRepository.save(event);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }
}
