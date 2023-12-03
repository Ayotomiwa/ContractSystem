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

    private User userOwner;
    private User recipient;

//    private String userOwnerId;
//    private String businessOwnerId;
//    private String recipientId;
//    private String recipientEmail;


    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private STATUS ownerStage;
    private STATUS recipientStage;
    private boolean isSignedUser;
    private LocalDateTime signedUserDate;
    private LocalDateTime signedRecipientDate;
    private boolean isSignedRecipient;

    public ContractData(ContractData contractData) {
        this.id = contractData.getId();
        this.name = contractData.getName();
        this.placeholders = contractData.getPlaceholders();
        this.data = contractData.getData();
        this.templateId = contractData.getTemplateId();
          this.userOwner = contractData.getUserOwner();
            this.recipient = contractData.getRecipient();
        this.createdAt = contractData.getCreatedAt();
        this.modifiedAt = contractData.getModifiedAt();
        this.ownerStage = contractData.getOwnerStage();
        this.recipientStage = contractData.getRecipientStage();
        this.isSignedUser = contractData.isSignedUser();
        this.isSignedRecipient = contractData.isSignedRecipient();
        this.signedUserDate = contractData.getSignedUserDate();
        this.signedRecipientDate = contractData.getSignedRecipientDate();
    }
}

