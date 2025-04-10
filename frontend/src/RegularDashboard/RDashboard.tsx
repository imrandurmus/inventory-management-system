import React, { useState } from 'react';
import { Container, Table, Button, Row, Col, Form, Modal, Badge, Pagination, Card } from 'react-bootstrap';
import { Add, Report, Info } from '@mui/icons-material';
import '../CSS/RDashboard.css';

// Mock Employee Data (in a real app, this would come from an API or context)
interface Employee {
  id: number;
  name: string;
  assignedItemTypes: string[];
}

const employee: Employee = {
  id: 1,
  name: 'Alex Johnson',
  assignedItemTypes: ['Electronics', 'Furniture'],
};

// Mock Inventory Data
interface InventoryItem {
  id: string;
  name: string;
  itemType: string;
  quantityInStock: number;
  location: string;
  reorderLimit: number;
  lastUpdated: string;
}

const initialInventory: InventoryItem[] = [
  { id: 'E001', name: 'Laptop', itemType: 'Electronics', quantityInStock: 20, location: 'Warehouse A', reorderLimit: 10, lastUpdated: '2025-04-08' },
  { id: 'E002', name: 'Monitor', itemType: 'Electronics', quantityInStock: 8, location: 'Warehouse B', reorderLimit: 10, lastUpdated: '2025-04-07' },
  { id: 'F001', name: 'Desk', itemType: 'Furniture', quantityInStock: 3, location: 'Warehouse A', reorderLimit: 5, lastUpdated: '2025-04-06' },
  { id: 'F002', name: 'Chair', itemType: 'Furniture', quantityInStock: 15, location: 'Warehouse B', reorderLimit: 5, lastUpdated: '2025-04-05' },
  { id: 'E003', name: 'Keyboard', itemType: 'Electronics', quantityInStock: 12, location: 'Warehouse A', reorderLimit: 8, lastUpdated: '2025-04-04' },
  { id: 'F003', name: 'Bookshelf', itemType: 'Furniture', quantityInStock: 2, location: 'Warehouse B', reorderLimit: 3, lastUpdated: '2025-04-03' },
];

const RDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<string>(''); // Filter by stock status
  const [sortQuantityOrder, setSortQuantityOrder] = useState<'asc' | 'desc' | null>(null); // Sorting state for Quantity
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState<string>('');

  // Filter inventory by assigned item types
  let filteredInventory = inventory.filter((item) =>
    employee.assignedItemTypes.includes(item.itemType)
  );

  // Apply search and stock filter
  filteredInventory = filteredInventory.filter(
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

  // Sort by Quantity in Stock
  if (sortQuantityOrder) {
    filteredInventory.sort((a, b) => {
      if (sortQuantityOrder === 'asc') {
        return a.quantityInStock - b.quantityInStock;
      } else {
        return b.quantityInStock - a.quantityInStock;
      }
    });
  }

  // Pagination logic
  const totalItems = filteredInventory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventory = filteredInventory.slice(startIndex, endIndex);

  // Calculate KPIs
  const totalStock = filteredInventory.reduce((sum, item) => sum + item.quantityInStock, 0);
  const lowStockItems = filteredInventory.filter(
    (item) => item.quantityInStock <= item.reorderLimit
  ).length;
  const totalStockValue = filteredInventory.reduce(
    (sum, item) => sum + item.quantityInStock * 100, // Assuming $100 per unit for simplicity
    0
  );

  // Handle sorting by Quantity
  const handleSortQuantity = () => {
    const newOrder = sortQuantityOrder === 'asc' ? 'desc' : 'asc';
    setSortQuantityOrder(newOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle restocking
  const handleRestock = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  const confirmRestock = () => {
    if (restockItem && restockQuantity) {
      const quantity = parseInt(restockQuantity);
      if (quantity <= 0 || isNaN(quantity)) {
        alert('Please enter a valid positive quantity.');
        return;
      }
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.id === restockItem.id
            ? { ...item, quantityInStock: item.quantityInStock + quantity, lastUpdated: new Date().toISOString().split('T')[0] }
            : item
        )
      );
      setShowRestockModal(false);
      setRestockItem(null);
      setRestockQuantity('');
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const headers = ['Item ID,Name,Item Type,Quantity in Stock,Location,Reorder Limit,Last Updated'];
    const rows = filteredInventory.map((item) =>
      `${item.id},${item.name},${item.itemType},${item.quantityInStock},${item.location},${item.reorderLimit},${item.lastUpdated}`
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `inventory_${employee.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="Rdashboard-background">
        <Container>
          <h2 className="my-4">Employee Dashboard - {employee.name}</h2>
          <p><strong>Assigned Item Types:</strong> {employee.assignedItemTypes.join(', ')}</p>

          {/* KPI Summary */}
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

          {/* Inventory List */}
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
              <Button variant="primary" onClick={handleExportCSV} className="float-right">
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
                  Quantity in Stock {sortQuantityOrder === 'asc' ? '↑' : sortQuantityOrder === 'desc' ? '↓' : ''}
                </th>
                <th>Location</th>
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
                  <td>{item.location}</td>
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
                    <Button variant="warning" size="sm" className="me-1">
                      <Report /> Report
                    </Button>
                    <Button variant="info" size="sm">
                      <Info /> Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </Container>
      </div>

      {/* Restock Modal */}
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
          <Button variant="secondary" onClick={() => setShowRestockModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmRestock}>
            Confirm Restock
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RDashboard;