package group15.backend.controller;

import group15.backend.model.ProductType;
import group15.backend.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/product-types")
public class ProductTypeController {

    private static final Logger logger = LoggerFactory.getLogger(ProductTypeController.class);

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @PostMapping
    public ResponseEntity<?> addProductType(@RequestBody ProductType productType) {
        logger.info("Received request to add product type: {}", productType);

        try {
            // Validate input
            if (productType.getName() == null || productType.getName().trim().isEmpty()) {
                logger.warn("Product type name is empty or null");
                return new ResponseEntity<>("Product type name is required", HttpStatus.BAD_REQUEST);
            }

            // Check if product type already exists
            if (productTypeRepository.existsByName(productType.getName())) {
                logger.warn("Product type already exists: {}", productType.getName());
                return new ResponseEntity<>("Product type already exists", HttpStatus.CONFLICT);
            }

            // Save the new product type
            ProductType savedType = productTypeRepository.save(productType);
            logger.info("Successfully created product type: {}", savedType);

            return new ResponseEntity<>(savedType, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating product type: ", e);
            return new ResponseEntity<>("Error creating product type: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        logger.info("Fetching all product types");
        try {
            List<ProductType> types = productTypeRepository.findAll();
            logger.info("Successfully retrieved {} product types", types.size());
            return new ResponseEntity<>(types, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching product types: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductType> getProductTypeById(@PathVariable Long id) {
        logger.info("Fetching product type with ID: {}", id);
        try {
            Optional<ProductType> optionalType = productTypeRepository.findById(id);
            if (optionalType.isPresent()) {
                logger.info("Found product type: {}", optionalType.get());
                return new ResponseEntity<>(optionalType.get(), HttpStatus.OK);
            } else {
                logger.warn("Product type not found with ID: {}", id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error fetching product type: ", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProductType(
            @PathVariable Long id,
            @RequestBody ProductType updatedType) {
        logger.info("Updating product type with ID: {}", id);

        try {
            Optional<ProductType> optionalType = productTypeRepository.findById(id);
            if (optionalType.isPresent()) {
                ProductType existingType = optionalType.get();

                // Check if the new name already exists (excluding the current type)
                if (!existingType.getName().equals(updatedType.getName()) &&
                        productTypeRepository.existsByName(updatedType.getName())) {
                    logger.warn("Product type name already exists: {}", updatedType.getName());
                    return new ResponseEntity<>("Product type name already exists", HttpStatus.CONFLICT);
                }

                existingType.setName(updatedType.getName());
                ProductType savedType = productTypeRepository.save(existingType);
                logger.info("Successfully updated product type: {}", savedType);
                return new ResponseEntity<>(savedType, HttpStatus.OK);
            } else {
                logger.warn("Product type not found with ID: {}", id);
                return new ResponseEntity<>("Product type not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error updating product type: ", e);
            return new ResponseEntity<>("Error updating product type: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductType(@PathVariable Long id) {
        logger.info("Deleting product type with ID: {}", id);

        try {
            Optional<ProductType> optionalType = productTypeRepository.findById(id);
            if (optionalType.isPresent()) {
                productTypeRepository.deleteById(id);
                logger.info("Successfully deleted product type with ID: {}", id);
                return new ResponseEntity<>(optionalType.get(), HttpStatus.OK);
            } else {
                logger.warn("Product type not found with ID: {}", id);
                return new ResponseEntity<>("Product type not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error deleting product type: ", e);
            return new ResponseEntity<>("Error deleting product type: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
