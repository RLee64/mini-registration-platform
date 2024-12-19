package com.nzpmc.backend.dtos;

import com.nzpmc.backend.models.Question;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// A question request contains both the question object, and the competition it needs to be assigned to
public record QuestionRequest(
        @NotNull(message = "Question object must be included")
        @Valid // Ensure question object itself is also valid
        Question question,
        @NotBlank(message = "Competition title cannot be blank")
        String competitionTitle) {
}
