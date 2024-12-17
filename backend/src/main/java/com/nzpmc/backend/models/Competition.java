package com.nzpmc.backend.models;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("competition")
public class Competition {
    @Id
    @NotBlank(message = "Title cannot be blank")
    private String title;
    private List<String> questionIds;

    public Competition(String title, List<String> questionIds) {
        this.title = title;
        this.questionIds = questionIds;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<String> questionIds) {
        this.questionIds = questionIds;
    }
}
