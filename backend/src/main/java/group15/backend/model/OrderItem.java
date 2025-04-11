package group15.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;


    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    @Min(1)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal itemTotal;

    @PrePersist
    public void calculateItemTotal() {
        this.itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and setters
    public Long getId() { return id; }

    public Order getOrder() { return order; }

    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getItemTotal() { return itemTotal; }

    public void setItemTotal(BigDecimal itemTotal) { this.itemTotal = itemTotal; }
}
