package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.ContractData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


public interface ContractDataRepo extends MongoRepository<ContractData, String> {
    Page<ContractData> findAllByUserOwnerBusinessId(PageRequest pageRequest, String businessOwnerId);

    Page<ContractData> findAllByUserOwnerId(PageRequest of, String userId);

    Page<ContractData> findAllByUserOwnerIdOrRecipientEmail(PageRequest of, String userId, String email);

    Page<ContractData> findAllByUserOwnerBusinessIdOrRecipientId(PageRequest of, String id, String id1);


    Page<ContractData> findAllByUserOwnerIdOrRecipientEmailAndOwnerStageOrRecipientStage(PageRequest of, String userId, String email, String searchPattern, String searchPattern1);

    Page<ContractData> findAllByUserOwnerBusinessIdOrRecipientIdAndOwnerStageOrRecipientStage(PageRequest of, String id, String id1, String searchPattern, String searchPattern1);



    @Query("{$and: [" +
            "{'userUserId': ?1}," +
            "{$or: [" +
            "{'name': {$regex: ?0, $options: 'i'}}, " +
            "{'recipientEmail': {$regex: ?0, $options: 'i'}}, " +
//            "{'userRecipient.email': {$regex: ?0, $options: 'i'}}," +
//            "{'userRecipient.business.companyName': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<ContractData> regexSearchUser(String searchPattern, String userId, PageRequest pageRequest);


    @Query("{$and: [" +
            "{'businessUserId': ?1}," +
            "{$or: [" +
            "{'recipientEmail': {$regex: ?0, $options: 'i'}}, " +
            "{'name': {$regex: ?0, $options: 'i'}}, " +
//            "{'userRecipient.email': {$regex: ?0, $options: 'i'}}," +
//            "{'userRecipient.business.companyName': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<ContractData> regexSearchBusiness(String searchPattern, String id, PageRequest pageRequest);
}
