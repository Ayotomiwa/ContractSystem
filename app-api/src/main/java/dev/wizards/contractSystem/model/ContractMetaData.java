package dev.wizards.contractSystem.model;

import com.mongodb.lang.Nullable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class ContractMetaData {
    @Id
    private String id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private User individualOwner;
    private Business businessOwner;
    private Client recipient;
    private ContractData contractData;
}