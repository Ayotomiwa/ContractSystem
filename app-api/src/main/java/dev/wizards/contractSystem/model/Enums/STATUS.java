package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum STATUS {

    SENT("SENT"), SIGNED("SIGNED"), EXPIRED("EXPIRED"), REVIEW("REVIEW"),
    DRAFT("DRAFT"), CANCELLED("CANCELLED"), DECLINED("DECLINED"), ACCEPTED("ACCEPTED"), PENDING("PENDING");

    private final String status;

    STATUS(String status) {
        this.status = status;
    }

}
