import { supabase } from '../lib/articles-api';

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
  email: string;
  password: string;
}

// Supabase user management
let currentUser: User | null = null;

// Initialize user from Supabase session
const initializeFromSession = async () => {
  try {
    console.log('🔍 Initializing from session...');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('🔍 Session check:', { hasSession: !!session, error });
    
    if (session?.user && !error) {
      // Convert Supabase user to our User format
      currentUser = {
        id: session.user.id,
        username: session.user.user_metadata?.username === 'Admin' ? 'Dhruba' : (session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Dhruba'),
        email: session.user.email || '',
        role: session.user.user_metadata?.role || 'writer',
        isActive: true,
        createdAt: session.user.created_at,
        lastLogin: session.user.last_sign_in_at
      };
      console.log('✅ User initialized from session:', currentUser);
    } else {
      console.log('❌ No valid session found');
    }
  } catch (error) {
    console.error('Failed to initialize from session:', error);
  }
};

// Initialize on module load
initializeFromSession();

// Login function using Supabase
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    console.log('🔐 Attempting Supabase login with:', credentials.email);
    console.log('🔐 Credentials object:', credentials);
    
    if (!credentials.email || !credentials.password) {
      console.error('❌ Missing credentials:', { email: !!credentials.email, password: !!credentials.password });
      return { success: false, error: 'Email and password are required' };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    console.log('🔐 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Supabase login error:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Convert Supabase user to our User format
      currentUser = {
        id: data.user.id,
        username: data.user.user_metadata?.username === 'Admin' ? 'Dhruba' : (data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'Dhruba'),
        email: data.user.email || '',
        role: data.user.user_metadata?.role || 'writer',
        isActive: true,
        createdAt: data.user.created_at,
        lastLogin: data.user.last_sign_in_at
      };

      console.log('✅ Login successful:', currentUser);
      console.log('✅ Current user set to:', currentUser);
      return { success: true, user: currentUser };
    }

    console.log('❌ No user data in response');
    return { success: false, error: 'Login failed. No user data received.' };
  } catch (error) {
    console.error('❌ Unexpected login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
};

// Logout function using Supabase
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    currentUser = null;
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      // Update current user if needed
      if (!currentUser || currentUser.id !== user.id) {
        currentUser = {
          id: user.id,
          username: user.user_metadata?.username === 'Admin' ? 'Dhruba' : (user.user_metadata?.username || user.email?.split('@')[0] || 'Dhruba'),
          email: user.email || '',
          role: user.user_metadata?.role || 'writer',
          isActive: true,
          createdAt: user.created_at,
          lastLogin: user.last_sign_in_at
        };
      }
      return true;
    }
    currentUser = null;
    return false;
  } catch (error) {
    console.error('Auth check failed:', error);
    currentUser = null;
    return false;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Force refresh current user from Supabase
export const refreshCurrentUser = async (): Promise<void> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      currentUser = {
        id: user.id,
        username: user.user_metadata?.username === 'Admin' ? 'Dhruba' : (user.user_metadata?.username || user.email?.split('@')[0] || 'Dhruba'),
        email: user.email || '',
        role: user.user_metadata?.role || 'writer',
        isActive: true,
        createdAt: user.created_at,
        lastLogin: user.last_sign_in_at
      };
      console.log('✅ Current user refreshed:', currentUser);
    }
  } catch (error) {
    console.error('Failed to refresh current user:', error);
  }
};

// Get Supabase user for storage operations
export const getSupabaseUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Failed to get Supabase user:', error);
    return null;
  }
  return user;
};

// Add new user (sign up)
export const addUser = async (userData: { email: string; password: string; username?: string; role?: User['role'] }): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username || userData.email.split('@')[0],
          role: userData.role || 'writer'
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const newUser: User = {
        id: data.user.id,
        username: data.user.user_metadata?.username === 'Admin' ? 'Dhruba' : (data.user.user_metadata?.username || userData.email.split('@')[0] || 'Dhruba'),
        email: data.user.email || '',
        role: data.user.user_metadata?.role || 'writer',
        isActive: true,
        createdAt: data.user.created_at
      };
      return { success: true, user: newUser };
    }

    return { success: false, error: 'User creation failed' };
  } catch (error) {
    return { success: false, error: 'Failed to create user' };
  }
};

// Update user
export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: {
        username: updates.username,
        role: updates.role
      }
    });

    if (error || !user) {
      console.error('Failed to update user:', error);
      return null;
    }

    // Update local user
    if (currentUser && currentUser.id === id) {
      currentUser = { ...currentUser, ...updates };
    }

    return currentUser;
  } catch (error) {
    console.error('User update failed:', error);
    return null;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Note: Deleting users requires admin privileges in Supabase
    // This is a simplified version
    console.log('User deletion not implemented in this version');
    return false;
  } catch (error) {
    console.error('User deletion failed:', error);
    return false;
  }
};

// Get all users (not implemented for Supabase)
export const getAllUsers = (): User[] => {
  return currentUser ? [currentUser] : [];
};

// Permission functions
export const canPublishArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'writer';
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

// Admin functions for managing user roles
export const grantUserRole = async (userId: string, role: 'admin' | 'writer' | 'viewer'): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can grant user roles' };
    }

    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: role,
        granted_by: currentUser.id
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Failed to grant user role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error granting user role:', error);
    return { success: false, error: 'Failed to grant user role' };
  }
};

export const revokeUserRole = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can revoke user roles' };
    }

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to revoke user role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error revoking user role:', error);
    return { success: false, error: 'Failed to revoke user role' };
  }
};

interface UserRoleData {
  user_id: string;
  role: string;
  granted_at: string;
  users: {
    id: string;
    email: string;
    created_at: string;
  }[];
}

export const getAllUsersWithRoles = async (): Promise<{ success: boolean; users?: Array<{ id: string; email: string; role: string; created_at: string }>; error?: string }> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can view all users' };
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role,
        granted_at,
        users:user_id (
          id,
          email,
          created_at
        )
      `)
      .order('granted_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch users with roles:', error);
      return { success: false, error: error.message };
    }

    const users = (data as UserRoleData[])?.map((item: UserRoleData) => ({
      id: item.user_id,
      email: item.users?.[0]?.email || 'Unknown',
      role: item.role,
      created_at: item.users?.[0]?.created_at || item.granted_at
    })) || [];

    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
};

export const updateUserRole = async (userId: string, newRole: 'admin' | 'writer' | 'viewer'): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Only admins can update user roles' };
    }

    const { error } = await supabase
      .from('user_roles')
      .update({
        role: newRole,
        granted_by: currentUser.id,
        granted_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to update user role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
};
