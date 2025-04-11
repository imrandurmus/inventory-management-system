package group15.backend.controller;

import group15.backend.dto.DashboardMetricsDTO;
import group15.backend.model.Order;
import group15.backend.model.Product;
import group15.backend.repository.OrderRepository;
import group15.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsDTO> getDashboardMetrics() {
        DashboardMetricsDTO metrics = new DashboardMetricsDTO();
        List<Product> allProducts = productRepository.findAll();
        
        logger.info("Calculating dashboard metrics for {} products", allProducts.size());

        // Calculate total inventory
        long totalInventory = allProducts.stream()
                .mapToLong(Product::getQuantity)
                .sum();
        metrics.setTotalInventory(totalInventory);
        logger.info("Total inventory count: {}", totalInventory);

        // Calculate product types
        long productTypeCount = allProducts.stream()
                .map(Product::getProductType)
                .distinct()
                .count();
        metrics.setProductTypes(productTypeCount);
        logger.info("Number of distinct product types: {}", productTypeCount);

        // Calculate total sales using product salesCount
        long totalSales = allProducts.stream()
                .mapToLong(Product::getSalesCount)
                .sum();
        metrics.setTotalSales(totalSales);
        logger.info("Total sales count: {}", totalSales);

        // Calculate total inventory value using the built-in getTotalValue method
        BigDecimal totalValue = allProducts.stream()
                .map(Product::getTotalValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        metrics.setTotalInventoryValue(totalValue);
        logger.info("Total inventory value: {}", totalValue);

        // Calculate product type distribution
        Map<String, Integer> productTypeDistribution = allProducts.stream()
                .collect(Collectors.groupingBy(
                        product -> product.getProductType().getName(),
                        Collectors.summingInt(Product::getQuantity)
                ));
        metrics.setProductTypeDistribution(productTypeDistribution);
        logger.info("Product type distribution: {}", productTypeDistribution);

        // Calculate stock count distribution using the built-in getStockLevel method
        Map<String, Integer> stockDistribution = new HashMap<>();
        stockDistribution.put("OUT_OF_STOCK", 0);
        stockDistribution.put("LOW_STOCK", 0);
        stockDistribution.put("IN_STOCK", 0);

        allProducts.forEach(product -> {
            String stockLevel = product.getStockLevel();
            stockDistribution.put(stockLevel, stockDistribution.get(stockLevel) + 1);
        });
        metrics.setStockCountDistribution(stockDistribution);
        logger.info("Stock level distribution: {}", stockDistribution);

        // Calculate top selling items using product salesCount
        List<DashboardMetricsDTO.TopSellingItemDTO> topItems = allProducts.stream()
                .sorted(Comparator.comparing(Product::getSalesCount).reversed())
                .limit(4)
                .map(product -> {
                    logger.debug("Top selling item: {} with {} sales", product.getName(), product.getSalesCount());
                    return new DashboardMetricsDTO.TopSellingItemDTO(
                            product.getName(),
                            product.getSalesCount());
                })
                .collect(Collectors.toList());
        
        metrics.setTopSellingItems(topItems);
        logger.info("Top selling items: {}", topItems);

        return ResponseEntity.ok(metrics);
    }
} 