package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum INBOX_STATUS {
    RECEIVED("RECEIVED"), ACCEPTED("ACCEPTED"), DECLINED("DECLINED");

    private final String status;
    INBOX_STATUS(String status) {
        this.status = status;
    }
}
