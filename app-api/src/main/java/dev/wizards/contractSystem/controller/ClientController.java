package dev.wizards.contractSystem.controller;

import dev.wizards.contractSystem.model.Business;
import dev.wizards.contractSystem.model.Client;
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

import java.util.Optional;

@RestController("api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepo clientRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;

    @PostMapping("")
    public ResponseEntity<Client> addClient(User user){
        String clientEmail = user.getEmail();
        if(!userRepo.existsByEmail(clientEmail)){
            userRepo.save(user);
            Client newClient = new Client();
            newClient.setUser(user);
            clientRepo.save(newClient);
            return ResponseEntity.ok(newClient);
        }
        User olduser = userRepo.findByEmail(clientEmail).get();
        Client newCLient = new Client();
        newCLient.setUser(olduser);
        if (olduser.getBusiness() != null) {
            Business oldBusiness = olduser.getBusiness();
            newCLient.setBusiness(oldBusiness);
        }
        clientRepo.save(newCLient);
        return ResponseEntity.ok(newCLient);
    }

    @GetMapping("business/{id}")
    public ResponseEntity<Page<Client>> getClients(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @PathVariable String id){

        Page<Client> clientPages = clientRepo.findAllByBusinessId(
                PageRequest.of(page.orElse(0),
                        size.orElse(30L).intValue(),
                        Sort.Direction.valueOf(sort.orElse("ASC")),
                        sortBy.orElse("id")), id);
        return ResponseEntity.ok(clientPages);
    }

@GetMapping("/{id}")
    public ResponseEntity<Client> getClientsByBusiness(@PathVariable String id){

        Client client = clientRepo.findById(id).orElse(null);
        if(client == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(client);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable String id){
        clientRepo.deleteById(id);
        return ResponseEntity.ok("Client deleted");
    }
}


