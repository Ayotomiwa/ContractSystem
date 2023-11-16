package dev.wizards.contractSystem.model.Enums;

import lombok.Data;
import lombok.Getter;

@Getter
public enum PSTYPE {
    PRODUCT("PRODUCT"), SERVICE("SERVICE");

    private final String type;
    PSTYPE(String type) {
        this.type = type;
    }
}
