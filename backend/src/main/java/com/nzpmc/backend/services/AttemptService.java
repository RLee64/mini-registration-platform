package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Attempt;
import com.nzpmc.backend.repository.AttemptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttemptService {

    private final AttemptRepository attemptRepository;

    public AttemptService(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
    }

    public List<Attempt> findByCompetitionTitle(String competitionId) {
        return attemptRepository.findByCompetitionId(competitionId);
    }

    public Attempt saveAttempt(Attempt attempt) {
        return attemptRepository.save(attempt);
    }
}
