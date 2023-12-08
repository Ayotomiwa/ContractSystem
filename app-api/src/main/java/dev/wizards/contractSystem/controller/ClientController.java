package dev.wizards.contractSystem.controller;

import dev.wizards.contractSystem.model.Business;
import dev.wizards.contractSystem.model.Client;
import dev.wizards.contractSystem.model.Enums.ROLE;
import dev.wizards.contractSystem.model.User;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.ClientRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepo clientRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;

    @PostMapping("{business-id}/clients")
    public ResponseEntity<?> addClient(@RequestBody Client client, @PathVariable("business-id") String parameter){

        User user = client.getUserRecipient();

        if(!userRepo.existsByEmail(user.getEmail())){
            user.setType(ROLE.CLIENT_NON_USER);
            userRepo.save(user);
        }

        Business businessUser= businessRepo.findById(parameter).orElse(null);
        client.setBusinessUser(businessUser);

        Business businessRecipient = businessRepo.findByCompanyName(client.getUserRecipient()
                .getBusiness().getCompanyName()).orElse(null);

        client.setBusinessRecipient(businessRecipient);

        if(!clientRepo.existsByUserRecipientEmailAndBusinessUserId(user.getEmail(), parameter)){
            client.setCreatedDate(LocalDateTime.now());
            client.setLastUpdatedDate(client.getCreatedDate());
        }
        else{
            if(clientRepo.existsByUserRecipientEmailAndBusinessUserId(user.getEmail(), parameter) && client.getId() == null){
                return ResponseEntity.badRequest().body("Client already exists");
            }
            clientRepo.findByUserRecipientEmailAndBusinessUserId(user.getEmail(), parameter).ifPresent(existingClient -> client.setCreatedDate(existingClient.getCreatedDate()));
            client.setLastUpdatedDate(LocalDateTime.now());
        }

        clientRepo.save(client);
        return ResponseEntity.ok(client);
    }

    @GetMapping("{business-id}/clients")
    public ResponseEntity<Page<Client>> getClients(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @PathVariable("business-id") String parameter){

        Page<Client> clientPages = clientRepo.findAllByBusinessUserId(
                PageRequest.of(page.orElse(0),
                        size.orElse(30L).intValue(),
                        Sort.Direction.valueOf(sort.orElse("DESC")),
                        sortBy.orElse("lastUpdatedDate")), parameter);
        return ResponseEntity.ok(clientPages);
    }



    @GetMapping("{business-id}/clients/list")
    public ResponseEntity<?> getClientsList(@PathVariable("business-id") String parameter){
        return ResponseEntity.ok(clientRepo.findAllByBusinessUserId(parameter));
    }

    @GetMapping("{business-id}/clients/search")
    public ResponseEntity<Page<Client>> searchClients(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @RequestParam(required = false) String query,
            @PathVariable("business-id") String parameter){

        if(query == null || query.trim().isEmpty()){
            return getClients(page, sortBy, sort, size, parameter);
        }

        String searchPattern = query.trim();
        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                size.orElse(30L).intValue(),
                Sort.Direction.valueOf(sort.orElse("ASC")),
                sortBy.orElse("id")
        );

        Page<Client> clientPages = clientRepo.findByRegexSearch(searchPattern, parameter, pageRequest);

        return ResponseEntity.ok(clientPages);
    }

@GetMapping("/{client-id}")
    public ResponseEntity<Client> getClientsByBusiness(@PathVariable ("client-id")String id){

        Client client = clientRepo.findById(id).orElse(null);
        if(client == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(client);
    }


//    @DeleteMapping("/{client-id}")
//    public ResponseEntity<String> deleteClient(@PathVariable("client-id") String parameter){
//        clientRepo.deleteById(parameter);
//        return ResponseEntity.ok("Client deleted");
//    }


    @GetMapping("delete/{client-id}")
    public ResponseEntity<String> deleteClient(@PathVariable("client-id") String parameter){
        clientRepo.deleteById(parameter);
        return ResponseEntity.ok("Client deleted");
    }
}


