import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Header from '../DashComponents/Header';


// Mock Data for Orders
const initialOrders = [
  { id: 1, customerName: 'John Doe', product: 'Product A', quantity: 2, totalPrice: 20, status: 'Pending' },
  { id: 2, customerName: 'Jane Smith', product: 'Product B', quantity: 3, totalPrice: 60, status: 'Shipped' },
  { id: 3, customerName: 'Samuel Johnson', product: 'Product C', quantity: 1, totalPrice: 15.5, status: 'Delivered' },
  { id: 4, customerName: 'Emily Davis', product: 'Product D', quantity: 5, totalPrice: 150, status: 'Pending' },
  { id: 5, customerName: 'Michael Brown', product: 'Product E', quantity: 4, totalPrice: 100, status: 'Shipped' },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  //handles status update
  const handleStatusUpdate = (orderId: number, status: string) => {
    setOrders(
      orders.map((order) => 
        order.id === orderId ? { ...order, status: status } : order
      )
    );
  };

  // Handle Search/Filter
  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search.toLowerCase()) ||
      (statusFilter && order.status === statusFilter)
  );

  const handleEdit = (orderId: number) => {
    // Implement your edit functionality here
    console.log(`Editing order ${orderId}`);
  };

  const handleDelete = (orderId: number) => {
    // Implement your delete functionality here
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  return (
    //change the classname to orders if u dont want it to be same as items page
    <div className="Items-background">
        <Header />
    <Container>
      <h2 className="my-4">Manage Orders</h2>
      
      {/* Search and Filter */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search orders (ID, Customer, Product)"
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
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </Form.Control>
        </Col>
      </Row>

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
          {filteredOrders.map((order) => (
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
                <Button variant="info" size="sm" onClick={() => handleEdit(order.id)}>
                  <Visibility />
                </Button>{' '}
                <Button variant="warning" size="sm" onClick={() => handleEdit(order.id)}>
                  <Edit />
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(order.id)}>
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

export default Orders;
