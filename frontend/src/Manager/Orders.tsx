import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form, Modal, Toast, Pagination } from 'react-bootstrap';
import { Delete } from '@mui/icons-material';
import Header from '../DashComponents/Header';
import '../CSS/Orders.css';

// Mock Data for Orders
const initialOrders = [
  { id: 1, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20 },
  { id: 2, customerName: 'Jane Smith', product: 'Product B', quantity: 3, totalPrice: 60 },
  { id: 3, customerName: 'Samuel Johnson', product: 'Product C', quantity: 1, totalPrice: 15.5 },
  { id: 4, customerName: 'Emily Davis', product: 'Product D', quantity: 5, totalPrice: 150 },
  { id: 5, customerName: 'Michael Brown', product: 'Product E', quantity: 4, totalPrice: 100 },
  { id: 6, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20 },
  { id: 7, customerName: 'Jane Smith', product: 'Product V', quantity: 3, totalPrice: 60 },
  { id: 8, customerName: 'Samuel Johnson', product: 'Product R', quantity: 1, totalPrice: 15.5 },
  { id: 9, customerName: 'Emily Davis', product: 'Product D', quantity: 5, totalPrice: 150 },
  { id: 10, customerName: 'Michael Brown', product: 'Product E', quantity: 4, totalPrice: 100 },
];

// Mock Product Catalog with Categories
const productCatalog = [
  {
    category: 'Electronics',
    products: [
      { name: 'Product A', price: 10 },
      { name: 'Product B', price: 20 },
    ],
  },
  {
    category: 'Books',
    products: [
      { name: 'Product C', price: 15.5 },
      { name: 'Product D', price: 30 },
    ],
  },
  {
    category: 'Groceries',
    products: [
      { name: 'Product E', price: 25 },
      { name: 'Product R', price: 15.5 },
      { name: 'Product V', price: 20 },
    ],
  },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [sortByProduct, setSortByProduct] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    products: [], // Array of { product: string, quantity: number }
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
      products: [],
    });
  };

  // Handle checkbox changes for product selection
  const handleProductChange = (product: string, checked: boolean) => {
    setNewOrder((prev) => {
      let updatedProducts = [...prev.products];
      if (checked) {
        if (!updatedProducts.some((p) => p.product === product)) {
          updatedProducts.push({ product, quantity: 1 });
        }
      } else {
        updatedProducts = updatedProducts.filter((p) => p.product !== product);
      }
      return { ...prev, products: updatedProducts };
    });
  };

  // Handle quantity changes for a specific product
  const handleQuantityChange = (product: string, quantity: number) => {
    setNewOrder((prev) => {
      const updatedProducts = prev.products.map((p) =>
        p.product === product ? { ...p, quantity: quantity >= 1 ? quantity : 1 } : p
      );
      return { ...prev, products: updatedProducts };
    });
  };

  // Calculate total price based on selected products and quantities
  const calculateTotalPrice = () => {
    return newOrder.products.reduce((total, { product, quantity }) => {
      const category = productCatalog.find((cat) => cat.products.some((p) => p.name === product));
      const productDetails = category?.products.find((p) => p.name === product);
      const price = productDetails ? productDetails.price : 0;
      return total + price * quantity;
    }, 0);
  };

  const handleSaveOrder = () => {
    if (!newOrder.customerName || newOrder.products.length === 0) {
      setToastVariant('danger');
      setToastMessage('Please fill in customer name and select at least one product.');
      setShowToast(true);
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      setToastVariant('danger');
      setToastMessage('Total price must be greater than zero.');
      setShowToast(true);
      return;
    }

    // Create one order per product
    const newOrders = newOrder.products.map((item, index) => {
      const category = productCatalog.find((cat) => cat.products.some((p) => p.name === item.product));
      const productDetails = category?.products.find((p) => p.name === item.product);
      return {
        id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 + index : 1 + index,
        customerName: newOrder.customerName,
        product: item.product,
        quantity: item.quantity,
        totalPrice: (productDetails?.price || 0) * item.quantity,
      };
    });

    setOrders([...newOrders, ...orders]);
    setToastVariant('success');
    setToastMessage('Order(s) added successfully!');
    setShowToast(true);
    handleCloseModal();
    setCurrentPage(1);
  };

  const handleDelete = (orderId: number) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    if (filteredOrders.length <= itemsPerPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter and sort logic
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.product.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortByProduct === 'asc') {
        return a.product.localeCompare(b.product);
      } else if (sortByProduct === 'desc') {
        return b.product.localeCompare(a.product);
      }
      return 0;
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
  };

  const applySort = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="Items-background">
        <Container>
          <h2 className="ManageOrdersPage">Manage Orders</h2>

          {/* Search and Sort */}
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
                value={sortByProduct}
                onChange={(e) => setSortByProduct(e.target.value)}
              >
                <option value="">Sort by Product</option>
                <option value="asc">Product: A-Z</option>
                <option value="desc">Product: Z-A</option>
              </Form.Control>
            </Col>
            <Col md={2}>
              <Button variant="primary" onClick={applySort}>
                Apply Sort
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
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                  {paginationItems}
                  <Pagination.Next
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>
          )}

          {/* Modal for New Order */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg">
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
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Products</Form.Label>
                <div
                  style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    padding: '10px',
                  }}
                >
                  {productCatalog.map((category) => (
                    <div key={category.category} className="mb-3">
                      <h6>{category.category}</h6>
                      {category.products.map((product) => (
                        <Row key={product.name} className="mb-2 align-items-center">
                          <Col xs={6}>
                            <Form.Check
                              type="checkbox"
                              label={`${product.name} ($${product.price.toFixed(2)})`}
                              checked={newOrder.products.some((p) => p.product === product.name)}
                              onChange={(e) => handleProductChange(product.name, e.target.checked)}
                            />
                          </Col>
                          <Col xs={6}>
                            {newOrder.products.some((p) => p.product === product.name) && (
                              <Form.Control
                                type="number"
                                min={1}
                                value={
                                  newOrder.products.find((p) => p.product === product.name)?.quantity || 1
                                }
                                onChange={(e) => handleQuantityChange(product.name, parseInt(e.target.value))}
                              />
                            )}
                          </Col>
                        </Row>
                      ))}
                    </div>
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Total Price</Form.Label>
                <Form.Control
                  type="text"
                  value={`$${calculateTotalPrice().toFixed(2)}`}
                  readOnly
                />
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