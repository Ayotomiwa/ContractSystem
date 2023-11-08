package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum ROLE {
    BUSINESS_USER("BUSINESS"), INDIVIDUAL_USER("INDIVIDUAL"), CLIENT_NON_USER("CLIENT");
    private final String type;
    ROLE(String type) {
        this.type = type;
    }

}
