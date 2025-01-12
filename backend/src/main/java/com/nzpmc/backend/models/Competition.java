package com.nzpmc.backend.models;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document("competition")
public class Competition {
    @Id
    @NotBlank(message = "Title cannot be blank")
    private String title;
    private List<String> questionIds;
    @Future(message = "Start date must be in the future")
    @NotNull(message = "Start date cannot be null")
    private Date startDate;
    @Future(message = "End date must be in the future")
    @NotNull(message = "End date cannot be null")
    private Date endDate;

    public Competition(String title, List<String> questionIds, Date startDate, Date endDate) {
        this.title = title;
        this.questionIds = questionIds;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public void addQuestionId(String questionId) {
        this.questionIds.add(questionId);
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
