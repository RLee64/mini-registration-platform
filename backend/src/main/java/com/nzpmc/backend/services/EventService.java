package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Event;
import com.nzpmc.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public boolean eventExists(String name) {
        return eventRepository.existsByNameIgnoreCase(name);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
}
