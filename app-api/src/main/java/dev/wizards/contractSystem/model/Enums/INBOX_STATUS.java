package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum INBOX_STATUS {
    RECEIVED("RECEIVED"), ACCEPTED("ACCEPTED"), DECLINED("REJECTED");

    private final String status;
    INBOX_STATUS(String status) {
        this.status = status;
    }
}
