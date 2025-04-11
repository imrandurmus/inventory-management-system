const API_URL = 'http://localhost:8080/employees';

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



  
export const getEmployees = async (): Promise<User[]> => {
  const response = await fetch(API_URL, {
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
    throw new Error(`Failed to fetch employees: ${response.statusText}`);
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
  const response = await fetch(API_URL, {
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
      profileImageUrl: employee.profileImageUrl || null, // Let backend set default
      // assignedTypes requires ProductType objects; adjust if backend expects IDs
      assignedTypes: employee.assignedTypes?.map((name) => ({ name })) || [],
    }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to create employees');
    }
    throw new Error(`Failed to create employee: ${response.statusText}`);
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
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to delete employees');
    }
    throw new Error(`Failed to delete employee: ${response.statusText}`);
  }
};

export const getProductTypes = async (): Promise<string[]> => {
    const response = await fetch('http://localhost:8080/product-types', {
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
      throw new Error(`Failed to fetch product types: ${response.statusText}`);
    }
  
    const productTypes: { id: number; name: string }[] = await response.json();
    return productTypes.map((type) => type.name);
  };


  export const getEmployeeById = async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`, {
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
      throw new Error(`Failed to fetch employee: ${response.statusText}`);
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
    const response = await fetch(`${API_URL}/${id}`, {
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
      throw new Error(`Failed to update employee: ${response.statusText}`);
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