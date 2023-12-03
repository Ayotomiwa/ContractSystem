package dev.wizards.contractSystem.controller;


import com.mailjet.client.errors.MailjetException;
import dev.wizards.contractSystem.model.*;
import dev.wizards.contractSystem.model.Enums.INBOX_STATUS;
import dev.wizards.contractSystem.model.Enums.ROLE;
import dev.wizards.contractSystem.model.Enums.STATUS;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.ContractDataRepo;
import dev.wizards.contractSystem.repository.InboxRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import dev.wizards.contractSystem.service.ServiceImpl.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractDataRepo contractRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;
    private final MailService mailService;
    private final InboxRepo inboxRepo;

    @PostMapping("/{user-id}")
    public ResponseEntity<?> addContract(@RequestBody ContractData contract,
                                         @PathVariable("user-id") String userId){

        if(!userRepo.existsById(userId)){
            return ResponseEntity.badRequest().body("User does not exist");
        }
        if(!businessRepo.existsById(userRepo.findById(userId).get().getBusiness().getId())){
            return ResponseEntity.badRequest().body("Only business Users are authorized to create contracts");
        }
//        if(contract.getRecipient().getEmail() == null){
//            return ResponseEntity.badRequest().body("Recipient Email is required");
//        }
       contract.setUserOwner(userRepo.findById(userId).get());
        if(contract.getId() == null){
            contract.setCreatedAt(LocalDateTime.now());
            contract.setOwnerStage(STATUS.DRAFT);
        }

//        if(userRepo.findByEmail(contract.getRecipientEmail()).isPresent()){
//            String recipientId = userRepo.findByEmail(contract.getRecipientEmail()).get().getId();
//            contract.setRecipientId(recipientId);
//        }
//        else{
//            User user = new User();
//            user.setEmail(contract.getRecipientEmail());
//            user.setType(ROLE.CLIENT_NON_USER);
//            userRepo.save(user);
//        }

        contract.setModifiedAt(LocalDateTime.now());
        contractRepo.save(contract);
        return ResponseEntity.ok(contract);
    }

    @PostMapping("/{user-id}/send")
    public ResponseEntity<?> sendContract(@RequestBody ContractData ctrct,@PathVariable("user-id") String userId){

        ResponseEntity<?> contractSaveResponse = addContract(ctrct, userId);


        if(contractSaveResponse.getStatusCode() != HttpStatus.OK){
            return ResponseEntity.badRequest().body("Contract could not be saved");
        }

        ContractData contract = (ContractData) contractSaveResponse.getBody();
        System.out.println("contract  " + contract);


        assert contract != null;
        String recipientEmail = contract.getRecipient().getEmail();

        if(recipientEmail == null){
            return ResponseEntity.badRequest().body("Recipient Email is needed");
        }


        System.out.println("recipient " + recipientEmail);

        String userEmail = userRepo.findById(contract.getUserOwner().getId()).get().getEmail();
        System.out.println("userEmail " + recipientEmail);

        if(recipientEmail.equals(userEmail)){
            return ResponseEntity.badRequest().body("You cannot send a contract to yourself");
        }


        Context context = new Context();
        context.setVariable("contract", contract);
        context.setVariable("signinLink", "http://192.168.2.116:3000/register");
        Inbox inbox = new Inbox();
        try {
            inbox.setTo(contract.getRecipient().getEmail());
            inbox.setFrom(userEmail);
            inbox.setSent(LocalDateTime.now());

            mailService.sendEmail(recipientEmail, "New Contract", context, "contract");

            if(userRepo.findByEmail(recipientEmail).isPresent()){
                User recipient = userRepo.findByEmail(recipientEmail).get();
                contract.setRecipient(recipient);
            }
            else{
                User user = new User();
                user.setEmail(recipientEmail);
                user.setType(ROLE.CLIENT_NON_USER);
                userRepo.save(user);
            }

            inbox.setReceived(LocalDateTime.now());
            contract.setOwnerStage(STATUS.SENT);

            inbox.setIsAccepted(false);
            inbox.setStatus(INBOX_STATUS.RECEIVED);

        } catch (MailjetException e) {
            throw new RuntimeException(e);
        }

        inbox.setContractId(contract.getId());
        contractRepo.save(contract);
        inboxRepo.save(inbox);
        return ResponseEntity.ok(contract);
    }



    @PostMapping("{user-id}/sign/{contract-id}")
    public ResponseEntity<?> signContract(@PathVariable("contract-id") String contractId, @PathVariable("user-id") String parameter){
        if(!contractRepo.existsById(contractId)){
            return ResponseEntity.badRequest().body("Contract does not exist");
        }
        if(!userRepo.existsById(parameter)){
            return ResponseEntity.badRequest().body("User does not exist");
        }

        ContractData contract = contractRepo.findById(contractId).get();
        contract.setSignedUser(true);
        contract.setOwnerStage(STATUS.SIGNED);
        contract.setRecipientStage(STATUS.SIGNED);
        contract.setModifiedAt(LocalDateTime.now());
        contractRepo.save(contract);
        return ResponseEntity.ok(contract);
    }


    @GetMapping("/{user-id}")
    public ResponseEntity<?>getContracts(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @PathVariable("user-id") String userId){

        if(!userRepo.existsById(userId)){
            return ResponseEntity.badRequest().body("User does not exist");
        }
        User user = userRepo.findById(userId).get();

        Page<ContractData> contracts;


        if(user.getBusiness() == null){
             contracts = contractRepo.findAllByUserOwnerIdOrRecipientEmail(
                    PageRequest.of(page.orElse(0),
                            size.orElse(30L).intValue(),
                            Sort.Direction.valueOf(sort.orElse("DESC")),
                            sortBy.orElse("lastUpdatedDate")),
                    userId, user.getEmail());
        }
        else{

           contracts = contractRepo.findAllByUserOwnerBusinessIdOrRecipientId(
                    PageRequest.of(page.orElse(0),
                            size.orElse(30L).intValue(),
                            Sort.Direction.valueOf(sort.orElse("DESC")),
                            sortBy.orElse("lastUpdatedDate")),
                    user.getBusiness().getId(), user.getBusiness().getId());
           }

        return ResponseEntity.ok(contracts);
    }



    @GetMapping("/{contract-id}/edit")
    public ResponseEntity<?> getContract(@PathVariable("contract-id") String parameter){
        ContractData contract = contractRepo.findById(parameter)
                .orElse(null);
        return ResponseEntity.ok(contract);
    }




    @GetMapping("/{user-id}/search")
    public ResponseEntity<?> searchContract(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @RequestParam(required = false) String query,
            @PathVariable("user-id") String userId) {

        if (!userRepo.existsById(userId)) {
            return ResponseEntity.badRequest().body("User does not exist");
        }

        if (query == null || query.trim().isEmpty()) {
            return getContracts(page, sortBy, sort, size, userId);
        }


        Page<ContractData> contracts;

        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                size.orElse(30L).intValue(),
                Sort.Direction.valueOf(sort.orElse("ASC")),
                sortBy.orElse("id")
        );

        String searchPattern = query.trim();
        User user = userRepo.findById(userId).get();

        try {
            STATUS status = STATUS.valueOf(searchPattern.toUpperCase());
                if (user.getBusiness() == null) {
                    contracts = contractRepo.findAllByUserOwnerIdOrRecipientEmailAndOwnerStageOrRecipientStage(
                            PageRequest.of(page.orElse(0),
                                    size.orElse(30L).intValue(),
                                    Sort.Direction.valueOf(sort.orElse("DESC")),
                                    sortBy.orElse("lastUpdatedDate")),
                            userId, user.getEmail(), searchPattern.toUpperCase(), searchPattern.toUpperCase());
                } else {
                    contracts = contractRepo.findAllByUserOwnerBusinessIdOrRecipientIdAndOwnerStageOrRecipientStage(
                            PageRequest.of(page.orElse(0),
                                    size.orElse(30L).intValue(),
                                    Sort.Direction.valueOf(sort.orElse("DESC")),
                                    sortBy.orElse("lastUpdatedDate")),
                            user.getBusiness().getId(), user.getBusiness().getId(), searchPattern.toUpperCase(), searchPattern.toUpperCase());
                }
        } catch (IllegalArgumentException e) {
            if (user.getBusiness() == null) {
                contracts = contractRepo.regexSearchUser(
                        searchPattern, userId, pageRequest);
            } else {
                contracts = contractRepo.regexSearchBusiness(
                        searchPattern, user.getBusiness().getId(), pageRequest);
            }
        }
       return ResponseEntity.ok(contracts);
    }



