const BASE_URL = 'http://localhost:8080'; // Root URL for the backend

interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Backend returns Role as string (e.g., "REGULAR")
  profileImageUrl?: string;
  assignedTypes?: { id: number; name: string }[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Regular' | 'Manager';
  profilePicture?: string;
  assignedProductTypes?: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  updatedAt?: string;
  productType: { id: string; name: string };
}

export interface ProductType {
  id: string;
  name: string;
}

interface ProductResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  updatedAt?: string;
  productType: {
    id: number;
    name: string;
  };
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  itemTotal: number;
}

export interface DashboardMetrics {
  totalInventory: number;
  productTypes: number;
  totalSales: number;
  totalInventoryValue: number;
  productTypeDistribution: { [key: string]: number };
  stockCountDistribution: { [key: string]: number };
  topSellingItems: { itemName: string; soldCount: number }[];
}

// Employee Endpoints
export const getEmployees = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to view employees');
    }
    throw new Error(`Failed to fetch employees: ${response.statusText} Please contact Tech Support`);
  }

  const employees: EmployeeResponse[] = await response.json();
  return employees.map((emp) => ({
    id: emp.id.toString(),
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
    profilePicture: emp.profileImageUrl,
    assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
  }));
};

export const createEmployee = async (employee: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Regular' | 'Manager';
  profileImageUrl?: string;
  assignedTypes?: string[];
}): Promise<User> => {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: employee.password,
      role: employee.role === 'Regular' ? 'REGULAR' : 'MANAGER',
      profileImageUrl: employee.profileImageUrl || null,
      assignedTypes: employee.assignedTypes?.map((name) => ({ name })) || [],
    }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to create employees');
    }
    throw new Error(`Failed to create employee: ${response.statusText} Please contact Tech Support`);
  }

  const emp: EmployeeResponse = await response.json();
  return {
    id: emp.id.toString(),
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
    profilePicture: emp.profileImageUrl,
    assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
  };
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to delete employees');
    }
    throw new Error(`Failed to delete employee: ${response.statusText} Please contact Tech Support`);
  }
};

export const getEmployeeById = async (id: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    if (response.status === 403) {
      throw new Error('You do not have permission to view this employee');
    }
    if (response.status === 404) {
      throw new Error('Employee not found');
    }
    throw new Error(`Failed to fetch employee: ${response.statusText} Please contact Tech Support`);
  }

  const emp: EmployeeResponse = await response.json();
  return {
    id: emp.id.toString(),
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
    profilePicture: emp.profileImageUrl,
    assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
  };
};

export const updateEmployee = async (
  id: string,
  employee: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'Regular' | 'Manager';
    profileImageUrl?: string;
    assignedProductTypes?: string[];
  }
): Promise<User> => {
  const response = await fetch(`${BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: employee.password || null,
      role: employee.role === 'Regular' ? 'REGULAR' : 'MANAGER',
      profileImageUrl: employee.profileImageUrl || null,
      assignedTypes: employee.assignedProductTypes?.map((name) => ({ name })) || [],
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    if (response.status === 403) {
      throw new Error('You do not have permission to update this employee');
    }
    if (response.status === 404) {
      throw new Error('Employee not found');
    }
    throw new Error(`Failed to update employee: ${response.statusText} Please contact Tech Support`);
  }

  const emp: EmployeeResponse = await response.json();
  return {
    id: emp.id.toString(),
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
    profilePicture: emp.profileImageUrl,
    assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
  };
};

// Product Endpoints
export const getProducts = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'id'
): Promise<{ products: Product[]; totalPages: number }> => {
  try {
    // Split sortBy into field and direction
    const [sortField, sortDirection] = sortBy.split(',');
    const sortParam = `${sortField},${sortDirection || 'asc'}`;

    console.log(`Fetching products from: ${BASE_URL}/products?page=${page}&size=${size}&sort=${sortParam}`);

    const response = await fetch(`${BASE_URL}/products?page=${page}&size=${size}&sort=${sortParam}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Added
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data: PageResponse<ProductResponse> = await response.json();
    console.log('Successfully fetched products:', data.content.length);

    return {
      products: data.content.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        quantity: p.quantity,
        price: Number(p.price),
        updatedAt: p.updatedAt,
        productType: { id: p.productType.id.toString(), name: p.productType.name },
      })),
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
};

