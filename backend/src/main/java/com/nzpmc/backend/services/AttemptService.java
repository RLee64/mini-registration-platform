package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Attempt;
import com.nzpmc.backend.repository.AttemptRepository;
import org.springframework.stereotype.Service;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;

    public AttemptService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public Attempt saveAttempt(Attempt attempt) {
        return attemptRepository.save(attempt);
    }
}
