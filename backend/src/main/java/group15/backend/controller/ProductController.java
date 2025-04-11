package group15.backend.controller;

import group15.backend.model.Product;
import group15.backend.repository.ProductRepository;
import group15.backend.repository.ProductTypeRepository;
import group15.backend.model.ProductType;
import group15.backend.model.Employee;
import group15.backend.repository.EmployeeRepository;
import group15.backend.model.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated employee not found"));
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        logger.info("Received request to add product: {}", product);

        try {
            Employee currentEmployee = getCurrentEmployee();
            logger.info("Current employee role: {}", currentEmployee.getRole());

            // GUEST users can't add
            if (currentEmployee.getRole() == Role.GUEST) {
                logger.warn("Guest user attempted to add product");
                return new ResponseEntity<>("Guests are not allowed to add products.", HttpStatus.FORBIDDEN);
            }

            // Validate product type
            if (product.getProductType() == null || product.getProductType().getId() == 0) {
                logger.warn("Product type is missing or invalid");
                return new ResponseEntity<>("Product type is required", HttpStatus.BAD_REQUEST);
            }

            // Get and validate product type
            Optional<ProductType> type = productTypeRepository.findById(product.getProductType().getId());
            if (type.isEmpty()) {
                logger.warn("Invalid product type ID: {}", product.getProductType().getId());
                return new ResponseEntity<>("Invalid product type", HttpStatus.BAD_REQUEST);
            }

            // REGULAR users can only add products for their assigned types
            if (currentEmployee.getRole() == Role.REGULAR &&
                    !currentEmployee.getAssignedTypes().contains(type.get())) {
                logger.warn("Regular user attempted to add product of unassigned type");
                return new ResponseEntity<>("You are not allowed to add products of this type.", HttpStatus.FORBIDDEN);
            }

            // Validate product fields
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                logger.warn("Product name is empty or null");
                return new ResponseEntity<>("Product name is required", HttpStatus.BAD_REQUEST);
            }

            if (product.getDescription() == null || product.getDescription().trim().isEmpty()) {
                logger.warn("Product description is empty or null");
                return new ResponseEntity<>("Product description is required", HttpStatus.BAD_REQUEST);
            }

            if (product.getQuantity() < 0) {
                logger.warn("Invalid product quantity: {}", product.getQuantity());
                return new ResponseEntity<>("Quantity cannot be negative", HttpStatus.BAD_REQUEST);
            }

            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                logger.warn("Invalid product price: {}", product.getPrice());
                return new ResponseEntity<>("Price must be greater than zero", HttpStatus.BAD_REQUEST);
            }

            // Set the product type
            product.setProductType(type.get());

            // Save the product
            logger.info("Saving new product: {}", product);
            Product savedProduct = productRepository.save(product);
            logger.info("Successfully created product: {}", savedProduct);

            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating product: ", e);
            return new ResponseEntity<>("Error creating product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String sort) {
        logger.info("Received GET request for products - page: {}, size: {}, sort: {}", page, size, sort);
        try {
            // Validate parameters
            if (page < 0) {
                logger.warn("Invalid page number: {}", page);
                return new ResponseEntity<>("Page number must be non-negative", HttpStatus.BAD_REQUEST);
            }
            if (size <= 0) {
                logger.warn("Invalid page size: {}", size);
                return new ResponseEntity<>("Page size must be positive", HttpStatus.BAD_REQUEST);
            }

            // Parse sort parameter
            String[] sortParams = sort.split(",");
            if (sortParams.length != 2) {
                logger.warn("Invalid sort parameter format: {}", sort);
                return new ResponseEntity<>("Invalid sort parameter format", HttpStatus.BAD_REQUEST);
            }

            String sortField = sortParams[0];
            String sortDirection = sortParams[1].toUpperCase();

            // Validate sort direction
            if (!sortDirection.equals("ASC") && !sortDirection.equals("DESC")) {
                logger.warn("Invalid sort direction: {}", sortDirection);
                return new ResponseEntity<>("Invalid sort direction", HttpStatus.BAD_REQUEST);
            }

            // Create sort object
            Sort.Direction direction = Sort.Direction.fromString(sortDirection);
            Sort sortObj = Sort.by(direction, sortField);

            Pageable pageable = PageRequest.of(page, size, sortObj);

            // Check if repository is properly initialized
            if (productRepository == null) {
                logger.error("ProductRepository is null");
                return new ResponseEntity<>("Internal server error: Repository not initialized",
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Try to fetch products
            Page<Product> products = productRepository.findAll(pageable);
            logger.info("Successfully retrieved {} products", products.getTotalElements());

            return new ResponseEntity<>(products, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving products: ", e);
            return new ResponseEntity<>("Error retrieving products: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> filterProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer maxQuantity,
            @RequestParam(required = false) Long productTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> products = productRepository.filterProducts(query, minPrice, maxPrice, inStock, maxQuantity,
                productTypeId, pageable);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> results = productRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/price-range")
    public ResponseEntity<Page<Product>> searchByPriceRange(
            @RequestParam("min") BigDecimal min,
            @RequestParam("max") BigDecimal max,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> results = productRepository.findByPriceBetween(min, max, pageable);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/in-stock-paginated")
    public ResponseEntity<Page<Product>> getInStockProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> inStockProducts = productRepository.findByQuantityGreaterThan(0, pageable);
        return new ResponseEntity<>(inStockProducts, HttpStatus.OK);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable long id, @RequestBody Product updatedProduct) {
        logger.info("Received update request for product ID: {}", id);
        logger.info("Update data: {}", updatedProduct);

        try {
            Employee currentEmployee = getCurrentEmployee();
            logger.info("Current employee role: {}", currentEmployee.getRole());

            Optional<Product> optionalProduct = productRepository.findById(id);
            if (optionalProduct.isEmpty()) {
                logger.warn("Product not found with ID: {}", id);
                return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
            }

            if (updatedProduct.getProductType() == null || updatedProduct.getProductType().getId() == 0) {
                logger.warn("Product type is required");
                return new ResponseEntity<>("Product type is required", HttpStatus.BAD_REQUEST);
            }

            Optional<ProductType> optionalType = productTypeRepository
                    .findById(updatedProduct.getProductType().getId());
            if (optionalType.isEmpty()) {
                logger.warn("Invalid product type ID: {}", updatedProduct.getProductType().getId());
                return new ResponseEntity<>("Invalid product type ID", HttpStatus.BAD_REQUEST);
            }

            Product existingProduct = optionalProduct.get();
            logger.info("Existing product: {}", existingProduct);

            // GUEST block
            if (currentEmployee.getRole() == Role.GUEST) {
                logger.warn("Guest user attempted to update product");
                return new ResponseEntity<>("Guests cannot update products.", HttpStatus.FORBIDDEN);
            }

            // REGULAR restriction
            if (currentEmployee.getRole() == Role.REGULAR &&
                    !currentEmployee.getAssignedTypes().contains(existingProduct.getProductType())) {
                logger.warn("Regular user attempted to update product of unassigned type");
                return new ResponseEntity<>("You are not allowed to update this product.", HttpStatus.FORBIDDEN);
            }

            // Update product fields
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setDescription(updatedProduct.getDescription());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQuantity(updatedProduct.getQuantity());
            existingProduct.setProductType(optionalType.get());

            logger.info("Saving updated product: {}", existingProduct);
            Product savedProduct = productRepository.save(existingProduct);
            logger.info("Successfully saved updated product");

            return new ResponseEntity<>(savedProduct, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error updating product: ", e);
            return new ResponseEntity<>("Error updating product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable long id) {
        Employee currentEmployee = getCurrentEmployee();

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        Product product = optionalProduct.get();

        if (currentEmployee.getRole() == Role.GUEST) {
            return new ResponseEntity<>("Guests cannot delete products.", HttpStatus.FORBIDDEN);
        }

        if (currentEmployee.getRole() == Role.REGULAR &&
                !currentEmployee.getAssignedTypes().contains(product.getProductType())) {
            return new ResponseEntity<>("You are not allowed to delete this product.", HttpStatus.FORBIDDEN);
        }

        productRepository.deleteById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }
}
