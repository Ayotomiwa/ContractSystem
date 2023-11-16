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
import java.util.Optional;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepo clientRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;

    @PostMapping("{business-id}/clients")
    public ResponseEntity<Client> addClient(@RequestBody Client client, @PathVariable("business-id") String parameter){
        User user = new User();
        String clientEmail = client.getUserRecipient().getEmail();
        user.setEmail(clientEmail);
        Business businessUser= businessRepo.findById(parameter).orElse(null);

        Client newClient = new Client();

        if(!userRepo.existsByEmail(clientEmail)){
            user.setType(ROLE.CLIENT_NON_USER);
            userRepo.save(user);
            newClient.setUserRecipient(user);
            newClient.setBusinessUser(businessUser);
            newClient.setCreatedDate(LocalDate.now());
            clientRepo.save(newClient);
            return ResponseEntity.ok(newClient);
        }
        User olduser = userRepo.findByEmail(clientEmail).get();

        if(clientRepo.existsByUserRecipient(olduser)){
            return ResponseEntity.badRequest().build();
        }

        newClient.setUserRecipient(olduser);
        if(olduser.getBusiness() != null){
            Business oldBusiness = olduser.getBusiness();
            newClient.setBusinessRecipient(oldBusiness);
        }
        newClient.setBusinessUser(businessUser);
        newClient.setCreatedDate(LocalDate.now());

        clientRepo.save(newClient);
        return ResponseEntity.ok(newClient);
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
                        Sort.Direction.valueOf(sort.orElse("ASC")),
                        sortBy.orElse("id")), parameter);
        return ResponseEntity.ok(clientPages);
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


    @DeleteMapping("/{client-id}")
    public ResponseEntity<String> deleteClient(@PathVariable("client-id") String parameter){
        clientRepo.deleteById(parameter);
        return ResponseEntity.ok("Client deleted");
    }
}


