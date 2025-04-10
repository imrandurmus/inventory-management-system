import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form, Modal, Toast, Pagination } from 'react-bootstrap';
import { Delete } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import '../CSS/Orders.css';

// Mock Data for Orders
const initialOrders = [
  { id: 1, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20, status: 'Pending' },
  { id: 2, customerName: 'Jane Smith', product: 'Product B', quantity: 3, totalPrice: 60, status: 'Shipped' },
  { id: 3, customerName: 'Samuel Johnson', product: 'Product C', quantity: 1, totalPrice: 15.5, status: 'Delivered' },
  { id: 4, customerName: 'Emily Davis', product: 'Product D', quantity: 5, totalPrice: 150, status: 'Pending' },
  { id: 5, customerName: 'Michael Brown', product: 'Product E', quantity: 4, totalPrice: 100, status: 'Shipped' },
  { id: 6, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20, status: 'Pending' },
  { id: 7, customerName: 'Jane Smith', product: 'Product V', quantity: 3, totalPrice: 60, status: 'Shipped' },
  { id: 8, customerName: 'Samuel Johnson', product: 'Product R', quantity: 1, totalPrice: 15.5, status: 'Delivered' },
  { id: 9, customerName: 'Emily Davis', product: 'Product D', quantity: 5, totalPrice: 150, status: 'Pending' },
  { id: 10, customerName: 'Michael Brown', product: 'Product E', quantity: 4, totalPrice: 100, status: 'Shipped' },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    product: '',
    quantity: 1,
    totalPrice: 0,
    status: 'Pending',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewOrder({
      customerName: '',
      product: '',
      quantity: 1,
      totalPrice: 0,
      status: 'Pending',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: name === 'quantity' || name === 'totalPrice' ? parseFloat(value) : value });
  };

  const handleSaveOrder = () => {
    if (!newOrder.customerName || !newOrder.product || !newOrder.totalPrice) {
      setToastVariant('danger');
      setToastMessage('Please fill in all required fields.');
      setShowToast(true);
      return;
    }

    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    setOrders([{ id: newId, ...newOrder }, ...orders]);
    setToastVariant('success');
    setToastMessage('Order added successfully!');
    setShowToast(true);
    handleCloseModal();
    setCurrentPage(1);
  };

  const handleStatusUpdate = (orderId: number, status: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: status } : order
      )
    );
  };

  const handleDelete = (orderId: number) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    if (filteredOrders.length <= itemsPerPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Updated filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => paginate(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Function to reset pagination when applying filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <>
      <Header />
      <div className="Items-background">
        <Container>
          <h2 className="ManageOrdersPage">Manage Orders</h2>

          {/* Search and Filter */}
          <Row className="mb-3 align-items-end">
            <Col md={5}>
              <Form.Control
                type="text"
                placeholder="Search orders (ID, Customer, Product)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Control
                as="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </Form.Control>
            </Col>
            <Col md={2}>
              <Button variant="primary" onClick={applyFilters}>
                Apply Filters
              </Button>
            </Col>
          </Row>

          <Button className="mb-3" variant="primary" onClick={handleShowModal}>
            + Add New Order
          </Button>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <Button
                      variant={order.status === 'Pending' ? 'warning' : order.status === 'Shipped' ? 'info' : 'success'}
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id, order.status === 'Pending' ? 'Shipped' : 'Delivered')}
                    >
                      {order.status}
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
                      <Delete />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Row className="mt-3">
              <Col>
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {paginationItems}
                  <Pagination.Next
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>
          )}

          {/* Modal for New Order */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={newOrder.customerName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product</Form.Label>
                <Form.Control
                  type="text"
                  name="product"
                  value={newOrder.product}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min={1}
                  value={newOrder.quantity}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="number"
                  name="totalPrice"
                  min={0}
                  step={0.01}
                  value={newOrder.totalPrice}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={newOrder.status} onChange={handleInputChange}>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveOrder}>
                Save Order
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Toast notification */}
          <div
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 9999,
            }}
          >
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              bg={toastVariant}
              delay={3000}
              autohide
            >
              <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Orders;