package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Business;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface BusinessRepo extends MongoRepository<Business, String>{


    boolean existsByCompanyName(String companyName);
}
