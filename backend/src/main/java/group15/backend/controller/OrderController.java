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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        logger.info("Fetching all orders");
        try {
            List<Order> orders = orderRepository.findAll();
            logger.info("Successfully retrieved {} orders", orders.size());
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching orders: ", e);
            return new ResponseEntity<>("Error fetching orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        logger.info("Received request to create order: {}", request);
        try {
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal totalPrice = BigDecimal.ZERO;

            for (OrderItemDTO itemDTO : request.getItems()) {
                Optional<Product> productOpt = productRepository.findById(itemDTO.getProductId());

                if (productOpt.isEmpty()) {
                    logger.warn("Product not found with ID: {}", itemDTO.getProductId());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Product with ID " + itemDTO.getProductId() + " not found."));
                }

                Product product = productOpt.get();

                if (product.getQuantity() < itemDTO.getQuantity()) {
                    logger.warn("Insufficient stock for product: {}", product.getName());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Not enough stock for product: " + product.getName()));
                }

                // Update product stock and sales count
                product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
                product.setSalesCount(product.getSalesCount() + itemDTO.getQuantity());
                productRepository.save(product);

                OrderItem orderItem = new OrderItem();
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDTO.getQuantity());

                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
                orderItem.setItemTotal(itemTotal);

                orderItems.add(orderItem);
                totalPrice = totalPrice.add(itemTotal);
            }

            Order order = new Order();
            order.setCustomerName(request.getCustomerName());
            order.setItems(orderItems);
            order.setTotalPrice(totalPrice);

            for (OrderItem item : orderItems) {
                item.setOrder(order);
            }

            Order savedOrder = orderRepository.save(order);
            logger.info("Successfully created order: {}", savedOrder);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating order: ", e);
            return new ResponseEntity<>("Error creating order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        logger.info("Received request to delete order with ID: {}", id);
        try {
            Optional<Order> optionalOrder = orderRepository.findById(id);
            if (optionalOrder.isEmpty()) {
                logger.warn("Order not found with ID: {}", id);
                return new ResponseEntity<>("Order not found", HttpStatus.NOT_FOUND);
            }

            orderRepository.deleteById(id);
            logger.info("Successfully deleted order with ID: {}", id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting order: ", e);
            return new ResponseEntity<>("Error deleting order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
