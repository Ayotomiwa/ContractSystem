package dev.wizards.contractSystem.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class ContractData {
    @Id
    private String id;
    private Map<String, Object> data;
    private boolean isSigned;
}

