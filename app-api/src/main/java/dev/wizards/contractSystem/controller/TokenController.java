package dev.wizards.contractSystem.controller;


import dev.wizards.contractSystem.config.Security.JwtTokenProvider;
import dev.wizards.contractSystem.model.LoginRequest;
import dev.wizards.contractSystem.model.LoginResponse;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/authenticate")
public class TokenController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;

    @Autowired
    public TokenController(AuthenticationManager authenticationManager,
                           JwtTokenProvider jwtTokenProvider, UserRepo userRepo, BusinessRepo businessRepo) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepo = userRepo;
        this.businessRepo = businessRepo;
    }

    @PostMapping("")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginRequest loginRequest) {


        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            String id = userRepo.findByEmail(userDetails.getUsername()).get().getId();
            String firstName = userRepo.findById(id).get().getFirstName();
            String lastName = userRepo.findById(id).get().getLastName();
            System.out.println("User: " + id + " " + firstName + " " + lastName);
            String businessId = userRepo.findByEmail(userDetails.getUsername()).get().getBusiness().getId();

            return ResponseEntity.ok(new LoginResponse(jwt, userDetails.getUsername(),id, firstName,lastName, businessId));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed");
        }
    }
    }


