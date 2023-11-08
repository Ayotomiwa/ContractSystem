package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.ProductServices;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface ProductServicesRepo extends MongoRepository<ProductServices, String>{

}