export const createProduct = async (product: {
  name: string;
  description: string;
  quantity: number;
  price: number;
  productTypeId: string;
}): Promise<Product> => {
  try {
    console.log('Creating product:', product);

    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        productType: { id: product.productTypeId },
      }),
    });

    console.log('Create product response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create product: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const p = await response.json();
    console.log('Successfully created product:', p);

    return {
      id: p.id.toString(),
      name: p.name,
      description: p.description,
      quantity: p.quantity,
      price: Number(p.price),
      updatedAt: p.updatedAt, // Added
      productType: { id: p.productType.id.toString(), name: p.productType.name },
    };
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  product: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    productTypeId: string;
  }
): Promise<Product> => {
  try {
    console.log('Updating product:', { id, ...product });

    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        productType: { id: product.productTypeId },
      }),
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to update product: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const p = await response.json();
    console.log('Successfully updated product:', p);

    return {
      id: p.id.toString(),
      name: p.name,
      description: p.description,
      quantity: p.quantity,
      price: Number(p.price),
      updatedAt: p.updatedAt, // Added
      productType: { id: p.productType.id.toString(), name: p.productType.name },
    };
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText} Please contact Tech Support`);
  }
};


export async function getProductById(id: string) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/products/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return await response.json();
}

// Product Type Endpoints
export const getProductTypes = async (): Promise<ProductType[]> => {
  const response = await fetch(`${BASE_URL}/product-types`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`, // Added
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(`Failed to fetch product types: ${response.statusText} Please contact Tech Support`);
  }

  const productTypes: { id: number; name: string }[] = await response.json();
  return productTypes.map((type) => ({
    id: type.id.toString(),
    name: type.name,
  }));
};

export const createProductType = async (name: string): Promise<ProductType> => {
  try {
    console.log('Creating product type:', name);

    const response = await fetch(`${BASE_URL}/product-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ name }),
    });

    console.log('Create product type response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to create product type: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const t = await response.json();
    console.log('Successfully created product type:', t);

    return {
      id: t.id.toString(),
      name: t.name,
    };
  } catch (error) {
    console.error('Error in createProductType:', error);
    throw error;
  }
};

// Fetch all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching all products for orders');
    let allProducts: Product[] = [];
    let page = 0;
    let totalPages = 1;

    // Fetch all pages iteratively
    while (page < totalPages) {
      const response = await fetch(`${BASE_URL}/products?page=${page}&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data: PageResponse<ProductResponse> = await response.json();
      console.log('Fetched page:', page, 'Products:', data.content.length);

      allProducts = allProducts.concat(
        data.content.map((p) => ({
          id: p.id.toString(),
          name: p.name,
          description: p.description,
          quantity: p.quantity,
          price: Number(p.price),
          updatedAt: p.updatedAt,
          productType: { id: p.productType.id.toString(), name: p.productType.name },
        }))
      );
      totalPages = data.totalPages;
      page++;
    }

    console.log('Successfully fetched all products:', allProducts.length);
    return allProducts;
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw error;
  }
};

// Order Endpoints
export const getOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem('token');
    console.log('Fetching orders with token:', token ? 'Present' : 'Missing');

    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Orders response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Orders error response:', errorText);

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }

      if (response.status === 403) {
        console.error('Forbidden access. Token:', token);
        throw new Error('Access denied. You do not have permission to view orders.');
      }

      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const orders = await response.json();
    console.log('Successfully fetched orders:', orders);

    return orders.map((order: any) => ({
      id: order.id.toString(),
      customerName: order.customerName,
      items: order.items.map((item: any) => ({
        product: {
          id: item.product.id.toString(),
          name: item.product.name,
          description: item.product.description,
          quantity: item.product.quantity,
          price: Number(item.product.price),
          updatedAt: item.product.updatedAt,
          productType: {
            id: item.product.productType.id.toString(),
            name: item.product.productType.name,
          },
        },
        quantity: item.quantity,
        itemTotal: Number(item.itemTotal),
      })),
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt,
    }));
  } catch (error) {
    console.error('Error in getOrders:', error);
    throw error;
  }
};

