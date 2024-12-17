package com.nzpmc.backend.dtos;

import com.nzpmc.backend.models.Account;
import org.springframework.http.ResponseEntity;

public class AuthObjects {
    private Account account;
    private JWTDetails jwtDetails;
    private ResponseEntity<Object> responseEntity;

    public AuthObjects(Account account, JWTDetails jwtDetails, ResponseEntity<Object> responseEntity) {
        this.account = account;
        this.jwtDetails = jwtDetails;
        this.responseEntity = responseEntity;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public JWTDetails getJwtDetails() {
        return jwtDetails;
    }

    public void setJwtDetails(JWTDetails jwtDetails) {
        this.jwtDetails = jwtDetails;
    }

    public ResponseEntity<Object> getResponseEntity() {
        return responseEntity;
    }

    public void setResponseEntity(ResponseEntity<Object> responseEntity) {
        this.responseEntity = responseEntity;
    }
}
