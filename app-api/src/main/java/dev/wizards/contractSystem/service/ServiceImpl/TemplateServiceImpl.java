package dev.wizards.contractSystem.service.ServiceImpl;

import dev.wizards.contractSystem.model.CustomTemplate;
import dev.wizards.contractSystem.model.DefaultTemplate;
import dev.wizards.contractSystem.service.TemplateService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TemplateServiceImpl implements TemplateService {

    @Override
    public Page<DefaultTemplate> listDefaultTemplates(PageRequest pageRequest) {
        return null;
    }

    @Override
    public Page<DefaultTemplate> getDefaultTemplateBySearchAndPage(String name, PageRequest page) {
        return null;
    }

    @Override
    public DefaultTemplate getDefaultTemplateById(String id) {
        return null;
    }

    @Override
    public String findDefaultTemplateId(DefaultTemplate defaultTemplate) {
        return null;
    }

    @Override
    public CustomTemplate saveCustomTemplate(CustomTemplate customTemplate) {
        return null;
    }

    @Override
    public Boolean deleteCustomTemplate(String id) {
        return null;
    }

    @Override
    public CustomTemplate updateCustomTemplate(CustomTemplate customTemplate) {
        return null;
    }

    @Override
    public Page<CustomTemplate> getCustomTemplateBySearchAndPage(String name, PageRequest page) {
        return null;
    }

    @Override
    public String findCustomTemplateId(CustomTemplate customTemplate) {
        return null;
    }

    @Override
    public CustomTemplate getCustomTemplateById(String id) {
        return null;
    }
}
