package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.CustomTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface CustomTemplateRepo extends MongoRepository<CustomTemplate, String> {

    Page<CustomTemplate> findAllByBusinessOwnerId(PageRequest id, String parameter);
}
