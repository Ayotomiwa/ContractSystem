package dev.wizards.contractSystem.service.ServiceImpl;


import dev.wizards.contractSystem.model.Business;
import dev.wizards.contractSystem.model.Enums.ROLE;
import dev.wizards.contractSystem.model.User;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PasswordEncoder bCryptPasswordEncoder;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), new ArrayList<>());
    }

   public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    public User save(User user) {

        Business business = null;
        String userId;

        if(userRepo.existsByEmail(user.getEmail())){
            userId = userRepo.getByEmail(user.getEmail()).getId();
            user.setId(userId);
        }
        
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        if(user.getBusiness().getCompanyName() == null){
            System.out.println("Business is null");
            user.setType(ROLE.INDIVIDUAL_USER);
        }
        else if(businessRepo.existsByCompanyName(user.getBusiness().getCompanyName())){
            System.out.println("Business exists - " + user.getBusiness().getCompanyName());
            user.setType(ROLE.BUSINESS_USER);
            business = businessRepo.getByCompanyName(user.getBusiness().getCompanyName());
        }
        else{
            business = businessRepo.save(user.getBusiness());
            user.setBusiness(business);
        }

        return userRepo.save(user);
    }

    public List<User> saveAll(List<User> users) {
        for(User user: users){
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            if(user.getBusiness() == null){
                user.setType(ROLE.INDIVIDUAL_USER);
            }
            else if(businessRepo.existsByCompanyName(user.getBusiness().getCompanyName())){
                user.setType(ROLE.BUSINESS_USER);
            }
            else{
                businessRepo.save(user.getBusiness());
            }
        }
        return userRepo.saveAll(users);
    }
}