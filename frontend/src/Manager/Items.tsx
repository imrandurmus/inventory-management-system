import Header from "../DashComponents/Header";
import "../CSS/Items.css";
import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import { Edit, Delete } from '@mui/icons-material'; // MUI Icons

// Mock Data for Products
const initialProducts = [
  { id: 1, name: 'Product A', quantity: 100, price: 10.0 },
  { id: 2, name: 'Product B', quantity: 150, price: 20.0 },
  { id: 3, name: 'Product C', quantity: 200, price: 15.5 },
  { id: 4, name: 'Product D', quantity: 300, price: 30.0 },
  { id: 5, name: 'Product E', quantity: 50, price: 25.0 },
  // Add more products if needed
];

const Items: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('name');

  // Handle Sorting
  const handleSort = (column: string) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortColumn(column);

    const sortedProducts = [...products].sort((a, b) => {
      if (column === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (column === 'price') {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (column === 'quantity') {
        return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
      }
      return 0;
    });
    setProducts(sortedProducts);
  };

  // Handle Search/Filter
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) || 
      product.quantity.toString().includes(search) || 
      product.price.toString().includes(search)
  );

  const handleEdit = (productId: number) => {
    // Implement your edit functionality here
    console.log(`Editing product ${productId}`);
  };

  const handleDelete = (productId: number) => {
    // Implement your delete functionality here
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <div className="Items-background">
        <Header />
    <Container>
      <h2 className="my-4">Product Management</h2>
      
      {/* Search Bar */}
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Button variant="primary" onClick={() => console.log('Add new product')}>
            Add New Product
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>Product ID</th>
            <th onClick={() => handleSort('name')}>Product Name</th>
            <th onClick={() => handleSort('quantity')}>Quantity</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(product.id)}>
                  <Edit />
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
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

export default Items;