package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Inbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface InboxRepo extends MongoRepository<Inbox, String> {


    Page<Inbox> findAllByTo(PageRequest of, String email);

    Page<Inbox> findAllByToIn(PageRequest of, List<String> emails);

    @Query("{$and: [" +
            "{'to': ?1}," +
            "{'status': ?2}," +
            "{$or: [" +
            "{'from': {$regex: ?0, $options: 'i'}}, " +
//            "{'contractId': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<Inbox> findAllByToAndStatus(PageRequest of, String userId, String email, String upperCase, String upperCase1);


    @Query("{$and: [" +
            "{'to': {$in: ?1}}," +
            "{'status': ?2}," +
            "{$or: [" +
            "{'from': {$regex: ?0, $options: 'i'}}, " +
//            "{'contractId': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<Inbox> findAllByToInAndStatus(PageRequest of, List<String> emails, String upperCase, String upperCase1);

    @Query("{$and: [" +
            "{'to': ?1}," +
            "{'status': ?2}," +
            "{$or: [" +
            "{'from': {$regex: ?0, $options: 'i'}}, " +
//            "{'contractId': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<Inbox> regexSearchUser(String searchPattern, String userId, PageRequest pageRequest);


    @Query("{$and: [" +
            "{'to': {$in: ?1}}," +
            "{'status': ?2}," +
            "{$or: [" +
            "{'from': {$regex: ?0, $options: 'i'}}, " +
//            "{'contractId': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<Inbox> regexSearchBusiness(String searchPattern, List<String> emails, PageRequest pageRequest);
}
