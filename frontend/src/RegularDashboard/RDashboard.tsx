import React, { useState, useEffect } from 'react';
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
  Card,
  Alert,
} from 'react-bootstrap';
import { Add, Report } from '@mui/icons-material';
import '../CSS/RDashboard.css';
import { getCurrentEmployee, getProducts, updateProduct, reportProduct, User, Product } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface InventoryItem {
  id: string;
  name: string;
  itemType: string;
  quantityInStock: number;
  reorderLimit: number;
  lastUpdated: string;
}

interface Employee {
  id: string;
  name: string;
  assignedItemTypes: string[];
}

const RDashboard: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [sortQuantityOrder, setSortQuantityOrder] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStock, setTotalStock] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [productPrices, setProductPrices] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          throw new Error('Please log in to access the dashboard.');
        }

        // Fetch current employee
        const empData: User = await getCurrentEmployee();
        const employeeData: Employee = {
          id: empData.id,
          name: `${empData.firstName} ${empData.lastName}`,
          assignedItemTypes: empData.assignedProductTypes || [],
        };
        setEmployee(employeeData);

        // Fetch products
        const productData = await getProducts(
          currentPage - 1,
          itemsPerPage,
          sortQuantityOrder ? `quantity,${sortQuantityOrder}` : 'id'
        );
        const inventoryItems: InventoryItem[] = productData.products
          .filter((p) => employeeData.assignedItemTypes.includes(p.productType.name))
          .map((p) => ({
            id: p.id,
            name: p.name,
            itemType: p.productType.name,
            quantityInStock: p.quantity,
            reorderLimit: Math.floor(p.quantity * 0.2) || 5,
            lastUpdated: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }));
        setInventory(inventoryItems);
        const prices = productData.products.reduce((acc, p) => ({
          ...acc,
          [p.id]: p.price,
        }), {});
        setProductPrices(prices);
        setTotalPages(Math.ceil(productData.totalPages) || 1);

        // Calculate KPIs
        const total = inventoryItems.reduce((sum, item) => sum + item.quantityInStock, 0);
        const lowStock = inventoryItems.filter(
          (item) => item.quantityInStock <= item.reorderLimit
        ).length;
        const value = inventoryItems.reduce(
          (sum, item) => sum + item.quantityInStock * (prices[item.id] || 100),
          0
        );
        setTotalStock(total);
        setTotalStockValue(value);
        setLowStockItems(lowStock);
      } catch (err: any) {
        console.error('Fetch error:', err);
        if (err.message.includes('Session expired') || err.message.includes('Please log in')) {
          navigate('/login');
        }
        setError(err.message || 'Failed to load dashboard. Please try again or contact tech support.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortQuantityOrder, navigate]);

  let filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase())
  );

  if (stockFilter) {
    filteredInventory = filteredInventory.filter((item) => {
      if (stockFilter === 'Low Stock') {
        return item.quantityInStock <= item.reorderLimit && item.quantityInStock > 0;
      } else if (stockFilter === 'Out of Stock') {
        return item.quantityInStock === 0;
      }
      return true;
    });
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventory = filteredInventory.slice(startIndex, endIndex);

  const handleSortQuantity = () => {
    const newOrder = sortQuantityOrder === 'asc' ? 'desc' : 'asc';
    setSortQuantityOrder(newOrder);
    setCurrentPage(1);
  };

  const handleRestock = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  const confirmRestock = async () => {
    if (restockItem && restockQuantity) {
      const quantity = parseInt(restockQuantity);
      if (quantity <= 0 || isNaN(quantity)) {
        alert('Please enter a valid positive quantity.');
        return;
      }
      try {
        const productData = await getProducts(0, 1, 'id').then((data) =>
          data.products.find((p) => p.id === restockItem.id)
        );
        if (!productData) throw new Error('Product not found');
        await updateProduct(restockItem.id, {
          name: productData.name,
          description: productData.description,
          quantity: productData.quantity + quantity,
          price: productData.price,
          productTypeId: productData.productType.id,
        });
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item.id === restockItem.id
              ? {
                  ...item,
                  quantityInStock: item.quantityInStock + quantity,
                  lastUpdated: new Date().toISOString().split('T')[0],
                }
              : item
          )
        );
        setTotalStock(totalStock + quantity);
        setTotalStockValue(totalStockValue + quantity * (productPrices[restockItem.id] || 100));
        setLowStockItems(
          inventory
            .map((item) =>
              item.id === restockItem.id
                ? { ...item, quantityInStock: item.quantityInStock + quantity }
                : item
            )
            .filter((item) => item.quantityInStock <= item.reorderLimit).length
        );
        setShowRestockModal(false);
        setRestockItem(null);
        setRestockQuantity('');
      } catch (err: any) {
        alert(`Failed to restock: ${err.message}`);
      }
    }
  };

