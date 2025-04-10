package group15.backend.controller;

import group15.backend.model.Employee;
import group15.backend.model.Role;
import group15.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
                .orElseThrow(() -> new RuntimeException("Authenticated employee not found"));
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        // If profileImageUrl is null or empty, generate a default avatar
        if (employee.getProfileImageUrl() == null || employee.getProfileImageUrl().isBlank()) {
            // Construct the default URL using the employee's full name
            String initialsUrl = "https://ui-avatars.com/api/?name=" +
                    URLEncoder.encode(employee.getFirstName() + " " + employee.getLastName(), StandardCharsets.UTF_8);
            employee.setProfileImageUrl(initialsUrl);
        }

        Employee saved = employeeRepository.save(employee);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return new ResponseEntity<>(employees, HttpStatus.OK);
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

        if (currentUser.getRole() == Role.REGULAR && !Objects.equals(currentUser.getId(), id)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Optional<Employee> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            employee.setFirstName(updatedEmployee.getFirstName());
            employee.setLastName(updatedEmployee.getLastName());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setPassword(updatedEmployee.getPassword());
            employee.setRole(updatedEmployee.getRole());

            // ✅ If no profile picture provided, assign one using their initials
            if (updatedEmployee.getProfileImageUrl() == null || updatedEmployee.getProfileImageUrl().isBlank()) {
                String fallbackUrl = "https://ui-avatars.com/api/?name=" +
                        URLEncoder.encode(updatedEmployee.getFirstName() + " " + updatedEmployee.getLastName(), StandardCharsets.UTF_8);
                employee.setProfileImageUrl(fallbackUrl);
            } else {
                employee.setProfileImageUrl(updatedEmployee.getProfileImageUrl());
            }

            Employee saved = employeeRepository.save(employee);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Employee> deleteEmployee(@PathVariable Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); //204
        }
        else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //404
        }

    }
}
