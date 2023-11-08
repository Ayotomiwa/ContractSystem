package dev.wizards.contractSystem.controller;


import dev.wizards.contractSystem.model.CustomTemplate;
import dev.wizards.contractSystem.model.DefaultTemplate;
import dev.wizards.contractSystem.repository.CustomTemplateRepo;
import dev.wizards.contractSystem.repository.DefaultTemplateRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/templates")
public class TemplateController {

    private final DefaultTemplateRepo defaultTemplateRepo;
    private final CustomTemplateRepo customTemplateRepo;

    @GetMapping("/default")
    public ResponseEntity<Page<DefaultTemplate>> getTemplates(
           @RequestParam Optional<Integer> page,
           @RequestParam Optional<String> sortBy,
           @RequestParam Optional<String> sort,
           @RequestParam Optional<Long> size
    ) {
        Page<DefaultTemplate> templates = defaultTemplateRepo.findAllBy(
                PageRequest.of(page.orElse(0),
                        size.orElse(30L).intValue(),
                        Sort.Direction.valueOf(sort.orElse("ASC")),
                        sortBy.orElse("id"))
        );
        return ResponseEntity.ok(templates);
    }
    @GetMapping("/default/{template-id}")
    public ResponseEntity<DefaultTemplate> getTemplate( @PathVariable("template-id") String parameter) {
        DefaultTemplate template = defaultTemplateRepo.findById(parameter)
                .orElse(null);
        return ResponseEntity.ok(template);
    }

    @PostMapping("")
    public ResponseEntity<CustomTemplate> createCustomTemplate(@RequestBody CustomTemplate template) {
        CustomTemplate createdTemplate = customTemplateRepo.save(template);
        return ResponseEntity.ok(createdTemplate);
    }

    @GetMapping("/{business-id}")
    public ResponseEntity<Page<CustomTemplate>> getCustomTemplates(@PathVariable("business-id") String parameter,
                                                                   @RequestParam Optional<Integer> page,
                                                                   @RequestParam Optional<String> sortBy,
                                                                   @RequestParam Optional<String> sort,
                                                                   @RequestParam Optional<Long> size) {
        Page<CustomTemplate> templates = customTemplateRepo.findAllByBusinessOwnerId(
                PageRequest.of(page.orElse(0),
                        size.orElse(30L).intValue(),
                        Sort.Direction.valueOf(sort.orElse("ASC")),
                        sortBy.orElse("id")), parameter);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("custom/{template-id}")
    public ResponseEntity<CustomTemplate> getCustomTemplate(@PathVariable("template-id") String parameter) {
        CustomTemplate template = customTemplateRepo.findById(parameter)
                .orElse(null);
        return ResponseEntity.ok(template);
    }

//    @PutMapping("/{template-id}")
//    public ResponseEntity<CustomTemplate> updateCustomTemplate(@PathVariable("template-id") String parameter) {
//        CustomTemplate template = customTemplateRepo.findById(parameter)
//                .orElse(null);
//        template.sav
//    }
    @DeleteMapping("/{template-id}")
    public ResponseEntity<?> deleteCustomTemplate(@PathVariable("template-id") String parameter) {
        customTemplateRepo.deleteById(parameter);
        return ResponseEntity.ok().build();
    }

}
