package com.nzpmc.backend.dtos;

import com.nzpmc.backend.models.Competition;
import com.nzpmc.backend.models.Question;

import java.util.List;

public record CompetitionData(Competition competition, List<Question> questions) {
}
