package com.nzpmc.backend.models;

import com.nzpmc.backend.validation.NotEmptyFields;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Range;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("question")
public class Question {
    @Id
    @NotBlank
    private String title;
    @Size(min=4, max=4, message = "Answer must be 4 characters long")
    @NotEmptyFields
    private List<String> options;
    @Range(min=0, max=3)
    private int correctIndexChoice;

    public Question(String title, List<String> options, int correctIndexChoice) {
        this.title = title;
        this.options = options;
        this.correctIndexChoice = correctIndexChoice;
    }

    @Override
    public String toString() {
        return "Question{" +
                "title=" + title +
                ", options=" + options +
                ", correctIndexChoice=" + correctIndexChoice +
                '}';
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrectIndexChoice() {
        return correctIndexChoice;
    }

    public void setCorrectIndexChoice(int correctIndexChoice) {
        this.correctIndexChoice = correctIndexChoice;
    }
}
