import Header from "../DashComponents/Header";
import '../CSS/Items.css';
import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form, Modal, Pagination } from 'react-bootstrap';
import { Edit, Delete } from '@mui/icons-material';

const initialProducts = [
  { id: 1, name: 'Product A', quantity: 100, price: 10.0, type: 'Electronics' },
  { id: 2, name: 'Product B', quantity: 0, price: 20.0, type: 'Books' },
  { id: 3, name: 'Product C', quantity: 5, price: 15.5, type: 'Electronics' },
  { id: 4, name: 'Product D', quantity: 300, price: 30.0, type: 'Groceries' },
  { id: 5, name: 'Product E', quantity: 2, price: 25.0, type: 'Books' },
  { id: 6, name: 'Product F', quantity: 100, price: 10.0, type: 'Electronics' },
  { id: 7, name: 'Product G', quantity: 0, price: 20.0, type: 'Books' },
  { id: 8, name: 'Product H', quantity: 5, price: 15.5, type: 'Electronics' },
  { id: 9, name: 'Product I', quantity: 300, price: 30.0, type: 'Groceries' },
  { id: 10, name: 'Product J', quantity: 2, price: 25.0, type: 'Books' },
];

const Items: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formValues, setFormValues] = useState({ name: '', price: '', quantity: '', type: '' });

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newProductType, setNewProductType] = useState('');
  const [customProductTypes, setCustomProductTypes] = useState<string[]>([]);

  const predefinedTypes = ['Electronics', 'Books', 'Groceries'];
  const productTypes = ['All', ...new Set([...predefinedTypes, ...customProductTypes])];
  const stockStatuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  const handleSort = (column: string) => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    setSortColumn(column);

    const sortedProducts = [...products].sort((a, b) => {
      if (column === 'name') return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (column === 'price') return order === 'asc' ? a.price - b.price : b.price - a.price;
      if (column === 'quantity') return order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
      return 0;
    });
    setProducts(sortedProducts);
  };

  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter(product => (typeFilter !== 'All' ? product.type === typeFilter : true))
    .filter(product => {
      if (stockFilter === 'In Stock') return product.quantity > 0;
      if (stockFilter === 'Low Stock') return product.quantity > 0 && product.quantity <= 10;
      if (stockFilter === 'Out of Stock') return product.quantity === 0;
      return true;
    });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleDelete = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormValues({ name: '', price: '', quantity: '', type: '' });
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      type: product.type,
    });
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormValues({ ...formValues, [target.name]: target.value });
  };
  
  

  const handleFormSubmit = () => {
    const price = parseFloat(formValues.price);
    const quantity = parseInt(formValues.quantity);

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price greater than 0.');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      alert('Please enter a valid quantity greater than or equal to 0.');
      return;
    }
    if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
      alert('Price and Quantity must be valid and non-negative.');
      return;
    }
    
    const existingProduct = products.find(p => p.name.toLowerCase() === formValues.name.toLowerCase());
    if (existingProduct && (!editingProduct || existingProduct.id !== editingProduct.id)) {
      alert('Product name must be unique.');
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...editingProduct, ...formValues, price, quantity }
          : p
      ));
    } else {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...formValues,
        price,
        quantity,
      };
      setProducts([...products, newProduct]);
    }

    setShowModal(false);
  };

  return (
    <>
    <Header />
    <div className="Items-background">
      <Container>
        <h2 className="ProductManagemnetTitle">Product Management</h2>
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
            <Button variant="primary" onClick={openAddModal}>
              Add New Product
            </Button>{' '}
            <Button className="NewProductTypeButton" variant="secondary" onClick={() => setShowTypeModal(true)}>
              Add Product Type
            </Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {productTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              {stockStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Type</th>
              <th onClick={() => handleSort('id')}>Product ID</th>
              <th onClick={() => handleSort('name')}>Product Name</th>
              <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                Quantity&nbsp;
                <span style={{ fontSize: '0.8rem' }}>
                  <span style={{ color: sortColumn === 'quantity' && sortOrder === 'asc' ? '#007bff' : '#ccc' }}>↑</span>
                  <span style={{ color: sortColumn === 'quantity' && sortOrder === 'desc' ? '#007bff' : '#ccc' }}>↓</span>
                </span>
              </th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price&nbsp;
                <span style={{ fontSize: '0.8rem' }}>
                  <span style={{ color: sortColumn === 'price' && sortOrder === 'asc' ? '#007bff' : '#ccc' }}>↑</span>
                  <span style={{ color: sortColumn === 'price' && sortOrder === 'desc' ? '#007bff' : '#ccc' }}>↓</span>
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.type}</td>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openEditModal(product)}>
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

        <Row className="justify-content-center">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </Col>
        </Row>

        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formValues.name}
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                min="0"
                value={formValues.price}
                onChange={handleFormChange}
                step="0.01"  // Allows decimal values for price
                required
              />
            </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min="0"
                  value={formValues.quantity}
                  onChange={handleFormChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  value={formValues.type}
                  onChange={handleFormChange}
                >
                  <option value="">Select Type</option>
                  {[...new Set([...predefinedTypes, ...customProductTypes])].map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add Product Type Modal */}
        <Modal show={showTypeModal} onHide={() => setShowTypeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>New Product Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter type name"
                  value={newProductType}
                  onChange={(e) => setNewProductType(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTypeModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const trimmed = newProductType.trim();
                if (trimmed && !productTypes.includes(trimmed)) {
                  setCustomProductTypes([...customProductTypes, trimmed]);
                }
                setNewProductType('');
                setShowTypeModal(false);
              }}
            >
              Add Type
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
    </>
  );
};

export default Items;
