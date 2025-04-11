package group15.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Objects;

@Entity
@Table(name = "product_types")
public class ProductType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product type name is required")
    @Column(nullable = false, unique = true)
    private String name;

    // Constructors
    public ProductType() {}

    public ProductType(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() { // Changed to Long to match Employee.java
        return id;
    }
    public void setId(Long id) { // Added setter for completeness
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    // Equals and HashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductType)) return false;
        ProductType that = (ProductType) o;
        // Consider both id and name for equality
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    // Added toString for better debugging
    @Override
    public String toString() {
        return "ProductType{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}