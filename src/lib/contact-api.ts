import { supabase } from './articles-api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
  read_at?: string;
  replied_at?: string;
  notes?: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  message: string;
}

export const contactApi = {
  // Create new contact form submission
  async create(data: CreateContactData): Promise<ContactRecord> {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert({
          name: data.name,
          email: data.email,
          message: data.message,
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;
      return contact;
    } catch (error) {
      console.error('Failed to create contact record:', error);
      throw error;
    }
  },

  // Get all contacts (for admin use)
  async getAll(): Promise<ContactRecord[]> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw error;
    }
  },

  // Get contact by ID
  async getById(id: string): Promise<ContactRecord> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch contact:', error);
      throw error;
    }
  },

  // Update contact status
  async updateStatus(id: string, status: ContactRecord['status'], notes?: string): Promise<ContactRecord> {
    try {
      const updateData: any = { status };
      
      if (status === 'read' && !notes) {
        updateData.read_at = new Date().toISOString();
      }
      
      if (status === 'replied') {
        updateData.replied_at = new Date().toISOString();
      }
      
      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update contact status:', error);
      throw error;
    }
  },

  // Delete contact (for admin use)
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error;
    }
  },

  // Get contact statistics
  async getStats(): Promise<{
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        new: data?.filter(c => c.status === 'new').length || 0,
        read: data?.filter(c => c.status === 'read').length || 0,
        replied: data?.filter(c => c.status === 'replied').length || 0,
        archived: data?.filter(c => c.status === 'archived').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Failed to fetch contact stats:', error);
      throw error;
    }
  }
};
