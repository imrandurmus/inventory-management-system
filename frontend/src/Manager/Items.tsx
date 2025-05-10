import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import { Edit, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Header from "../DashComponents/Header";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductTypes,
  createProductType,
  Product,
  ProductType,
} from "../../services/api";
import "../CSS/Items.css";

const Items: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [stockFilter, setStockFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    productTypeId: "",
  });

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newProductType, setNewProductType] = useState("");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  // Fetch products and product types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { products: fetchedProducts, totalPages: pages } =
          await getProducts(
            currentPage - 1,
            itemsPerPage,
            `${sortColumn},${sortOrder}`
          );
        setProducts(fetchedProducts);
        setTotalPages(pages);

        const types = await getProductTypes();
        setProductTypes(types);
      } catch (err: any) {
        alert(err.message || "Failed to load data");
      }
    };
    fetchData();
  }, [currentPage, sortColumn, sortOrder]);

  const handleSort = (column: string) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortColumn(column);
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((product) =>
      typeFilter !== "All" ? product.productType.name === typeFilter : true
    )
    .filter((product) => {
      if (stockFilter === "In Stock") return product.quantity > 0;
      if (stockFilter === "Low Stock")
        return product.quantity > 0 && product.quantity <= 10;
      if (stockFilter === "Out of Stock") return product.quantity === 0;
      return true;
    });

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormValues({
      name: "",
      description: "",
      price: "",
      quantity: "",
      productTypeId: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      productTypeId: product.productType.id,
    });
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const handleFormSubmit = async () => {
    const price = parseFloat(formValues.price);
    const quantity = parseInt(formValues.quantity);

    if (
      !formValues.name ||
      !formValues.description ||
      !formValues.productTypeId
    ) {
      alert("Name, description, and product type are required");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price greater than 0");
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      alert("Please enter a valid quantity greater than or equal to 0");
      return;
    }

    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct.id, {
          name: formValues.name,
          description: formValues.description,
          price,
          quantity,
          productTypeId: formValues.productTypeId,
        });
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
      } else {
        const newProduct = await createProduct({
          name: formValues.name,
          description: formValues.description,
          price,
          quantity,
          productTypeId: formValues.productTypeId,
        });
        setProducts([...products, newProduct]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    }
  };

  const handleAddProductType = async () => {
    const trimmed = newProductType.trim();
    if (!trimmed) {
      alert("Please enter a product type name");
      return;
    }
    try {
      const newType = await createProductType(trimmed);
      setProductTypes([...productTypes, newType]);
      setNewProductType("");
      setShowTypeModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to add product type");
    }
    if (
      productTypes.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      alert("Product type already exists");
      return;
    }
  };

  return (
    <>
      <Header />
      <div className="Items-background">
        <Container>
          <h2 className="ProductManagemnetTitle">{t("Mproducts.Product Management")}</h2>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder= {t("Mproducts.Search products...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Button variant="primary" onClick={openAddModal}>
                {t("Mproducts.Add New Product")}
              </Button>{" "}
              <Button
                className="NewProductTypeButton"
                variant="secondary"
                onClick={() => setShowTypeModal(true)}
              >
                {t("Mproducts.Add Product Type")}
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value= {t("Mproducts.All")} >{t("Mproducts.All Types")}</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                {stockStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("Mproducts.Type")}</th>
                <th onClick={() => handleSort("id")}>{t("Mproducts.Product ID")}</th>
                <th onClick={() => handleSort("name")}>{t("Mproducts.Product Name")}</th>
                <th onClick={() => handleSort("quantity")}>
                  {t("Mproducts.Quantity")}{" "}
                  <span style={{ fontSize: "0.8rem" }}>
                    <span
                      style={{
                        color:
                          sortColumn === "quantity" && sortOrder === "asc"
                            ? "#007bff"
                            : "#ccc",
                      }}
                    >
                      ↑
                    </span>
                    <span
                      style={{
                        color:
                          sortColumn === "quantity" && sortOrder === "desc"
                            ? "#007bff"
                            : "#ccc",
                      }}
                    >
                      ↓
                    </span>
                  </span>
                </th>
                <th onClick={() => handleSort("price")}>
                  {t("Mproducts.Price")}{" "}
                  <span style={{ fontSize: "0.8rem" }}>
                    <span
                      style={{
                        color:
                          sortColumn === "price" && sortOrder === "asc"
                            ? "#007bff"
                            : "#ccc",
                      }}
                    >
                      ↑
                    </span>
                    <span
                      style={{
                        color:
                          sortColumn === "price" && sortOrder === "desc"
                            ? "#007bff"
                            : "#ccc",
                      }}
                    >
                      ↓
                    </span>
                  </span>
                </th>
                <th>{t("Mproducts.Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.productType.name}</td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit />
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
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
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>

          {/* Add/Edit Product Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.Product Name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.Description")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formValues.description}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.Price")}</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formValues.price}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.Quantity")}</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="0"
                    value={formValues.quantity}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.Type")}</Form.Label>
                  <Form.Select
                    name="productTypeId"
                    value={formValues.productTypeId}
                    onChange={handleFormChange}
                  >
                    <option value="">{t("Mproducts.Select Type")}</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                {t("Mproducts.Cancel")}
              </Button>
              <Button variant="primary" onClick={handleFormSubmit}>
                {editingProduct ? [t("Mproducts.Save Changes")] : [t("Mproducts.Add Product")] }
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Add Product Type Modal */}
          <Modal show={showTypeModal} onHide={() => setShowTypeModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{t("Mproducts.Add Product Type")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Mproducts.New Product Type")}</Form.Label>
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
              <Button
                variant="secondary"
                onClick={() => setShowTypeModal(false)}
              >
                {t("Mproducts.Cancel")}
              </Button>
              <Button variant="primary" onClick={handleAddProductType}>
                {t("Mproducts.Add Type")}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
};

export default Items;
