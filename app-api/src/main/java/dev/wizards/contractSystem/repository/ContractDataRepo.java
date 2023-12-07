package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.ContractData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


public interface ContractDataRepo extends MongoRepository<ContractData, String> {
    Page<ContractData> findAllByUserOwnerBusinessId(PageRequest pageRequest, String businessOwnerId);

    Page<ContractData> findAllByUserOwnerId(PageRequest of, String userId);


    @Query("{$and: [" +
            "{'userOwner.id': ?1}," +
            "{$or: [" +
            "{'name': {$regex: ?0, $options: 'i'}}, " +
            "{'recipient.email': {$regex: ?0, $options: 'i'}}, " +
            "{'recipient.business.companyName': {$regex: ?0, $options: 'i'}}," +
//            "{'userRecipient.business.companyName': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<ContractData> regexSearchUser(String searchPattern, String userId, PageRequest pageRequest);


    @Query("{$and: [" +
            "{'userOwner.business.id': ?1}," +
            "{$or: [" +
            "{'recipient.email': {$regex: ?0, $options: 'i'}}, " +
            "{'name': {$regex: ?0, $options: 'i'}}, " +
            "{'recipient.business.companyName': {$regex: ?0, $options: 'i'}}," +
//            "{'userRecipient.business.companyName': {$regex: ?0, $options: 'i'}}" +
            "]}" +
            "]}")
    Page<ContractData> regexSearchBusiness(String searchPattern, String id, PageRequest pageRequest);


    @Query("{" +
            "$or: [" +
            "{" +
            "'userOwner.business.id': ?0," +
            "'ownerStage': ?1" +
            "}," +
            "]" +
            "}")
    Page<ContractData> findByBusinessIdAndMatchingStatus(PageRequest pageRequest, String businessId, String status);

    @Query("{" +
            "$or: [" +
            "{" +
            "'userOwner.id': ?0," +
            "'ownerStage': ?1" +
            "}," +
            "]" +
            "}")
    Page<ContractData> findByUserIdAndMatchingStatus(PageRequest pageRequest, String userId, String status);

    Page<ContractData> findAllByUserOwnerBusinessIdOrUserOwnerId(PageRequest of, String id, String userId);
}


