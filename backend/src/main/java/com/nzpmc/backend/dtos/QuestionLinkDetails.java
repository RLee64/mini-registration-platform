package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record QuestionLinkDetails(
        @NotBlank(message = "Competition Title cannot be empty")
        String competitionTitle,
        @NotBlank(message = "Question Title cannot be empty")
        String questionTitle
) {
}
