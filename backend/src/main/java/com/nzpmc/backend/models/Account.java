package com.nzpmc.backend.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("account")
public class Account {
    @Id
    @Email(message = "Not a valid email address")
    @NotBlank(message = "Email cannot be blank")
    private String email;
    @NotBlank(message = "Name cannot be blank")
    private String name;
    @NotBlank(message = "Password cannot be blank")
    private String password;
    @NotBlank(message = "Access level cannot be blank")
    private String accessLevel;

    public Account(String email, String name, String password, String accessLevel) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.accessLevel = accessLevel;
    }

    @Override
    public String toString() {
        return "Account [" +
                "email=" + email +
                ", name=" + name +
                ", accessLevel=" + accessLevel +
                "]";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }
}
