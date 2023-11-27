package dev.wizards.contractSystem.model.Enums;

import lombok.Getter;

@Getter
public enum CONTRACT_TYPE {
    HR("HR"), LEASE("LEASE"), EMPLOYMENT("EMPLOYMENT"), PURCHASE("PURCHASE"), COMMERCIAL("COMMERCIAL"),
    REAL_ESTATE("REAL_ESTATE"), CONFIDENTIALITY("CONFIDENTIALITY"), OTHER("OTHER");

    private final String type;
    CONTRACT_TYPE(String type) {
        this.type = type;
    }

}
