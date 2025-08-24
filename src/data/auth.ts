export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'writer' | 'viewer';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// In-memory storage for users
let users: User[] = [];
let currentUser: User | null = null;

// Initialize with default admin user if no users exist
const initializeUsers = () => {
  const stored = localStorage.getItem('users');
  if (stored) {
    users = JSON.parse(stored);
  } else {
    // Create default admin user
    const defaultAdmin: User = {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    users = [defaultAdmin];
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Check for existing session
  const session = localStorage.getItem('currentUser');
  if (session) {
    currentUser = JSON.parse(session);
  }
};

// Save users to localStorage
const saveUsers = () => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Save current user session
const saveSession = () => {
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Initialize on module load
initializeUsers();

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Simple password encoding (for demo purposes - use proper hashing in production)
const encodePassword = (password: string): string => {
  return btoa(password + '_salt');
};

// Login function
export const login = async (credentials: { username: string; password: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // For demo purposes, hardcode the admin password
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const user = users.find(u => u.username === 'admin');
      if (user && user.isActive) {
        currentUser = user;
        user.lastLogin = new Date().toISOString();
        saveUsers();
        saveSession();
        
        if (localStorage.getItem('debug_auth') === 'true') {
          console.log('User logged in:', user);
        }
        
        return { success: true, user };
      }
    }
    
    // Check other users (with encoded passwords)
    const user = users.find(u => 
      u.username === credentials.username && 
      u.isActive &&
      encodePassword(credentials.password) === u.password
    );
    
    if (user) {
      currentUser = user;
      user.lastLogin = new Date().toISOString();
      saveUsers();
      saveSession();
      
      if (localStorage.getItem('debug_auth') === 'true') {
        console.log('User logged in:', user);
      }
      
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid username or password' };
  } catch (error) {
    return { success: false, error: 'Login failed. Please try again.' };
  }
};

// Logout function
export const logout = (): void => {
  currentUser = null;
  saveSession();
  
  if (localStorage.getItem('debug_auth') === 'true') {
    console.log('User logged out');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Add new user
export const addUser = (userData: Omit<User, 'id' | 'createdAt'>, password: string): User | null => {
  // Check if username already exists
  if (users.some(u => u.username === userData.username)) {
    return null;
  }
  
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    password: encodePassword(password), // Store encoded password
  } as User & { password: string };
  
  users.push(newUser as User);
  saveUsers();
  
  if (localStorage.getItem('debug_auth') === 'true') {
    console.log('User added:', newUser);
  }
  
  return newUser;
};

// Update user
export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...updates,
  };
  
  saveUsers();
  
  if (localStorage.getItem('debug_auth') === 'true') {
    console.log('User updated:', users[index]);
  }
  
  return users[index];
};

// Delete user
export const deleteUser = (id: string): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return false;
  
  // Prevent deleting the last admin user
  if (users[index].role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
    return false;
  }
  
  users.splice(index, 1);
  saveUsers();
  
  if (localStorage.getItem('debug_auth') === 'true') {
    console.log('User deleted:', id);
  }
  
  return true;
};

// Get all users
export const getAllUsers = (): User[] => {
  return [...users];
};

// Permission functions
export const canPublishArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const canDeleteArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const canManageUsers = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

export const canCreateArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'writer';
};

export const canEditArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'writer';
};

// Check if user has specific role
export const hasRole = (role: User['role']): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles: User['role'][]): boolean => {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
};

// Check if user can access article management
export const canAccessArticleManagement = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'writer';
};
