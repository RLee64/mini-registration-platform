package com.nzpmc.backend.models;

import java.util.ArrayList;
import java.util.List;

public class Student extends Account {

    private List<String> joinedEvents = new ArrayList<>();

    public Student(String email, String name, String password, List<String> joinedEvents) {
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

    public List<String> getJoinedEvents() {
        return joinedEvents;
    }

    public void setJoinedEvents(List<String> joinedEvents) {
        this.joinedEvents = joinedEvents;
    }

    public void addJoinedEvent(String event) {
        joinedEvents.add(event);
    }
}
