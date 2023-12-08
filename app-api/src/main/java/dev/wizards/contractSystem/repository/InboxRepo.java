package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Enums.INBOX_STATUS;
import dev.wizards.contractSystem.model.Inbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface InboxRepo extends MongoRepository<Inbox, String> {


    Page<Inbox> findAllByTo(PageRequest of, String email);

    Page<Inbox> findAllByToIn(PageRequest of, List<String> emails);


    Page<Inbox> findAllByToInAndStatus(PageRequest pageRequest, List<String> emails, INBOX_STATUS status);

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

    Inbox findByContractId(String contractId);
    Page<Inbox> findByStatusAndTo(PageRequest of, INBOX_STATUS status, String email);
}