const handleReport = async (item: InventoryItem) => {
  try {
    await reportProduct(item.id, `Restock needed for ${item.name}`);
    alert(
      `Report submitted for ${item.name} (ID: ${item.id}). An announcement has been created for managers.`
    );
  } catch (err: any) {
    alert(`Failed to report: ${err.message}`);
  }
};
  const handleExportCSV = () => {
    const headers = [
      'Item ID,Name,Item Type,Quantity in Stock,Reorder Limit,Last Updated',
    ];
    const rows = filteredInventory.map(
      (item) =>
        `${item.id},${item.name},${item.itemType},${item.quantityInStock},${item.reorderLimit},${item.lastUpdated}`
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      'download',
      `inventory_${employee?.name || 'employee'}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Loading dashboard...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            {' '}
            <Button variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Unable to load employee data. Please try logging in again.
          <div className="mt-3">
            <Button variant="secondary" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="Rdashboard-background">
      <Container>
        <Row className="my-4">
          <Col>
            <h2>Employee Dashboard - {employee.name}</h2>
            <p>
              <strong>Assigned Item Types:</strong>{' '}
              {employee.assignedItemTypes.join(', ') || 'None'}
            </p>
          </Col>
          {/* Removed Log Out button from here */}
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Items in Stock</Card.Title>
                <Card.Text>{totalStock} units</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Low Stock Alerts</Card.Title>
                <Card.Text>{lowStockItems} items</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Stock Value</Card.Title>
                <Card.Text>${totalStockValue.toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h3>Inventory Management</h3>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search items (ID, Name)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              as="select"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">Filter by Stock Status</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </Form.Control>
          </Col>
          <Col md={2}>
            <Button
              variant="primary"
              onClick={handleExportCSV}
              className="float-right"
            >
              Export to CSV
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Item Type</th>
              <th onClick={handleSortQuantity} className="sortable">
                Quantity in Stock{' '}
                {sortQuantityOrder === 'asc'
                  ? '↑'
                  : sortQuantityOrder === 'desc'
                  ? '↓'
                  : ''}
              </th>
              <th>Reorder Limit</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.itemType}</td>
                <td>
                  {item.quantityInStock}{' '}
                  <Badge
                    bg={
                      item.quantityInStock === 0
                        ? 'danger'
                        : item.quantityInStock <= item.reorderLimit
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {item.quantityInStock === 0
                      ? 'Out of Stock'
                      : item.quantityInStock <= item.reorderLimit
                      ? 'Low Stock'
                      : 'In Stock'}
                  </Badge>
                </td>
                <td>{item.reorderLimit}</td>
                <td>{item.lastUpdated}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleRestock(item)}
                    className="me-1"
                  >
                    <Add /> Restock
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleReport(item)}
                    className="me-1"
                  >
                    <Report /> Report
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

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

      <Modal show={showRestockModal} onHide={() => setShowRestockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restock Item: {restockItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="restockQuantity">
              <Form.Label>Quantity to Restock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                min="1"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRestockModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmRestock}>
            Confirm Restock
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RDashboard;