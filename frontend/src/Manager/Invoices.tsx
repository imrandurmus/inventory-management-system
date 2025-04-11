//DONT FORGET TO CHNAGE IT SO THAT THE PDF VALUES ARE REPLCACED WITH BACKEND VALUES AND NOT AUTO GENERATED
import React, { useState } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Badge,
  Pagination,
} from "react-bootstrap";
import { Delete, Visibility, FileDownload, Add } from "@mui/icons-material";
import Header from "../DashComponents/Header";
import { jsPDF } from "jspdf";

// Mock Data for Invoices
const initialInvoices = [
  {
    id: 1,
    orderId: 101,
    customerName: "John Doe",
    totalAmount: 120,
    date: "2025-04-01",
  },
  {
    id: 2,
    orderId: 102,
    customerName: "Jane Smith",
    totalAmount: 230,
    date: "2025-03-28",
  },
  {
    id: 3,
    orderId: 103,
    customerName: "Samuel Johnson",
    totalAmount: 150,
    date: "2025-04-02",
  },
  {
    id: 4,
    orderId: 104,
    customerName: "Emily Davis",
    totalAmount: 500,
    date: "2025-03-30",
  },
  {
    id: 5,
    orderId: 101,
    customerName: "John wDoe",
    totalAmount: 120,
    date: "2025-04-01",
  },
  {
    id: 6,
    orderId: 102,
    customerName: "Jane Swmith",
    totalAmount: 230,
    date: "2025-03-28",
  },
  {
    id: 7,
    orderId: 103,
    customerName: "Samuelw Johnson",
    totalAmount: 150,
    date: "2025-04-02",
  },
  {
    id: 8,
    orderId: 104,
    customerName: "Emily wDavis",
    totalAmount: 500,
    date: "2025-03-30",
  },
  {
    id: 9,
    orderId: 103,
    customerName: "Sadmuel Johnson",
    totalAmount: 150,
    date: "2025-04-02",
  },
  {
    id: 10,
    orderId: 104,
    customerName: "Emidly Davis",
    totalAmount: 500,
    date: "2025-03-30",
  },
  {
    id: 11,
    orderId: 101,
    customerName: "Johdn wDoe",
    totalAmount: 120,
    date: "2025-04-01",
  },
  {
    id: 12,
    orderId: 102,
    customerName: "Jande Swmith",
    totalAmount: 230,
    date: "2025-03-28",
  },
  {
    id: 13,
    orderId: 103,
    customerName: "Samduelw Johnson",
    totalAmount: 150,
    date: "2025-04-02",
  },
  {
    id: 14,
    orderId: 104,
    customerName: "Emidly wDavis",
    totalAmount: 500,
    date: "2025-03-30",
  },
];

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const [newOrder, setNewOrder] = useState({
    orderId: "",
    customerName: "",
    totalAmount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Sorting state for Amount column
  const [sortAmountOrder, setSortAmountOrder] = useState<"asc" | "desc" | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle Search/Filter
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName
        .toLowerCase()
        .includes(search.trim().toLowerCase()) ||
      invoice.orderId.toString().includes(search.trim().toLowerCase()) ||
      invoice.totalAmount.toString().includes(search.trim()) ||
      invoice.date.includes(search.trim())
  );

  // handle sorting by amount
  const handleSortAmount = () => {
    const newOrder = sortAmountOrder === "asc" ? "desc" : "asc";
    setSortAmountOrder(newOrder);
    setCurrentPage(1);
  };

  // Sort the filtered invoices by amount
  if (sortAmountOrder) {
    filteredInvoices.sort((a, b) => {
      if (sortAmountOrder === "asc") {
        return a.totalAmount - b.totalAmount;
      } else {
        return b.totalAmount - a.totalAmount;
      }
    });
  }

  // Pagination logic
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Generate PDF content (used for both preview and download)
  const generatePDF = (invoice: any) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Business Name: XYZ Corp", 10, 30);
    doc.text("Address: 1234 Business Rd, Suite 100", 10, 35);
    doc.text("Phone: (123) 456-7890", 10, 40);
    doc.text("Email: contact@xyzcorp.com", 10, 45);
    doc.text(`Invoice Number: ${invoice.id}`, 10, 60);
    doc.text(`Order Number: ${invoice.orderId}`, 10, 65);
    doc.text(`Customer: ${invoice.customerName}`, 10, 70);
    doc.text(`Date of Issue: ${invoice.date}`, 10, 75);
    doc.line(10, 80, 200, 80);
    doc.text("Item Description", 10, 90);
    doc.text("Quantity", 140, 90);
    doc.text("Unit Price", 160, 90);
    doc.text("Total", 180, 90);
    doc.text("Product A", 10, 100);
    doc.text("1", 140, 100);
    doc.text("$120.00", 160, 100);
    doc.text("$120.00", 180, 100);
    doc.text("Total Amount: ", 140, 120);
    doc.text(`$${invoice.totalAmount.toFixed(2)}`, 180, 120);
    doc.setFontSize(8);
    doc.text(
      "Terms & Conditions: Payment due within 30 days of the invoice date.",
      10,
      270
    );
    doc.text("Thank you for doing business with us!", 10, 275);
    return doc;
  };

  // Handle View Details (show preview of the invoice as a PDF)
  const handleViewDetails = (invoiceId: number) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      setPreviewInvoice(invoice);
      const doc = generatePDF(invoice);
      const pdfUrl = doc.output("datauristring");
      setPdfDataUrl(pdfUrl);
      setShowModal(true);
    }
  };

  // Handle downloading the PDF
  const handleDownloadPDF = (invoiceId: number) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (invoice) {
      const doc = generatePDF(invoice);
      doc.save(`invoice_${invoice.id}.pdf`);
    }
  };

  // Handle delete functionality with confirmation
  const handleDelete = (invoiceId: number) => {
    setInvoiceToDelete(invoiceId);
    setShowDeleteConfirm(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (invoiceToDelete !== null) {
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceToDelete));
      setShowDeleteConfirm(false);
      setInvoiceToDelete(null);
      setCurrentPage(1);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInvoiceToDelete(null);
  };

  // Handle input change for totalAmount to prevent negative values
  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setNewOrder({ ...newOrder, totalAmount: value });
      setErrorMessage("");
    } else {
      setErrorMessage("Total Amount cannot be negative.");
    }
  };

  // Handle Create Order Form Submission with validation
  const handleCreateOrder = () => {
    const totalAmount = parseFloat(newOrder.totalAmount);
    if (isNaN(totalAmount) || totalAmount < 0) {
      setErrorMessage("Please enter a valid non-negative total amount.");
      return;
    }

    if (!newOrder.customerName.trim()) {
      setErrorMessage("Customer Name is required.");
      return;
    }

    const uniqueCustomerName = generateUniqueCustomerName(
      newOrder.customerName
    );
    const newInvoice = {
      ...newOrder,
      id: invoices.length + 1,
      orderId:
        invoices.length > 0
          ? Math.max(...invoices.map((inv) => inv.orderId)) + 1
          : 101,
      totalAmount: totalAmount,
      customerName: uniqueCustomerName,
    };
    setInvoices([...invoices, newInvoice]);
    setShowCreateModal(false);
    setNewOrder({
      orderId: "",
      customerName: "",
      totalAmount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setErrorMessage("");
    setCurrentPage(1);
  };

  // Function to ensure unique customer name
  const generateUniqueCustomerName = (name: string) => {
    const existingNames = invoices.map((inv) => inv.customerName);
    let uniqueName = name;
    let counter = 1;

    while (existingNames.includes(uniqueName)) {
      uniqueName = `${name} (${counter})`;
      counter++;
    }

    return uniqueName;
  };

  return (
    <>
      <Header />
      <div className="Items-background">
        <Container>
          <h2 className="my-4">Invoices</h2>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Search invoices (Customer, Order)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => setShowCreateModal(true)}
                className="float-right"
              >
                <Add /> Create New Order
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th onClick={handleSortAmount} style={{ cursor: "pointer" }}>
                  Total Amount
                  <span style={{ marginLeft: "8px", fontSize: "0.8em" }}>
                    <span
                      style={{
                        color: sortAmountOrder === "asc" ? "black" : "#ccc",
                      }}
                    >
                      ↑
                    </span>
                    <span
                      style={{
                        marginLeft: "4px",
                        color: sortAmountOrder === "desc" ? "black" : "#ccc",
                      }}
                    >
                      ↓
                    </span>
                  </span>
                </th>
                <th>Date Of Issue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.orderId}</td>
                  <td>{invoice.customerName}</td>
                  <td>${invoice.totalAmount.toFixed(2)}</td>
                  <td>{invoice.date}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(invoice.id)}
                    >
                      <Visibility />
                    </Button>{" "}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleDownloadPDF(invoice.id)}
                    >
                      <FileDownload />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      <Delete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </Container>
      </div>

      {/* Modal for creating new order */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <Form>
            <Form.Group controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Customer Name"
                value={newOrder.customerName}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, customerName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="totalAmount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Total Amount"
                value={newOrder.totalAmount}
                onChange={handleTotalAmountChange}
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newOrder.date}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateOrder}>
            Create Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this invoice? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Invoice Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="Invoice Preview"
            />
          ) : (
            <p>Loading PDF preview...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {previewInvoice && (
            <Button
              variant="primary"
              onClick={() => handleDownloadPDF(previewInvoice.id)}
            >
              Download PDF
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Invoices;
