package group15.backend.controller;

import group15.backend.model.ProductType;
import group15.backend.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product-types")
public class ProductTypeController {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @PostMapping
    public ResponseEntity<ProductType> addProductType(@RequestBody ProductType productType) {
        ProductType savedType = productTypeRepository.save(productType);
        return new ResponseEntity<>(savedType, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        List<ProductType> types = productTypeRepository.findAll();
        return new ResponseEntity<>(types, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductType> getProductTypeById(@PathVariable Long id) {
        Optional<ProductType> optionalType = productTypeRepository.findById(id);
        if (optionalType.isPresent()) {
            return new ResponseEntity<>(optionalType.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductType> updateProductType(
            @PathVariable Long id,
            @RequestBody ProductType updatedType) {

        Optional<ProductType> optionalType = productTypeRepository.findById(id);
        if (optionalType.isPresent()) {
            ProductType existingType = optionalType.get();
            existingType.setName(updatedType.getName());
            ProductType savedType = productTypeRepository.save(existingType);
            return new ResponseEntity<>(savedType, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductType> deleteProductType(@PathVariable Long id) {
        Optional<ProductType> optionalType = productTypeRepository.findById(id);
        if (optionalType.isPresent()) {
            productTypeRepository.deleteById(id);
            return new ResponseEntity<>(optionalType.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
