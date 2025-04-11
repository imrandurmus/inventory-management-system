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

import java.math.BigDecimal;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

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
        Employee currentEmployee = getCurrentEmployee();

        // GUEST users can't add
        if (currentEmployee.getRole() == Role.GUEST) {
            return new ResponseEntity<>("Guests are not allowed to add products.", HttpStatus.FORBIDDEN);
        }

        // REGULAR users can only add products for their assigned types
        if (currentEmployee.getRole() == Role.REGULAR &&
                (product.getProductType() == null || !currentEmployee.getAssignedTypes().contains(product.getProductType()))) {
            return new ResponseEntity<>("You are not allowed to add products of this type.", HttpStatus.FORBIDDEN);
        }

        if (product.getProductType() != null && product.getProductType().getId() != 0) {
            Optional<ProductType> type = productTypeRepository.findById(product.getProductType().getId());
            if (type.isEmpty()) {
                return new ResponseEntity<>("Invalid product type", HttpStatus.BAD_REQUEST);
            }
            product.setProductType(type.get());
        } else {
            return new ResponseEntity<>("Product type is required", HttpStatus.BAD_REQUEST);
        }

        Product savedProduct = productRepository.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Employee currentEmployee = getCurrentEmployee();
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        // REGULAR: restrict to assigned product types
        if (currentEmployee.getRole() == Role.REGULAR) {
            return new ResponseEntity<>(
                    productRepository.findByProductTypeIn(currentEmployee.getAssignedTypes(), pageable),
                    HttpStatus.OK
            );
        }

        // MANAGER or GUEST: see everything
        return new ResponseEntity<>(productRepository.findAll(pageable), HttpStatus.OK);
    }


    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> filterProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer maxQuantity,
            @RequestParam(required = false) Long productTypeId,  // 👈 New filter
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> products = productRepository.filterProducts(query, minPrice, maxPrice, inStock, maxQuantity, productTypeId, pageable);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
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
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> results = productRepository.findByPriceBetween(min, max, pageable);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @GetMapping("/in-stock-paginated")
    public ResponseEntity<Page<Product>> getInStockProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<Product> inStockProducts = productRepository.findByQuantityGreaterThan(0, pageable);
        return new ResponseEntity<>(inStockProducts, HttpStatus.OK);
    }


    @GetMapping("/details/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(value ->
                        new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable long id, @RequestBody Product updatedProduct) {
        Employee currentEmployee = getCurrentEmployee();

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }

        if (updatedProduct.getProductType() == null || updatedProduct.getProductType().getId() == 0) {
            return new ResponseEntity<>("Product type is required", HttpStatus.BAD_REQUEST);
        }

        Optional<ProductType> optionalType = productTypeRepository.findById(updatedProduct.getProductType().getId());
        if (optionalType.isEmpty()) {
            return new ResponseEntity<>("Invalid product type ID", HttpStatus.BAD_REQUEST);
        }

        Product existingProduct = optionalProduct.get();

        // GUEST block
        if (currentEmployee.getRole() == Role.GUEST) {
            return new ResponseEntity<>("Guests cannot update products.", HttpStatus.FORBIDDEN);
        }

        // REGULAR restriction
        if (currentEmployee.getRole() == Role.REGULAR &&
                !currentEmployee.getAssignedTypes().contains(existingProduct.getProductType())) {
            return new ResponseEntity<>("You are not allowed to update this product.", HttpStatus.FORBIDDEN);
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setProductType(optionalType.get());

        Product savedProduct = productRepository.save(existingProduct);
        return new ResponseEntity<>(savedProduct, HttpStatus.OK);
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
