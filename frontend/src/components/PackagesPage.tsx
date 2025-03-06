import React, { useState } from "react";
import "./PackagesPage.css"; // Ensure the correct CSS is imported

interface Package {
  customerName: string;
  packageNumber: string;
  salesOrderNumber: string;
  orderDate: string;
  quantity: string; // could be "pcs", "kg", etc.
  status: "Not Shipped" | "Shipped" | "Delivered";
}

const PackagesPage: React.FC = () => {
  // Example data
  const initialPackages: Package[] = [
    {
      customerName: "John Doe",
      packageNumber: "PKG123",
      salesOrderNumber: "SO1001",
      orderDate: "2025-03-01",
      quantity: "10 pcs",
      status: "Not Shipped",
    },
    {
      customerName: "Jane Smith",
      packageNumber: "PKG124",
      salesOrderNumber: "SO1002",
      orderDate: "2025-03-02",
      quantity: "5 kg",
      status: "Shipped",
    },
    {
      customerName: "Alice Brown",
      packageNumber: "PKG125",
      salesOrderNumber: "SO1003",
      orderDate: "2025-03-03",
      quantity: "20 pcs",
      status: "Delivered",
    },
    {
      customerName: "Bob White",
      packageNumber: "PKG126",
      salesOrderNumber: "SO1004",
      orderDate: "2025-03-04",
      quantity: "30 pcs",
      status: "Not Shipped",
    },
    {
      customerName: "Emily Green",
      packageNumber: "PKG127",
      salesOrderNumber: "SO1005",
      orderDate: "2025-03-05",
      quantity: "15 kg",
      status: "Shipped",
    },
  ];

  const [packages] = useState(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter packages by status
  const filterPackages = (status: "Not Shipped" | "Shipped" | "Delivered") => {
    return packages.filter((pkg) => pkg.status === status);
  };

  // Handle search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter packages based on search query
  const filteredPackages = (
    status: "Not Shipped" | "Shipped" | "Delivered"
  ) => {
    return filterPackages(status).filter(
      (pkg) =>
        pkg.customerName.toLowerCase().includes(searchQuery) ||
        pkg.packageNumber.toLowerCase().includes(searchQuery) ||
        pkg.salesOrderNumber.toLowerCase().includes(searchQuery)
    );
  };

  return (
    <div className="packages-page-container">
      <div className="packages-header">
        <input
          type="text"
          placeholder="Search Packages..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        <button className="new-package-button">+ New</button>
      </div>

      <div className="packages-container">
        <div className="packages-column">
          <h3>Not Shipped Packages</h3>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Package Number</th>
                <th>Sales Order Number</th>
                <th>Order Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages("Not Shipped").map((pkg, index) => (
                <tr key={index}>
                  <td>{pkg.customerName}</td>
                  <td>{pkg.packageNumber}</td>
                  <td>{pkg.salesOrderNumber}</td>
                  <td>{pkg.orderDate}</td>
                  <td>{pkg.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="packages-column">
          <h3>Shipped Packages</h3>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Package Number</th>
                <th>Sales Order Number</th>
                <th>Order Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages("Shipped").map((pkg, index) => (
                <tr key={index}>
                  <td>{pkg.customerName}</td>
                  <td>{pkg.packageNumber}</td>
                  <td>{pkg.salesOrderNumber}</td>
                  <td>{pkg.orderDate}</td>
                  <td>{pkg.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="packages-column">
          <h3>Delivered Packages</h3>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Package Number</th>
                <th>Sales Order Number</th>
                <th>Order Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages("Delivered").map((pkg, index) => (
                <tr key={index}>
                  <td>{pkg.customerName}</td>
                  <td>{pkg.packageNumber}</td>
                  <td>{pkg.salesOrderNumber}</td>
                  <td>{pkg.orderDate}</td>
                  <td>{pkg.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
