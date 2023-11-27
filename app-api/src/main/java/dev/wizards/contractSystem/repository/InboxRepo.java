package dev.wizards.contractSystem.repository;

import dev.wizards.contractSystem.model.Inbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InboxRepo extends MongoRepository<Inbox, String> {


    Page<Inbox> findAllByTo(PageRequest of, String email);
}
