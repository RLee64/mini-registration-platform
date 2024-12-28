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

    public Event findEvent(String name) {
        return eventRepository.findByNameIgnoreCase(name);
    }

    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }

    public boolean competitionAssigned(String competitionId) {
        List<Event> events = findAllEvents();
        for (Event event : events) {
            if (event.getCompetitionId().equals(competitionId)) {
                return true;
            }
        }
        return false;
    }

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }
}
