package com.nzpmc.backend.models;

import java.util.ArrayList;
import java.util.List;

public class Student extends Account {

    private List<Event> joinedEvents = new ArrayList<>();

    public Student(String email, String name, String password, List<Event> joinedEvents) {
        super(email, name, password, "student");
        if (joinedEvents != null) {
            this.joinedEvents = joinedEvents;
        }
    }

    @Override
    public String toString() {
        return "Student{" +
                "joinedEvents=" + joinedEvents +
                "} " + super.toString();
    }

    public List<Event> getJoinedEvents() {
        return joinedEvents;
    }

    public void setJoinedEvents(List<Event> joinedEvents) {
        this.joinedEvents = joinedEvents;
    }
}
