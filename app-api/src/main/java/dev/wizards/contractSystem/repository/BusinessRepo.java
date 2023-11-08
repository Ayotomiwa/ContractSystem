package dev.wizards.contractSystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface BusinessRepo extends MongoRepository<BusinessRepo, String>{

}
