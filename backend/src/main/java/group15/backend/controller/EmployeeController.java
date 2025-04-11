package group15.backend.controller;

import group15.backend.model.Employee;
import group15.backend.model.ProductType;
import group15.backend.model.Role;
import group15.backend.repository.EmployeeRepository;
import group15.backend.repository.ProductTypeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;


@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository; //Automatic instance of EmployeeRepository so that we don't have to create it manually

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current employee not found"));
    }
    
@Autowired
private ProductTypeRepository productTypeRepository;


@PostMapping
public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
    Employee currentUser = getCurrentEmployee();
    if (currentUser.getRole() != Role.MANAGER) {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only managers can add
    }

    System.out.println("Received employee: " + employee);
    System.out.println("Received assignedTypes: " + employee.getAssignedTypes());

    if (employee.getProfileImageUrl() == null || employee.getProfileImageUrl().isBlank()) {
        String initialsUrl = "https://ui-avatars.com/api/?name=" +
                URLEncoder.encode(employee.getFirstName() + " " + employee.getLastName(), StandardCharsets.UTF_8);
        employee.setProfileImageUrl(initialsUrl);
    }

    if (employee.getAssignedTypes() != null && !employee.getAssignedTypes().isEmpty()) {
        Set<ProductType> types = new HashSet<>();
        for (ProductType type : employee.getAssignedTypes()) {
            System.out.println("Processing type: " + type.getName());
            ProductType existingType = productTypeRepository.findByName(type.getName())
                    .orElseThrow(() -> new RuntimeException("Product type not found: " + type.getName()));
            System.out.println("Found existing type: " + existingType);
            types.add(existingType);
        }
        System.out.println("Assigned types set: " + types);
        employee.setAssignedTypes(types);
    }

    Employee saved = employeeRepository.save(employee);
    System.out.println("Saved employee: " + saved);
    return new ResponseEntity<>(saved, HttpStatus.CREATED);
}

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return new ResponseEntity<>(employees, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<Employee> getCurrentUser() {
        Employee currentUser = getCurrentEmployee();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        if (employee.isPresent()) {
            return new ResponseEntity<>(employee.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee updatedEmployee) {
        Employee currentUser = getCurrentEmployee();
        if (currentUser.getRole() == Role.MANAGER && currentUser.getEmail().equals(updatedEmployee.getEmail())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Managers can't edit themselves
        }
        // Only managers can edit employees
        if (currentUser.getRole() != Role.MANAGER) {
            if (currentUser.getEmail().equals(updatedEmployee.getEmail())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Regular users can't edit themselves
            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Regular users can't edit others
        }

        Optional<Employee> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setFirstName(updatedEmployee.getFirstName());
            employee.setLastName(updatedEmployee.getLastName());
            employee.setEmail(updatedEmployee.getEmail());
            if (updatedEmployee.getPassword() != null && !updatedEmployee.getPassword().isBlank()) {
                employee.setPassword(updatedEmployee.getPassword());
            }
            employee.setRole(updatedEmployee.getRole());

            if (updatedEmployee.getProfileImageUrl() == null || updatedEmployee.getProfileImageUrl().isBlank()) {
                String fallbackUrl = "https://ui-avatars.com/api/?name=" +
                        URLEncoder.encode(updatedEmployee.getFirstName() + " " + updatedEmployee.getLastName(), StandardCharsets.UTF_8);
                employee.setProfileImageUrl(fallbackUrl);
            } else {
                employee.setProfileImageUrl(updatedEmployee.getProfileImageUrl());
            }

            if (updatedEmployee.getAssignedTypes() != null) {
                Set<ProductType> types = new HashSet<>();
                for (ProductType type : updatedEmployee.getAssignedTypes()) {
                    ProductType existingType = productTypeRepository.findByName(type.getName())
                            .orElseThrow(() -> new RuntimeException("Product type not found: " + type.getName()));
                    types.add(existingType);
                }
                employee.setAssignedTypes(types);
            } else {
                employee.setAssignedTypes(new HashSet<>());
            }

            Employee saved = employeeRepository.save(employee);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        Employee currentUser = getCurrentEmployee();
        if (currentUser.getRole() != Role.MANAGER) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only managers can delete
        }

        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
