package com.nzpmc.backend.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document("attempt")
public class Attempt {
    @NotBlank(message = "Student email cannot be blank")
    String studentEmail;
    @NotBlank(message = "Competition id cannot be blank")
    String competitionId;
    @NotNull(message = "Missing attempt info")
    Map<String, Integer> attempts; // Key is the question title and value is student's attempt (i.e. choice index)

    public Attempt(String studentEmail, String competitionId, Map<String, Integer> attempts) {
        this.studentEmail = studentEmail;
        this.competitionId = competitionId;
        this.attempts = attempts;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getCompetitionId() {
        return competitionId;
    }

    public void setCompetitionId(String competitionId) {
        this.competitionId = competitionId;
    }

    public Map<String, Integer> getAttempts() {
        return attempts;
    }

    public void setAttempts(Map<String, Integer> attempts) {
        this.attempts = attempts;
    }
}
