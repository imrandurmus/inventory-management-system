package group15.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardMetricsDTO {
    private long totalInventory;
    private long productTypes;
    private long totalSales;
    private BigDecimal totalInventoryValue;
    private Map<String, Integer> productTypeDistribution;
    private Map<String, Integer> stockCountDistribution;
    private List<TopSellingItemDTO> topSellingItems;

    // Inner class for top selling items
    public static class TopSellingItemDTO {
        private String itemName;
        private int soldCount;

        public TopSellingItemDTO(String itemName, int soldCount) {
            this.itemName = itemName;
            this.soldCount = soldCount;
        }

        // Getters and setters
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public int getSoldCount() { return soldCount; }
        public void setSoldCount(int soldCount) { this.soldCount = soldCount; }
    }

    // Getters and setters
    public long getTotalInventory() { return totalInventory; }
    public void setTotalInventory(long totalInventory) { this.totalInventory = totalInventory; }
    
    public long getProductTypes() { return productTypes; }
    public void setProductTypes(long productTypes) { this.productTypes = productTypes; }
    
    public long getTotalSales() { return totalSales; }
    public void setTotalSales(long totalSales) { this.totalSales = totalSales; }
    
    public BigDecimal getTotalInventoryValue() { return totalInventoryValue; }
    public void setTotalInventoryValue(BigDecimal totalInventoryValue) { 
        this.totalInventoryValue = totalInventoryValue; 
    }
    
    public Map<String, Integer> getProductTypeDistribution() { return productTypeDistribution; }
    public void setProductTypeDistribution(Map<String, Integer> productTypeDistribution) { 
        this.productTypeDistribution = productTypeDistribution; 
    }
    
    public Map<String, Integer> getStockCountDistribution() { return stockCountDistribution; }
    public void setStockCountDistribution(Map<String, Integer> stockCountDistribution) { 
        this.stockCountDistribution = stockCountDistribution; 
    }
    
    public List<TopSellingItemDTO> getTopSellingItems() { return topSellingItems; }
    public void setTopSellingItems(List<TopSellingItemDTO> topSellingItems) { 
        this.topSellingItems = topSellingItems; 
    }
} 