package dev.wizards.contractSystem.model;

import dev.wizards.contractSystem.model.Enums.STATUS;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class ContractData {
    @Id
    private String id;
    private String name;


    private Map<String,Object> placeholders;
    private Map<String, Object> data;
    private String templateId;
    private String message;
    private User userOwner;
    private User recipient;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private STATUS ownerStage;
    private STATUS recipientStage;
    private boolean signedUser;
    private LocalDateTime signedUserDate;
    private LocalDateTime signedRecipientDate;
    private boolean signedRecipient;

}

