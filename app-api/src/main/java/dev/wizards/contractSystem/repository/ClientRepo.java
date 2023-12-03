package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Client;
import dev.wizards.contractSystem.model.DefaultTemplate;
import dev.wizards.contractSystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface ClientRepo extends MongoRepository<Client, String> {

    Page<Client> findAllById(PageRequest pageRequest, String id );

    Page<Client> findAllByBusinessUserId(PageRequest of, String id);

    boolean existsByUserRecipient(User olduser);

    @Query("{$and: [" +
            "{'businessUserId': ?1}," +
            "{$or: [" +
            "{'userRecipient.firstName': {$regex: ?0, $options: 'i'}}, " +
            "{'userRecipient.lastName': {$regex: ?0, $options: 'i'}}, " +
            "{'userRecipient.email': {$regex: ?0, $options: 'i'}}," +
            "{'userRecipient.business.companyName': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<Client> findByRegexSearch(String searchPattern, String parameter, PageRequest pageRequest);

    boolean existsByUserRecipientEmailAndBusinessUserId(String email, String parameter);

    List<Client> findAllByBusinessUserId(String parameter);
}