export const createOrder = async (order: {
  customerName: string;
  items: { productId: string; quantity: number }[];
}): Promise<Order> => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create order: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const createdOrder = await response.json();
    return {
      id: createdOrder.id.toString(),
      customerName: createdOrder.customerName,
      items: createdOrder.items.map((item: any) => ({
        product: {
          id: item.product.id.toString(),
          name: item.product.name,
          description: item.product.description,
          quantity: item.product.quantity,
          price: Number(item.product.price),
          updatedAt: item.product.updatedAt,
          productType: {
            id: item.product.productType.id.toString(),
            name: item.product.productType.name,
          },
        },
        quantity: item.quantity,
        itemTotal: Number(item.itemTotal),
      })),
      totalPrice: Number(createdOrder.totalPrice),
      createdAt: createdOrder.createdAt,
    };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    console.log('Fetching dashboard metrics');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Using token:', token ? 'Token present' : 'No token found');

    const response = await fetch(`${BASE_URL}/dashboard/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching dashboard metrics:', errorText);
      throw new Error(`Failed to fetch dashboard metrics: ${response.status} ${response.statusText}`);
    }

    const metrics = await response.json();
    console.log('Successfully fetched dashboard metrics:', metrics);

    return {
      totalInventory: metrics.totalInventory,
      productTypes: metrics.productTypes,
      totalSales: metrics.totalSales,
      totalInventoryValue: Number(metrics.totalInventoryValue),
      productTypeDistribution: metrics.productTypeDistribution,
      stockCountDistribution: metrics.stockCountDistribution,
      topSellingItems: metrics.topSellingItems.map((item: any) => ({
        itemName: item.itemName,
        soldCount: item.soldCount,
      })),
    };
  } catch (error) {
    console.error('Error in getDashboardMetrics:', error);
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    console.log('Deleting order with token:', token ? 'Present' : 'Missing');

    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Delete order response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete order error response:', errorText);

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }

      if (response.status === 403) {
        console.error('Forbidden access. Token:', token);
        throw new Error('Access denied. You do not have permission to delete orders.');
      }

      throw new Error(`Failed to delete order: ${response.status} ${response.statusText}. ${errorText}`);
    }

    console.log('Successfully deleted order');
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    throw error;
  }
};


// added getCurrentEmployee
export const getCurrentEmployee = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/employees/me`, { // Line ~763
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`Failed to fetch employee: ${errorText}`);
    }
    const data = await response.json();
    return {
      id: data.id.toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      profilePicture: data.profileImageUrl,
      assignedProductTypes: data.assignedTypes?.map((type: any) => type.name) || [],
    };
  } catch (error) {
    console.error('Error in getCurrentEmployee:', error);
    throw error;
  }
};


export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  postedBy: {
    id: string;
    email: string;
  };
}




export const reportProduct = async (id: string, reason: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/products/${id}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to report product: ${errorText}`);
    }
  } catch (error) {
    console.error('Error reporting product:', error);
    throw error;
  }
};

{/** 
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/announcements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to view announcements');
      }
      throw new Error(`Failed to fetch announcements: ${errorText}`);
    }
    const data = await response.json();
    return data.map((ann: any) => ({
      id: ann.id.toString(),
      title: ann.title,
      content: ann.content,
      createdAt: ann.createdAt,
      postedBy: {
        id: ann.postedBy.id.toString(),
        email: ann.postedBy.email,
      },
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};
*/}

// Get unread announcements
export const getUnreadAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/announcements/unread`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to view unread announcements');
      }
      throw new Error(`Failed to fetch unread announcements: ${errorText}`);
    }
    const data = await response.json();
    return data.map((ann: any) => ({
      id: ann.id.toString(),
      title: ann.title,
      content: ann.content,
      createdAt: ann.createdAt,
      postedBy: {
        id: ann.postedBy.id.toString(),
        email: ann.postedBy.email,
      },
    }));
  } catch (error) {
    console.error('Error fetching unread announcements:', error);
    throw error;
  }
};

