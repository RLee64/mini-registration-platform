package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record AccountName(@NotBlank(message = "Name cannot be blank") String name) {
}
