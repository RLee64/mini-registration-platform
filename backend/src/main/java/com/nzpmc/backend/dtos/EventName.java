package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record EventName(
        @NotBlank(message = "Event name cannot be blank")
        String name) {
}
