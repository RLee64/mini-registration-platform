package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record AttemptDetails(
        @NotBlank(message = "Competition title cannot be blank")
        String competitionTitle,
        @NotNull(message = "Missing attempt info")
        Map<String, Integer> attempts) {
}
