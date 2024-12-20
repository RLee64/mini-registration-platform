package com.nzpmc.backend.dtos;

import java.util.Map;

public record EventResults(
        String eventName,
        Integer totalQuestions,
        Map<String, Integer> results // Key is the student's email and value is the score they got
) {
}
