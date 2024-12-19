package com.nzpmc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginDetails(@NotBlank(message = "Email cannot be blank") String email,
                           @NotBlank(message = "Password cannot be blank") String password) {
}
