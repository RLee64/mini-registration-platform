package com.nzpmc.backend.dtos;

import com.nzpmc.backend.models.Question;

import java.util.List;

public record CompetitionData(String competitionTitle, List<Question> questions) {
}
