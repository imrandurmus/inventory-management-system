package group15.backend.config;

import group15.backend.model.Employee;
import group15.backend.model.Product;
import group15.backend.model.ProductType;
import group15.backend.model.Role;
import group15.backend.repository.EmployeeRepository;
import group15.backend.repository.ProductRepository;
import group15.backend.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

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
                Employee alice = new Employee("Alice", "Johnson", "alice@company.com",
                        passwordEncoder.encode("alice123"), Role.MANAGER);
                employeeRepo.save(alice);
            }

            if (employeeRepo.findByEmail("bob@company.com").isEmpty()) {
                Employee bob = new Employee("Bob", "Smith", "bob@company.com",
                        passwordEncoder.encode("bob123"), Role.REGULAR);

                bob.assignType(electronics);
                bob.assignType(books);

                employeeRepo.save(bob);
            }


            if (employeeRepo.findByEmail("charlie@company.com").isEmpty()) {
                Employee charlie = new Employee("Charlie", "Guest", "charlie@company.com",
                        passwordEncoder.encode("charlie123"), Role.GUEST);
                employeeRepo.save(charlie);
            }

            System.out.println("✅ Sample data loaded safely.");
        };
    }
}
