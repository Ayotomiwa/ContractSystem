package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


public interface UserRepo extends MongoRepository <User, String>{

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
