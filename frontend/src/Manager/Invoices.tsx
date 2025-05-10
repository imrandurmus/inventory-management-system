import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
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
  Alert,
} from 'react-bootstrap';
import { Delete, Visibility, FileDownload, Add } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  deleteInvoice,
  getBusinessInfo,
  Invoice,
  InvoiceDetails,
  BusinessInfo,
} from '../../services/api';

const Invoices: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    totalAmount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceDetails | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sorting state
  const [sortAmountOrder, setSortAmountOrder] = useState<'asc' | 'desc' | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch invoices and business info
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setApiError(null);

        // Fetch invoices
        const { content, totalPages } = await getInvoices(currentPage - 1, itemsPerPage);
        setInvoices(content);
        setTotalPages(totalPages);

        // Fetch business info
        const info = await getBusinessInfo();
        setBusinessInfo(info);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setApiError(err.message || 'Failed to load invoices');
        if (err.message.includes('Session expired')) {
          navigate('/Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, navigate]);

  // Handle Search/Filter
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customerName.toLowerCase().includes(search.trim().toLowerCase()) ||
      invoice.orderId.includes(search.trim()) ||
      invoice.totalAmount.toString().includes(search.trim()) ||
      invoice.date.includes(search.trim())
  );

  // Handle sorting by amount
  const handleSortAmount = () => {
    const newOrder = sortAmountOrder === 'asc' ? 'desc' : 'asc';
    setSortAmountOrder(newOrder);
    setCurrentPage(1);
  };

  // Sort filtered invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortAmountOrder) return 0;
    return sortAmountOrder === 'asc'
      ? a.totalAmount - b.totalAmount
      : b.totalAmount - a.totalAmount;
  });

  // Pagination logic
  const currentInvoices = sortedInvoices;

  // Generate PDF
  const generatePDF = (invoice: InvoiceDetails) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Business Name: ${businessInfo?.name || 'SIMPLE Corp'}`, 10, 30);
    doc.text(`Address: ${businessInfo?.address || '1234 Business NYC, Suite 100'}`, 10, 35);
    doc.text(`Phone: ${businessInfo?.phone || '(123) 456-7890'}`, 10, 40);
    doc.text(`Email: ${businessInfo?.email || 'contact@simple.com'}`, 10, 45);
    doc.text(`Invoice Number: ${invoice.id}`, 10, 60);
    doc.text(`Order Number: ${invoice.orderId}`, 10, 65);
    doc.text(`Customer: ${invoice.customerName}`, 10, 70);
    doc.text(`Date of Issue: ${invoice.date}`, 10, 75);
    doc.line(10, 80, 200, 80);
    doc.text('Item Description', 10, 90);
    doc.text('Quantity', 140, 90);
    doc.text('Unit Price', 160, 90);
    doc.text('Total', 180, 90);

    // Dynamic items
    let y = 100;
    invoice.items.forEach((item) => {
      doc.text(item.productName, 10, y);
      doc.text(item.quantity.toString(), 140, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 160, y);
      doc.text(`$${item.totalPrice.toFixed(2)}`, 180, y);
      y += 10;
    });

    doc.text('Total Amount: ', 140, y + 10);
    doc.text(`$${invoice.totalAmount.toFixed(2)}`, 180, y + 10);
    doc.setFontSize(8);
    doc.text(
      'Terms & Conditions: Return allowed within 30 days of the invoice date.',
      10,
      270
    );
    doc.text('Thank you for doing business with us!', 10, 275);
    return doc;
  };

  // Handle View Details
  const handleViewDetails = async (invoiceId: string) => {
    try {
      const invoice = await getInvoice(invoiceId);
      setPreviewInvoice(invoice);
      const doc = generatePDF(invoice);
      const pdfUrl = doc.output('datauristring');
      setPdfDataUrl(pdfUrl);
      setShowModal(true);
    } catch (err: any) {
      console.error('View error:', err);
      setErrorMessage('Failed to load invoice details');
    }
  };

  // Handle Download PDF
  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      const invoice = await getInvoice(invoiceId);
      const doc = generatePDF(invoice);
      doc.save(`invoice_${invoice.id}.pdf`);
    } catch (err: any) {
      console.error('Download error:', err);
      setErrorMessage('Failed to download invoice');
    }
  };

  // Handle Delete
  const handleDelete = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setShowDeleteConfirm(true);
  };

  // Confirm Deletion
  const confirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        await deleteInvoice(invoiceToDelete);
        setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete));
        setShowDeleteConfirm(false);
        setInvoiceToDelete(null);
        setCurrentPage(1);
      } catch (err: any) {
        console.error('Delete error:', err);
        setErrorMessage('Failed to delete invoice');
      }
    }
  };

  // Cancel Deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInvoiceToDelete(null);
  };

  // Handle Total Amount Input
  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setNewOrder({ ...newOrder, totalAmount: value });
      setErrorMessage('');
    } else {
      setErrorMessage('Total Amount cannot be negative.');
    }
  };

  // Handle Create Invoice
  const handleCreateOrder = async () => {
    const totalAmount = parseFloat(newOrder.totalAmount);
    if (isNaN(totalAmount) || totalAmount < 0) {
      setErrorMessage('Please enter a valid non-negative total amount.');
      return;
    }
    if (!newOrder.customerName.trim()) {
      setErrorMessage('Customer Name is required.');
      return;
    }

    try {
      const newInvoice = await createInvoice({
        customerName: newOrder.customerName,
        totalAmount,
        date: newOrder.date,
      });
      setInvoices([...invoices, newInvoice]);
      setShowCreateModal(false);
      setNewOrder({
        customerName: '',
        totalAmount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrorMessage('');
      setCurrentPage(1);
    } catch (err: any) {
      console.error('Create error:', err);
      setErrorMessage('Failed to create invoice');
    }
  };

  if (loading) {
    return (
      <div className="Items-background">
        <Header />
        <Container className="mt-5">
          <Alert variant="info">Loading invoices...</Alert>
        </Container>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="Items-background">
        <Header />
        <Container className="mt-5">
          <Alert variant="danger">
            {apiError}
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="Items-background">
        <Container>
          <h2 className="my-4">Invoices</h2>
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
              {errorMessage}
            </Alert>
          )}
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder={t("Minvoice.Search invoices (Customer, Order)")}
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
                <Add /> {t("Minvoice.Create New Order")}
              </Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("Minvoice.Invoice ID")}</th>
                <th>{t("Morders.Order ID")}</th>
                <th>{t("Morders.Customer Name")}</th>
                <th onClick={handleSortAmount} style={{ cursor: 'pointer' }}>
                  {t("Minvoice.Total Amount")}
                  <span style={{ marginLeft: '8px', fontSize: '0.8em' }}>
                    <span
                      style={{
                        color: sortAmountOrder === 'asc' ? 'black' : '#ccc',
                      }}
                    >
                      ↑
                    </span>
                    <span
                      style={{
                        marginLeft: '4px',
                        color: sortAmountOrder === 'desc' ? 'black' : '#ccc',
                      }}
                    >
                      ↓
                    </span>
                  </span>
                </th>
                <th>{t("Minvoice.Date Of Issue")}</th>
                <th>{t("Minvoice.Actions")}</th>
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
                    </Button>{' '}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleDownloadPDF(invoice.id)}
                    >
                      <FileDownload />
                    </Button>{' '}
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

      {/* Create Invoice Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Minvoice.Create New Invoice")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
              {errorMessage}
            </Alert>
          )}
          <Form>
            <Form.Group controlId="customerName">
              <Form.Label>{t("Minvoice.Customer Name")}</Form.Label>
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
              <Form.Label>{t("Minvoice.Total Amount")}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t("Minvoice.Enter Total Amount")}
                value={newOrder.totalAmount}
                onChange={handleTotalAmountChange}
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>{t("Minvoice.Date")}</Form.Label>
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
            {t("Minvoice.Close")}
          </Button>
          <Button variant="primary" onClick={handleCreateOrder}>
            {t("Minvoice.Create Invoice")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Minvoice.Confirm Deletion")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("Minvoice.Are you sure you want to delete this invoice? This action cannot be undone.")}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            {t("Morders.Cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("Morders.Delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Invoice Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("Minvoice.Invoice Preview")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="Invoice Preview"
            />
          ) : (
            <p>{t("Minvoice.Loading PDF preview...")}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("Minvoice.Close")}
          </Button>
          {previewInvoice && (
            <Button
              variant="primary"
              onClick={() => handleDownloadPDF(previewInvoice.id)}
            >
              {t("Minvoice.Download PDF")}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Invoices;