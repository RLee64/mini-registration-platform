package com.nzpmc.backend.services;

import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.repository.CompetitionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    public CompetitionService(CompetitionRepository competitionRepository) {
        this.competitionRepository = competitionRepository;
    }

    public Boolean competitionExists(String title) {
        return competitionRepository.existsByTitleIgnoreCase(title);
    }

    public List<Competition> findAllCompetitions() {
        return competitionRepository.findAll();
    }

    public Competition createCompetition(Competition competition) {
        return competitionRepository.save(competition);
    }
}
