package dev.wizards.contractSystem.model;

import dev.wizards.contractSystem.model.Enums.CONTRACT_TYPE;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document
public class CustomTemplate {
    @Id
    private String id;
    private String name;
    private String industry;
    private CONTRACT_TYPE type;
    private User individualOwner;
    private Business businessOwner;
    private Map<String, Object> data;
}