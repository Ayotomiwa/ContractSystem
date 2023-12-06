package dev.wizards.contractSystem.model;


import dev.wizards.contractSystem.model.Enums.INBOX_STATUS;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Inbox {
    @Id
    private String id;
    private String to;
    private String from;
    private String title;
    private LocalDateTime sent;
    private LocalDateTime received;
    private Boolean isAccepted;
    private String contractId;
    private INBOX_STATUS status;
}
