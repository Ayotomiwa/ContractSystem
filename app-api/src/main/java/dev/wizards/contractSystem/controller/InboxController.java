package dev.wizards.contractSystem.controller;


import dev.wizards.contractSystem.model.ContractData;
import dev.wizards.contractSystem.model.Enums.INBOX_STATUS;
import dev.wizards.contractSystem.model.Enums.STATUS;
import dev.wizards.contractSystem.model.Inbox;
import dev.wizards.contractSystem.model.User;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.ContractDataRepo;
import dev.wizards.contractSystem.repository.InboxRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import dev.wizards.contractSystem.service.ServiceImpl.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inbox")
@RequiredArgsConstructor
public class InboxController {


    private final ContractDataRepo contractRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;
    private final MailService mailService;
    private final InboxRepo inboxRepo;


    @GetMapping("/{user-id}")
    public ResponseEntity<?> getInbox(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @PathVariable("user-id") String userId){

        if(!userRepo.existsById(userId)){
            return ResponseEntity.badRequest().body("User does not exist");
        }

        User user = userRepo.findById(userId).get();
        Page<Inbox> inbox;

        if(user.getBusiness() == null){
            inbox = inboxRepo.findAllByTo(
                    PageRequest.of(page.orElse(0),
                            size.orElse(30L).intValue(),
                            Sort.Direction.valueOf(sort.orElse("DESC")),
                            sortBy.orElse("received")),
                    user.getEmail());
        }
        else {
            String businessId = user.getBusiness().getId();
            List<User> users = userRepo.findAllByBusinessId(businessId);
            if(users.isEmpty()){
                return ResponseEntity.badRequest().body("Your business does not have any users");
            }

            List<String> emails = users.stream().map(User::getEmail).toList();

             inbox= inboxRepo.findAllByToIn(
                    PageRequest.of(page.orElse(0),
                            size.orElse(30L).intValue(),
                            Sort.Direction.valueOf(sort.orElse("DESC")),
                            sortBy.orElse("received")),
                    emails);
        }
        return ResponseEntity.ok(inbox);
    }


    @GetMapping("/{inbox-id}/contract")
    public ResponseEntity<?> getInbox(@PathVariable("inbox-id") String inboxId){
        if(!inboxRepo.existsById(inboxId)){
            return ResponseEntity.badRequest().body("Contract does not exist");
        }

        Inbox inbox = inboxRepo.findById(inboxId).get();
        return ResponseEntity.ok(inbox);
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
            return getInbox(page, sortBy, sort, size, userId);
        }

        Page<Inbox> contracts;

        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                size.orElse(30L).intValue(),
                Sort.Direction.valueOf(sort.orElse("ASC")),
                sortBy.orElse("id")
        );

        String searchPattern = query.trim();
        User user = userRepo.findById(userId).get();

        try {
           INBOX_STATUS status = INBOX_STATUS.valueOf(searchPattern.toUpperCase());
            if (user.getBusiness() == null) {
                contracts = inboxRepo.findByStatusAndTo(
                        PageRequest.of(page.orElse(0),
                                size.orElse(30L).intValue(),
                                Sort.Direction.valueOf(sort.orElse("DESC")),
                                sortBy.orElse("received")),
                        status, user.getEmail());
            } else {
                String businessId = user.getBusiness().getId();
                List<User> users = userRepo.findAllByBusinessId(businessId);
                List<String> emails = users.stream().map(User::getEmail).toList();

                contracts = inboxRepo.findAllByToInAndStatus(
                        PageRequest.of(page.orElse(0),
                                size.orElse(30L).intValue(),
                                Sort.Direction.valueOf(sort.orElse("DESC")),
                                sortBy.orElse("received")),
                        emails, status);

            }
        } catch (IllegalArgumentException e) {
            if (user.getBusiness() == null) {
                contracts = inboxRepo.regexSearchUser(
                        searchPattern, userId, pageRequest);
            } else {
                String businessId = user.getBusiness().getId();
                List<User> users = userRepo.findAllByBusinessId(businessId);

                List<String> emails = users.stream().map(User::getEmail).toList();

                contracts = inboxRepo.regexSearchBusiness(
                        searchPattern, emails, pageRequest);
            }
        }
        return ResponseEntity.ok(contracts);
    }



    @PostMapping("/{contract-id}/{status}")
    public ResponseEntity<?> updateInboxStatus(@PathVariable("contract-id") String id, @PathVariable("status") String status){

        if(inboxRepo.existsById(id)){
            id = inboxRepo.findById(id).get().getContractId();
        }


        if(!contractRepo.existsById(id)){
            return ResponseEntity.badRequest().body("Contract does not exist");
        }

        Inbox inbox = inboxRepo.findByContractId(id);
        String contractId = inbox.getContractId();
        ContractData contract = contractRepo.findById(contractId).get();

        if(status.equals("SIGNED")){
            inbox.setStatus(INBOX_STATUS.SIGNED);
            inbox.setIsAccepted(true);
            contract.setSignedRecipient(true);
            contract.setModifiedAt(LocalDateTime.now());
            contract.setOwnerStage(STATUS.SIGNED);
            contract.setRecipientStage(STATUS.SIGNED);
            contract.setSignedRecipientDate(LocalDateTime.now());
            inboxRepo.save(inbox);
            contractRepo.save(contract);
            return ResponseEntity.ok(inbox);
        }

        if(status.equals("ACCEPTED")){
            inbox.setIsAccepted(true);
            inbox.setStatus(INBOX_STATUS.ATTENTION);
            inboxRepo.save(inbox);

            contract.setRecipientStage(STATUS.ATTENTION);
            contract.setOwnerStage(STATUS.PENDING);
            contract.setModifiedAt(LocalDateTime.now());
            contractRepo.save(contract);
            return ResponseEntity.ok(inbox);
        }
        else if(status.equals("DECLINED")){
            inbox.setIsAccepted(false);
            inbox.setStatus(INBOX_STATUS.DECLINED);
            contract.setOwnerStage(STATUS.DECLINED);
            contract.setRecipientStage(STATUS.DECLINED);
            contract.setModifiedAt(LocalDateTime.now());
            inboxRepo.save(inbox);
            contractRepo.save(contract);
            return ResponseEntity.ok(inbox);
        }
        else{
            return ResponseEntity.badRequest().body("Invalid status");
        }
    }


    @PostMapping("delete/{inbox-id}")
    public ResponseEntity<String> deleteContract(@PathVariable("inbox-id") String id){

        boolean inboxExist = inboxRepo.existsById(id);
        try{
            if(inboxExist){
                inboxRepo.deleteById(id);
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
