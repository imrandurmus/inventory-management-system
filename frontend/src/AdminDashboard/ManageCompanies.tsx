import React, { useState } from "react";
import "./ManageCompanies.css"; // Ensure this CSS file exists and follows the design

const ManageCompanies: React.FC = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechCorp", industry: "Technology", employees: 120 },
    { id: 2, name: "HealthSolutions", industry: "Healthcare", employees: 75 },
  ]);

  const [newCompany, setNewCompany] = useState({ name: "", industry: "", employees: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  const addCompany = () => {
    if (!newCompany.name || !newCompany.industry || !newCompany.employees) return;
    setCompanies([
      ...companies,
      {
        id: companies.length + 1,
        name: newCompany.name,
        industry: newCompany.industry,
        employees: parseInt(newCompany.employees),
      },
    ]);
    setNewCompany({ name: "", industry: "", employees: "" });
  };

  const deleteCompany = (id: number) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <div className="manage-companies">
      <h2>Manage Companies</h2>
      <div className="company-form">
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={newCompany.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={newCompany.industry}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="employees"
          placeholder="No. of Employees"
          value={newCompany.employees}
          onChange={handleInputChange}
        />
        <button onClick={addCompany} className="add-company-button">Add Company</button>
      </div>
      <table className="company-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Industry</th>
            <th>Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.industry}</td>
              <td>{company.employees}</td>
              <td className="action-buttons">
                <button className="edit-button">Edit</button>
                <button className="delete-button" onClick={() => deleteCompany(company.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCompanies;
