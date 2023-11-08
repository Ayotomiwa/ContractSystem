package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.DefaultTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;



public interface DefaultTemplateRepo extends MongoRepository<DefaultTemplate, String> {
    Page<DefaultTemplate> findAllBy(PageRequest pageRequest);
}
