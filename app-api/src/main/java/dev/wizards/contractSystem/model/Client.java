package dev.wizards.contractSystem.model;


import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    private String id;
    private User userRecipient;
    private Business businessRecipient;
    private Business businessUser;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;
}
