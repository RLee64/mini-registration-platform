package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record CompetitionLinkDetails(
        @NotBlank(message = "Event Name cannot be empty")
        String eventName,
        @NotBlank(message = "Competition Title cannot be empty")
        String competitionTitle) {
}
