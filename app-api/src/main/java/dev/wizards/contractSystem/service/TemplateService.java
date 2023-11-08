package dev.wizards.contractSystem.service;


import dev.wizards.contractSystem.model.CustomTemplate;
import dev.wizards.contractSystem.model.DefaultTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;




public interface TemplateService {
    Page<DefaultTemplate> listDefaultTemplates(PageRequest pageRequest);
    Page<DefaultTemplate> getDefaultTemplateBySearchAndPage(String name, PageRequest page);
    DefaultTemplate getDefaultTemplateById(String id);
    String findDefaultTemplateId(DefaultTemplate defaultTemplate);
    CustomTemplate saveCustomTemplate(CustomTemplate customTemplate);
    Boolean deleteCustomTemplate(String id);
    CustomTemplate updateCustomTemplate(CustomTemplate customTemplate);
    Page<CustomTemplate> getCustomTemplateBySearchAndPage(String name, PageRequest page);
    String findCustomTemplateId(CustomTemplate customTemplate);
    CustomTemplate getCustomTemplateById(String id);

}
