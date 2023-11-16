package dev.wizards.contractSystem.model;

import dev.wizards.contractSystem.model.Enums.PSTYPE;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;


@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class ProductServices {
    @Id
    private String id;
    private String name;
    private String description;
    private PSTYPE type;
    private BigDecimal price;
    private String businessId;
}

