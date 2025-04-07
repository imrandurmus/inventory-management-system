import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { Edit, Delete, Visibility, FileDownload } from '@mui/icons-material'; // MUI Icons
import Header from "../DashComponents/Header";
// Mock Data for Invoices
const initialInvoices = [
  { id: 1, orderId: 101, customerName: 'John Doe', totalAmount: 120, status: 'Unpaid', date: '2025-04-01' },
  { id: 2, orderId: 102, customerName: 'Jane Smith', totalAmount: 230, status: 'Paid', date: '2025-03-28' },
  { id: 3, orderId: 103, customerName: 'Samuel Johnson', totalAmount: 150, status: 'Paid', date: '2025-04-02' },
  { id: 4, orderId: 104, customerName: 'Emily Davis', totalAmount: 500, status: 'Unpaid', date: '2025-03-30' },
];

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Handle Status Update
  const handleMarkAsPaid = (invoiceId: number) => {
    setInvoices(
      invoices.map((invoice) => 
        invoice.id === invoiceId ? { ...invoice, status: 'Paid' } : invoice
      )
    );
  };

  // Handle Search/Filter
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.orderId.toString().includes(search.toLowerCase()) ||
      (statusFilter && invoice.status === statusFilter)
  );

  const handleViewDetails = (invoiceId: number) => {
    // Implement your view details functionality here
    console.log(`Viewing details for invoice ${invoiceId}`);
  };

  const handleDownloadPDF = (invoiceId: number) => {
    // Implement your download PDF functionality here
    console.log(`Downloading PDF for invoice ${invoiceId}`);
  };

  const handleDelete = (invoiceId: number) => {
    // Implement your delete functionality here
    setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));
  };

  return (
        //change the classname to orders if u dont want it to be same as items page

    <div className="Items-background">
        <Header />
        <Container>
            <h2 className="my-4">Invoices</h2>
            
            {/* Search and Filter */}
            <Row className="mb-3">
                <Col>
                <Form.Control
                    type="text"
                    placeholder="Search invoices (ID, Customer, Order)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                </Col>
                <Col>
                <Form.Control
                    as="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    placeholder="Filter by Status"
                >
                    <option value="">Filter by Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                </Form.Control>
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Invoice ID</th>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Date of Issue</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.orderId}</td>
                    <td>{invoice.customerName}</td>
                    <td>${invoice.totalAmount.toFixed(2)}</td>
                    <td>
                        <Button
                        variant={invoice.status === 'Unpaid' ? 'danger' : invoice.status === 'Paid' ? 'success' : 'warning'}
                        size="sm"
                        onClick={() => handleMarkAsPaid(invoice.id)}
                        >
                        {invoice.status}
                        </Button>
                    </td>
                    <td>{invoice.date}</td>
                    <td>
                        <Button variant="info" size="sm" onClick={() => handleViewDetails(invoice.id)}>
                        <Visibility />
                        </Button>{' '}
                        <Button variant="info" size="sm" onClick={() => handleDownloadPDF(invoice.id)}>
                        <FileDownload />
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(invoice.id)}>
                        <Delete />
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </Container>
    </div>
  );
};

export default Invoices;
