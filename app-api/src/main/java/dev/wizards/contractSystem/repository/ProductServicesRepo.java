package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.ProductServices;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


public interface ProductServicesRepo extends MongoRepository<ProductServices, String>{

    boolean existsByName(String name);

    Page<ProductServices> findAllByBusinessId(PageRequest of, String parameter);


    @Query("{$and: [" +
            "{'businessId': ?1}," +
            "{$or: [" +
            "{'name': {$regex: ?0, $options: 'i'}}, " +
            "{'description': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<ProductServices> findByRegexSearch(String searchPattern, String parameter, PageRequest pageRequest);
}
