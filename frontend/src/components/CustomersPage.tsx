import React from "react";
import "./CustomersPage.css";

const CustomersPage: React.FC = () => {
  const customers = [
    {
      name: "John Doe",
      company: "ABC Corp",
      email: "john@example.com",
      phone: "+1 234 567 890",
      receivables: 1500,
    },
    {
      name: "Jane Smith",
      company: "XYZ Inc",
      email: "jane@example.com",
      phone: "+1 234 567 891",
      receivables: 2400,
    },
    {
      name: "Sarah Connor",
      company: "Skynet",
      email: "sarah@skynet.com",
      phone: "+1 234 567 892",
      receivables: 3200,
    },
    {
      name: "Bruce Wayne",
      company: "Wayne Enterprises",
      email: "bruce@wayne.com",
      phone: "+1 234 567 893",
      receivables: 2700,
    },
    {
      name: "Tony Stark",
      company: "Stark Industries",
      email: "tony@stark.com",
      phone: "+1 234 567 894",
      receivables: 5000,
    },
    {
      name: "Peter Parker",
      company: "Parker Enterprises",
      email: "peter@parker.com",
      phone: "+1 234 567 895",
      receivables: 1800,
    },
    {
      name: "Clark Kent",
      company: "Daily Planet",
      email: "clark@dailyplanet.com",
      phone: "+1 234 567 896",
      receivables: 4000,
    },
  ];

  return (
    <div className="customers-page">
      <h1>Customer List</h1>
      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Receivables (TRY)</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td>{customer.name}</td>
              <td>{customer.company}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.receivables}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersPage;
