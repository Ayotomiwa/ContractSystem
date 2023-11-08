package dev.wizards.contractSystem.model;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Data
@Document
@NoArgsConstructor
@AllArgsConstructor
public class Business{
    @Id
    private String id;
    private String companyName;
    private String industry;
    private List<User> employees = new ArrayList<>();
    private List<Client> clients = new ArrayList<>();
    private List<ProductServices> productsServices = new ArrayList<>();
    private List<CustomTemplate> customTemplates = new ArrayList<>();
    private List<ContractMetaData> contractMetaData = new ArrayList<>();
}
