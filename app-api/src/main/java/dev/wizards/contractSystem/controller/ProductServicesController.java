package dev.wizards.contractSystem.controller;

import dev.wizards.contractSystem.model.Business;
import dev.wizards.contractSystem.model.ProductServices;
import dev.wizards.contractSystem.repository.BusinessRepo;
import dev.wizards.contractSystem.repository.ClientRepo;
import dev.wizards.contractSystem.repository.ProductServicesRepo;
import dev.wizards.contractSystem.repository.UserRepo;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Data
@RestController
@RequestMapping("/api/product-services")
public class ProductServicesController {
    private final ClientRepo clientRepo;
    private final UserRepo userRepo;
    private final BusinessRepo businessRepo;
    private final ProductServicesRepo productServicesRepo;

    @PostMapping("business/{business-id}")
    public ResponseEntity<?> addProductServices(@RequestBody ProductServices productServices, @PathVariable("business-id") String parameter) {


        if (productServicesRepo.existsByName(productServices.getName())) {
            Business business = businessRepo.findById(parameter).orElse(null);
            if (business == null) {
                return ResponseEntity.badRequest().build();
            }
            productServices.setBusinessId(business.getId());

            productServicesRepo.save(productServices);
            return ResponseEntity.ok(productServices);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product Already Exists.");
    }

   @PostMapping("business/{business-id}/multiple")
    public ResponseEntity<?> addMultipleProductServices(@RequestBody List<ProductServices> multipleProductServices, @PathVariable("business-id") String parameter){

        for(ProductServices productServices: multipleProductServices){
            if(productServicesRepo.existsByName(productServices.getName())){
                Business business = businessRepo.findById(parameter).orElse(null);
                if(business == null){
                    return ResponseEntity.badRequest().build();
                }
                productServices.setBusinessId(business.getId());
                productServicesRepo.save(productServices);
            }
        }

        return ResponseEntity.ok("Done");
    }

    @GetMapping("business/{business-id}")
    public ResponseEntity<Page<ProductServices>> getProductServices(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @PathVariable("business-id") String parameter){

        Page<ProductServices> productPages = productServicesRepo.findAllByBusinessId(
                PageRequest.of(page.orElse(0),
                        size.orElse(30L).intValue(),
                        Sort.Direction.valueOf(sort.orElse("ASC")),
                        sortBy.orElse("id")), parameter);
        return ResponseEntity.ok(productPages);
    }

    @GetMapping("business/{business-id}/search")
    public ResponseEntity<Page<ProductServices>> searchClients(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<String> sortBy,
            @RequestParam Optional<String> sort,
            @RequestParam Optional<Long> size,
            @RequestParam(required = false) String query,
            @PathVariable("business-id") String parameter){

        if(query == null || query.trim().isEmpty()){
            return getProductServices(page, sortBy, sort, size, parameter);
        }

        String searchPattern = query.trim();
        PageRequest pageRequest = PageRequest.of(
                page.orElse(0),
                size.orElse(30L).intValue(),
                Sort.Direction.valueOf(sort.orElse("ASC")),
                sortBy.orElse("id")
        );

        Page<ProductServices> productPages = productServicesRepo.findByRegexSearch(searchPattern, parameter, pageRequest);

        return ResponseEntity.ok(productPages);
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductServices> getClientsByBusiness(@PathVariable ("product-id")String id){

        ProductServices productServices = productServicesRepo.findById(id).orElse(null);
        if(productServices == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productServices);
    }


//    @DeleteMapping("/{product-id}")
//    public ResponseEntity<String> deleteClient(@PathVariable("product-id") String parameter){
//        productServicesRepo.deleteById(parameter);
//        return ResponseEntity.ok("deleted");
//    }

    @PostMapping("/{product-id}")
    public ResponseEntity<String> deleteClient(@PathVariable("product-id") String parameter){
        productServicesRepo.deleteById(parameter);
        return ResponseEntity.ok("deleted");
    }

//    @DeleteMapping("/multiple")
//    public ResponseEntity<String> deleteMultipleProducts(List<String> productIDs){
//        try{
//            productServicesRepo.deleteAllById(productIDs);
//        }
//        catch(Exception e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred: Could not Delete All products");
//        }
//
//      return ResponseEntity.ok("All Deleted");
//    }

    @PostMapping("/multiple")
    public ResponseEntity<String> deleteMultipleProducts(List<String> productIDs){
        try{
            productServicesRepo.deleteAllById(productIDs);
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred: Could not Delete All products");
        }

        return ResponseEntity.ok("All Deleted");
    }




}
