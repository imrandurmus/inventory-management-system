// SalesOrdersPage.tsx
import React, { useState } from "react";
import "./SalesOrdersPage.css"; // Import the CSS file
// Sample sales orders data
const sampleSalesOrders = [
  {
    orderNumber: "SO001",
    customerName: "John Doe",
    orderStatus: "Shipped",
    invoiced: true,
    paid: true,
    packed: true,
    shipped: true,
    amountTRY: 500.0,
    creationDate: "2025-03-01",
  },
  {
    orderNumber: "SO002",
    customerName: "Jane Smith",
    orderStatus: "Packed",
    invoiced: false,
    paid: false,
    packed: true,
    shipped: false,
    amountTRY: 250.0,
    creationDate: "2025-03-02",
  },
  {
    orderNumber: "SO003",
    customerName: "Tom Johnson",
    orderStatus: "Invoiced",
    invoiced: true,
    paid: false,
    packed: false,
    shipped: false,
    amountTRY: 700.0,
    creationDate: "2025-03-03",
  },
  {
    orderNumber: "SO004",
    customerName: "Alice Brown",
    orderStatus: "Shipped",
    invoiced: true,
    paid: true,
    packed: true,
    shipped: true,
    amountTRY: 1200.0,
    creationDate: "2025-03-04",
  },
  {
    orderNumber: "SO005",
    customerName: "David White",
    orderStatus: "Shipped",
    invoiced: true,
    paid: false,
    packed: true,
    shipped: true,
    amountTRY: 800.0,
    creationDate: "2025-03-05",
  },
];

const SalesOrdersPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("All");

  // Filter sales orders based on the selected filter
  const filteredSalesOrders = sampleSalesOrders.filter((order) => {
    if (filter === "All") return true;
    if (filter === "Shipped" && order.shipped) return true;
    if (filter === "Invoiced" && order.invoiced) return true;
    if (filter === "Packed" && order.packed) return true;
    return false;
  });

  return (
    <div className="sales-orders-page">
      <h1>Sales Orders</h1>

      {/* Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="order-filter">Filter Sales Orders: </label>
        <select
          id="order-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Sales Orders</option>
          <option value="Shipped">Shipped Sales Orders</option>
          <option value="Invoiced">Invoiced Sales Orders</option>
          <option value="Packed">Packed Sales Orders</option>
        </select>
      </div>

      {/* Sales Orders Table */}
      <table className="sales-orders-table">
        <thead>
          <tr>
            <th>Creation Date</th>
            <th>Sales Order Number</th>
            <th>Customer Name</th>
            <th>Order Status</th>
            <th>Invoiced</th>
            <th>Paid</th>
            <th>Packed</th>
            <th>Shipped</th>
            <th>Amount (TRY)</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalesOrders.map((order) => (
            <tr key={order.orderNumber}>
              <td>{order.creationDate}</td>
              <td>{order.orderNumber}</td>
              <td>{order.customerName}</td>
              <td>{order.orderStatus}</td>
              <td>{order.invoiced ? "Yes" : "No"}</td>
              <td>{order.paid ? "Yes" : "No"}</td>
              <td>{order.packed ? "Yes" : "No"}</td>
              <td>{order.shipped ? "Yes" : "No"}</td>
              <td>{order.amountTRY} TRY</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesOrdersPage;
