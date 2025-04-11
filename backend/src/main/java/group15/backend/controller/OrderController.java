package group15.backend.controller;

import group15.backend.dto.CreateOrderRequest;
import group15.backend.dto.OrderItemDTO;
import group15.backend.model.Order;
import group15.backend.model.OrderItem;
import group15.backend.model.Product;
import group15.backend.repository.OrderRepository;
import group15.backend.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : request.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());

            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Product with ID " + itemDTO.getProductId() + " not found."));
            }

            Product product = productOpt.get();

            if (product.getQuantity() < itemDTO.getQuantity()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Not enough stock for product: " + product.getName()));
            }

            // Update product stock and sales count
            product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
            product.setSalesCount(product.getSalesCount() + itemDTO.getQuantity());
            productRepository.save(product);

            // Create and link order item
            // Create and link order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());

// Calculate and set total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
            orderItem.setItemTotal(itemTotal);

            orderItems.add(orderItem);
            totalPrice = totalPrice.add(itemTotal);

        }

        // Finalize order
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        // Important: set back-reference from items to order
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        // Save and return
        Order savedOrder = orderRepository.save(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
}
