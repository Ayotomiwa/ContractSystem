package dev.wizards.contractSystem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String id;
    private String firstName;
    private String lastName;
    private String businessId;
}
