package com.nzpmc.backend.dtos;

import com.nzpmc.backend.models.Question;

// A question request contains both the question object, and the competition it needs to be assigned to
public record QuestionRequest(Question question, String competitionTitle) {
}
