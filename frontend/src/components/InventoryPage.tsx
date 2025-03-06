import React, { useState, useEffect } from "react";
import "./InventoryPage.css"; // Ensure you have relevant styles

const InventoryPage: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<any[]>([
    { name: "Laptop", sku: "LAP123", stock_in_hand: 15, reorder_level: 5 },
    { name: "Mouse", sku: "MSE456", stock_in_hand: 50, reorder_level: 10 },
    { name: "Keyboard", sku: "KBD789", stock_in_hand: 30, reorder_level: 8 },
    { name: "Monitor", sku: "MON101", stock_in_hand: 12, reorder_level: 3 },
  ]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/inventory"); // Replace with your API endpoint
        const data = await response.json();
        setInventoryItems(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    // Uncomment this line when an API is available
    // fetchInventory();
  }, []);

  return (
    <div className="inventory-page-container">
      <h1>Inventory</h1>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>SKU</th>
            <th>Stock in Hand</th>
            <th>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.length > 0 ? (
            inventoryItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.stock_in_hand}</td>
                <td>{item.reorder_level}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No inventory items available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
