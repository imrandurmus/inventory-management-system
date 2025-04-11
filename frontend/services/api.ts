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
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Fetching employees with token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Employees response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Employees error response:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (response.status === 403) {
        console.error('Forbidden access. Token:', token);
        throw new Error('Access denied. You do not have permission to view employees.');
      }
      
      throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const employees = await response.json();
    console.log('Successfully fetched employees:', employees);
    
    return employees.map((emp: EmployeeResponse) => ({
      id: emp.id.toString(),
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
      profilePicture: emp.profileImageUrl,
      assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
    }));
  } catch (error) {
    console.error('Error in getEmployees:', error);
    throw error;
  }
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
    },
  });

        console.log('Response status:', response.status);

  if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
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
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText} Please contact Tech Support`);
  }
};

// Product Type Endpoints
export const getProductTypes = async (): Promise<ProductType[]> => {
  const response = await fetch(`${BASE_URL}/product-types`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
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
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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

// Add this function to fetch all products
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        console.log('Fetching all products for orders');
        const response = await fetch(`${BASE_URL}/products?size=1000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const data: PageResponse<ProductResponse> = await response.json();
        console.log('Successfully fetched products:', data.content.length);
        
        return data.content.map((p) => ({
            id: p.id.toString(),
            name: p.name,
            description: p.description,
            quantity: p.quantity,
            price: Number(p.price),
            productType: { id: p.productType.id.toString(), name: p.productType.name },
        }));
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        throw error;
    }
};

// Order Endpoints
export const getOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Fetching orders with token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Orders response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Orders error response:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
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
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Fetching dashboard metrics with token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/dashboard/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Dashboard metrics response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dashboard metrics error response:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (response.status === 403) {
        console.error('Forbidden access. Token:', token);
        throw new Error('Access denied. You do not have permission to view dashboard metrics.');
      }
      
      throw new Error(`Failed to fetch dashboard metrics: ${response.status} ${response.statusText}. ${errorText}`);
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
        soldCount: item.soldCount
      }))
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
        'Authorization': `Bearer ${token}`,
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

export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Fetching current user with token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Current user response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Current user error response:', errorText);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const emp: EmployeeResponse = await response.json();
    console.log('Successfully fetched current user:', emp);
    
    return {
      id: emp.id.toString(),
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      role: emp.role === 'REGULAR' ? 'Regular' : 'Manager',
      profilePicture: emp.profileImageUrl,
      assignedProductTypes: emp.assignedTypes?.map((type) => type.name) || [],
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};