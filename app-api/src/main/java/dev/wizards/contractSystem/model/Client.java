package dev.wizards.contractSystem.model;

import dev.wizards.contractSystem.model.Enums.ROLE;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    private String id;
    private User user;
    private Business business;
}
