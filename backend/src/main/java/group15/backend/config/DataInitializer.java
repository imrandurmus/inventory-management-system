package group15.backend.config;

import group15.backend.model.Employee;
import group15.backend.model.Product;
import group15.backend.model.ProductType;
import group15.backend.model.Role;
import group15.backend.repository.EmployeeRepository;
import group15.backend.repository.ProductRepository;
import group15.backend.repository.ProductTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            ProductTypeRepository typeRepo,
            ProductRepository productRepo,
            EmployeeRepository employeeRepo
    ) {
        return args -> {
            // --- Product Types ---
            ProductType electronics = typeRepo.findByName("Electronics")
                    .orElseGet(() -> typeRepo.save(new ProductType("Electronics")));
            ProductType clothing = typeRepo.findByName("Clothing")
                    .orElseGet(() -> typeRepo.save(new ProductType("Clothing")));
            ProductType books = typeRepo.findByName("Books")
                    .orElseGet(() -> typeRepo.save(new ProductType("Books")));

            // --- Products ---
            if (productRepo.count() == 0) {
                productRepo.save(new Product("Laptop", "High-performance laptop", 10, new BigDecimal("1200.00"), electronics));
                productRepo.save(new Product("T-Shirt", "100% cotton black t-shirt", 50, new BigDecimal("25.00"), clothing));
                productRepo.save(new Product("Headphones", "Noise-canceling over-ear", 30, new BigDecimal("80.00"), electronics));
                productRepo.save(new Product("Mystery Novel", "Thrilling detective story", 100, new BigDecimal("15.00"), books));
                productRepo.save(new Product("Jacket", "Waterproof winter jacket", 20, new BigDecimal("85.00"), clothing));
            }

            // --- Employees ---
            if (employeeRepo.findByEmail("alice@company.com").isEmpty()) {
                employeeRepo.save(new Employee("Alice", "Johnson", "alice@company.com", "alice123", Role.MANAGER));
            }

            if (employeeRepo.findByEmail("bob@company.com").isEmpty()) {
                employeeRepo.save(new Employee("Bob", "Smith", "bob@company.com", "bob123", Role.REGULAR));
            }

            if (employeeRepo.findByEmail("charlie@company.com").isEmpty()) {
                employeeRepo.save(new Employee("Charlie", "Guest", "charlie@company.com", "charlie123", Role.GUEST));
            }

            System.out.println("✅ Sample data loaded safely.");
        };
    }
}