// Get unread announcement count
export const getUnreadAnnouncementCount = async (): Promise<number> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/announcements/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      if (response.status === 403) {
        throw new Error('You do not have permission to view unread count');
      }
      throw new Error(`Failed to fetch unread count: ${errorText}`);
    }
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching unread announcement count:', error);
    throw error;
  }
};

// Mark announcement as read
export const markAnnouncementAsRead = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }
    const response = await fetch(`${BASE_URL}/announcements/${id}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('role');
        sessionStorage.removeItem('role');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      if (response.status === 404) {
        throw new Error('Announcement not found');
      }
      throw new Error(`Failed to mark announcement as read: ${errorText}`);
    }
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    throw error;
  }
};












export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await fetch(`${BASE_URL}/announcements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch announcements: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return data.map((ann: any) => ({
      id: ann.id.toString(),
      title: ann.title,
      content: ann.content,
      createdAt: ann.createdAt,
      postedBy: {
        id: ann.postedBy.id.toString(),
        email: ann.postedBy.email,
      },
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    throw error;
  }
};

// Create announcement (no auth)
export const createAnnouncement = async (announcement: {
  title: string;
  content: string;
}): Promise<Announcement> => {
  try {
    const response = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(announcement),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create announcement: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      postedBy: {
        id: data.postedBy.id.toString(),
        email: data.postedBy.email,
      },
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Get announcement by ID (no auth)
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
  try {
    const response = await fetch(`${BASE_URL}/announcements/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch announcement: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return {
      id: data.id.toString(),
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
      postedBy: {
        id: data.postedBy.id.toString(),
        email: data.postedBy.email,
      },
    };
  } catch (error) {
    console.error('Error fetching announcement:', error);
    throw error;
  }
};


export interface Invoice {
  id: string;
  orderId: string;
  customerName: string;
  totalAmount: number;
  date: string;
}

export interface InvoiceDetails extends Invoice {
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const getInvoices = async (page: number, size: number): Promise<{ content: Invoice[], totalPages: number, totalElements: number }> => {
  const response = await fetch(`${BASE_URL}/invoices?page=${page}&size=${size}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch invoices');
  }
  const data = await response.json();
  console.log('Fetched invoices:', data);
  return {
    content: data.content.map((inv: any) => ({
      id: inv.id.toString(),
      orderId: inv.orderId.toString(),
      customerName: inv.customerName,
      totalAmount: parseFloat(inv.totalAmount),
      date: inv.date,
    })),
    totalPages: data.totalPages,
    totalElements: data.totalElements,
  };
};

export const getInvoice = async (id: string): Promise<InvoiceDetails> => {
  const response = await fetch(`${BASE_URL}/invoices/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch invoice');
  }
  const data = await response.json();
  console.log('Fetched invoice details:', data);
  return {
    id: data.id.toString(),
    orderId: data.orderId.toString(),
    customerName: data.customerName,
    totalAmount: parseFloat(data.totalAmount),
    date: data.date,
    items: data.items.map((item: any) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice),
      totalPrice: parseFloat(item.totalPrice),
    })),
  };
};

export const createInvoice = async (data: { customerName: string, totalAmount: number, date: string }): Promise<Invoice> => {
  const response = await fetch(`${BASE_URL}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Session expired' : 'Failed to create invoice');
  }
  const result = await response.json();
  console.log('Created invoice:', result);
  return {
    id: result.id.toString(),
    orderId: result.orderId.toString(),
    customerName: result.customerName,
    totalAmount: parseFloat(result.totalAmount),
    date: result.date,
  };
};

export const deleteInvoice = async (id: string): Promise<void> => {
  console.log('Deleting invoice ID:', id); // Debug
  const response = await fetch(`${BASE_URL}/invoices/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }
  console.log('Deleted invoice:', id);
};

export const getBusinessInfo = async (): Promise<BusinessInfo> => {
  // Fallback to static data if endpoint unavailable
  return {
    name: 'XYZ Corp',
    address: '1234 Business Rd, Suite 100',
    phone: '(123) 456-7890',
    email: 'contact@xyzcorp.com',
  };
  // Uncomment if endpoint exists:
  /*
  const response = await fetch(`${BASE_URL}/business-info`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'Session expired' : 'Failed to fetch business info');
  }
  return await response.json();
  */
};