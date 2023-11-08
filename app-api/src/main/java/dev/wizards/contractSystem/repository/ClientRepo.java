package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Client;
import dev.wizards.contractSystem.model.DefaultTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


public interface ClientRepo extends MongoRepository<Client, String> {

    Page<Client> findAllById(PageRequest pageRequest, String id );

    Page<Client> findAllByBusinessId(PageRequest of, String id);
}
