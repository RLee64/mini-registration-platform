package com.nzpmc.backend.models;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document("event")
public class Event {
    @Id
    @NotBlank(message = "Name cannot be blank")
    private String name;
    @NotBlank(message = "Description cannot be blank")
    private String description;
    @Future(message = "Date must be in the future")
    @NotNull(message = "Date cannot be null")
    private Date date;
    private String competitionId;

    public Event(String name, String description, Date date) {
        this.name = name;
        this.description = description;
        this.date = date;
    }

    @Override
    public String toString() {
        return "Event [" +
                "name=" + name +
                ", description=" + description +
                ", date=" + date +
                "]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDate() {
        return date.toString();
    }

    public void setDate(Date date) {this.date = date; }

    public String getCompetitionId() { return competitionId; }

    public void setCompetitionId(String competitionId) { this.competitionId = competitionId; }
}