//    @GetMapping("/inbox/{user-id}")
//    public ResponseEntity<?> getInbox(
//            @RequestParam Optional<Integer> page,
//            @RequestParam Optional<String> sortBy,
//            @RequestParam Optional<String> sort,
//            @RequestParam Optional<Long> size,
//            @PathVariable("user-id") String userId){
//
//       if(!userRepo.existsById(userId)){
//           return ResponseEntity.badRequest().body("User does not exist");
//         }
//
//      User user = userRepo.findById(userId).get();
//       Page<Inbox> inbox;
//
//        if(user.getBusiness() == null){
//           inbox = inboxRepo.findAllByTo(
//                PageRequest.of(page.orElse(0),
//                        size.orElse(30L).intValue(),
//                        Sort.Direction.valueOf(sort.orElse("DESC")),
//                        sortBy.orElse("lastUpdatedDate")),
//                user.getEmail());
//         }
//        else {
//            String businessId = user.getBusiness().getId();
//            List<User> users = userRepo.findAllByBusinessId(businessId);
//            if(users.isEmpty()){
//                return ResponseEntity.badRequest().body("Your business does not have any users");
//            }
//            inbox = inboxRepo.findAllByTo(
//                    PageRequest.of(page.orElse(0),
//                            size.orElse(30L).intValue(),
//                            Sort.Direction.valueOf(sort.orElse("DESC")),
//                            sortBy.orElse("lastUpdatedDate")),
//                    users.get(0).getEmail());
//
//        }
//        return ResponseEntity.ok(inbox);
//    }
//
//
//    @PostMapping("/inbox/{inbox-id}/{status}")
//    public ResponseEntity<?> updateInboxStatus(@PathVariable("inbox-id") String inboxId, @PathVariable("status") String status){
//        if(!inboxRepo.existsById(inboxId)){
//            return ResponseEntity.badRequest().body("Contract does not exist");
//        }
//
//        Inbox inbox = inboxRepo.findById(inboxId).get();
//
//        String oldContractId = inbox.getContractId();
//        ContractData oldContract = contractRepo.findById(oldContractId).get();
//        ContractData newContract = new ContractData(oldContract);
//
//        if(status.equals("ACCEPTED")){
//            inbox.setIsAccepted(true);
//            inbox.setStatus(INBOX_STATUS.ACCEPTED);
//            inbox.setContractId(contractRepo.save(newContract).getId());
//            inboxRepo.save(inbox);
//
//            oldContract.setRecipientStage(STATUS.REVIEW);
//            oldContract.setOwnerStage(STATUS.PENDING);
//            oldContract.setModifiedAt(LocalDateTime.now());
//            contractRepo.save(oldContract);
//            return ResponseEntity.ok(inbox);
//        }
//        else if(status.equals("DECLINED")){
//            inbox.setIsAccepted(false);
//            inbox.setStatus(INBOX_STATUS.DECLINED);
//            oldContract.setOwnerStage(STATUS.DECLINED);
//            oldContract.setRecipientStage(STATUS.DECLINED);
//            oldContract.setModifiedAt(LocalDateTime.now());
//            inboxRepo.save(inbox);
//            contractRepo.save(oldContract);
//            return ResponseEntity.ok(inbox);
//        }
//        else{
//            return ResponseEntity.badRequest().body("Invalid status");
//        }
//    }


    @PostMapping("delete/{contract-id}")
    public ResponseEntity<String> deleteContract(@PathVariable("contract-id") String id){

        boolean contractExist = contractRepo.existsById(id);
        try{
            if(contractExist){
                contractRepo.deleteById(id);
            }
            else{
                return ResponseEntity.badRequest().body("Contract does not exist");
            }
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok("Contract deleted");
    }


}


