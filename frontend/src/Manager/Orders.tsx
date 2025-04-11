import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Toast,
  Pagination,
} from "react-bootstrap";
import { Delete } from "@mui/icons-material";
import Header from "../DashComponents/Header";
import "../CSS/Orders.css";
import {
  getAllProducts,
  Product,
  getOrders,
  createOrder,
  Order,
  deleteOrder,
} from "../../services/api";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [sortByProduct, setSortByProduct] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    products: [] as { product: string; quantity: number }[],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products and orders on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching products and orders...");
        const [fetchedProducts, fetchedOrders] = await Promise.all([
          getAllProducts(),
          getOrders(),
        ]);
        console.log("Fetched products:", fetchedProducts);
        console.log("Fetched orders:", fetchedOrders);
        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        setToastVariant("danger");
        setToastMessage(
          `Failed to load data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setShowToast(true);
      }
    };
    fetchData();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewOrder({
      customerName: "",
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
        p.product === product
          ? { ...p, quantity: quantity >= 1 ? quantity : 1 }
          : p
      );
      return { ...prev, products: updatedProducts };
    });
  };

  // Update the product catalog to use real products
  const productCatalog = products.reduce((acc, product) => {
    const type = product.productType.name;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ name: product.name, price: product.price });
    return acc;
  }, {} as Record<string, { name: string; price: number }[]>);

  // Fix the calculateTotalPrice function
  const calculateTotalPrice = () => {
    return newOrder.products.reduce((total, { product, quantity }) => {
      // Find the product in our catalog
      for (const category of Object.values(productCatalog)) {
        const productDetails = category.find((p) => p.name === product);
        if (productDetails) {
          return total + productDetails.price * quantity;
        }
      }
      return total;
    }, 0);
  };

  const handleSaveOrder = async () => {
    if (!newOrder.customerName || newOrder.products.length === 0) {
      setToastVariant("danger");
      setToastMessage(
        "Please fill in customer name and select at least one product."
      );
      setShowToast(true);
      return;
    }

    try {
      // Find product IDs for the selected products
      const orderItems = newOrder.products.map((item) => {
        const product = products.find((p) => p.name === item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        return {
          productId: product.id,
          quantity: item.quantity,
        };
      });

      // Create the order
      const createdOrder = await createOrder({
        customerName: newOrder.customerName,
        items: orderItems,
      });

      // Update the orders list
      setOrders([createdOrder, ...orders]);
      setToastVariant("success");
      setToastMessage("Order created successfully!");
      setShowToast(true);
      handleCloseModal();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error creating order:", error);
      setToastVariant("danger");
      setToastMessage("Failed to create order. Please try again.");
      setShowToast(true);
    }
  };

  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete);
        setOrders(orders.filter((order) => order.id !== orderToDelete));
        setToastVariant("success");
        setToastMessage("Order deleted successfully!");
        setShowToast(true);
      } catch (error) {
        console.error("Error deleting order:", error);
        setToastVariant("danger");
        setToastMessage("Failed to delete order. Please try again.");
        setShowToast(true);
      }
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
      setCurrentPage(1);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  // Filter and sort logic
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(search.toLowerCase())
        ) ||
        order.id.toString().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortByProduct === "asc") {
        return a.items[0].product.name.localeCompare(b.items[0].product.name);
      } else if (sortByProduct === "desc") {
        return b.items[0].product.name.localeCompare(a.items[0].product.name);
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
  }

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
                <th>Products</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.product.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
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
            <Row className="mt-3">
              <Col>
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                  {paginationItems}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customerName: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Products</Form.Label>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "10px",
                  }}
                >
                  {Object.entries(productCatalog).map(
                    ([category, categoryProducts]) => (
                      <div key={category} className="mb-3">
                        <h6>{category}</h6>
                        {categoryProducts.map((product) => (
                          <Row
                            key={product.name}
                            className="mb-2 align-items-center"
                          >
                            <Col xs={6}>
                              <Form.Check
                                type="checkbox"
                                label={`${
                                  product.name
                                } ($${product.price.toFixed(2)})`}
                                checked={newOrder.products.some(
                                  (p) => p.product === product.name
                                )}
                                onChange={(e) =>
                                  handleProductChange(
                                    product.name,
                                    e.target.checked
                                  )
                                }
                              />
                            </Col>
                            <Col xs={6}>
                              {newOrder.products.some(
                                (p) => p.product === product.name
                              ) && (
                                <Form.Control
                                  type="number"
                                  min={1}
                                  value={
                                    newOrder.products.find(
                                      (p) => p.product === product.name
                                    )?.quantity || 1
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      product.name,
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              )}
                            </Col>
                          </Row>
                        ))}
                      </div>
                    )
                  )}
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

          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteConfirm} onHide={cancelDelete}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete this order? This action cannot
                be undone.
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

          {/* Toast notification */}
          <div
            style={{
              position: "fixed",
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
