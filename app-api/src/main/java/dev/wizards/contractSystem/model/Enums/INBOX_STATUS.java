package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum INBOX_STATUS {
    UNREAD("UNREAD"), DECLINED("DECLINED"), ATTENTION("ATTENTION"), SIGNED("SIGNED");

    private final String status;
    INBOX_STATUS(String status) {
        this.status = status;
    }
}
