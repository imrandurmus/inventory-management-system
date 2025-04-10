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
    @Column (nullable = false,unique = true)
    private String name;

    public ProductType() {}

    public ProductType(String name) {
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if(!(o instanceof ProductType)) return false;
        ProductType productType = (ProductType) o;
        return Objects.equals(id, productType.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
