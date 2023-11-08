package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.ContractData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface ContractDataRepo extends MongoRepository<ContractData, String> {
}
