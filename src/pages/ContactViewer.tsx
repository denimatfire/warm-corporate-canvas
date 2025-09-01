import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contactApi, ContactRecord } from '@/lib/contact-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Mail, Clock, User, MessageSquare, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactViewer: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);

  // Fetch contacts
  const { data: contacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: contactApi.getAll,
  });

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Update contact status
  const handleStatusUpdate = async (contactId: string, newStatus: ContactRecord['status']) => {
    try {
      await contactApi.updateStatus(contactId, newStatus);
      toast({
        title: "Status updated",
        description: `Contact status changed to ${newStatus}`,
      });
      refetch(); // Refresh the data
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update contact status",
        variant: "destructive",
      });
    }
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'read': return 'secondary';
      case 'replied': return 'success';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading contacts: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Form Submissions</h1>
        <p className="text-gray-600">View and manage contact form submissions from your website</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-right">
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {contacts.filter(c => c.status === 'new').length}
            </div>
            <div className="text-sm text-gray-600">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {contacts.filter(c => c.status === 'read').length}
            </div>
            <div className="text-sm text-gray-600">Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contacts.filter(c => c.status === 'replied').length}
            </div>
            <div className="text-sm text-gray-600">Replied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {contacts.filter(c => c.status === 'archived').length}
            </div>
            <div className="text-sm text-gray-600">Archived</div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact List</h2>
          {filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No contacts match your search criteria' 
                  : 'No contact submissions yet'}
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map((contact) => (
              <Card 
                key={contact.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{contact.name}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {contact.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(contact.created_at)}</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {contact.message}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Contact Detail View */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
          {selectedContact ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{selectedContact.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedContact.status)}>
                      {selectedContact.status}
                    </Badge>
                    <Select 
                      value={selectedContact.status} 
                      onValueChange={(value: ContactRecord['status']) => 
                        handleStatusUpdate(selectedContact.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedContact.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedContact.updated_at)}</p>
                  </div>
                </div>
                
                {selectedContact.read_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Read At</label>
                    <p className="text-gray-900">{formatDate(selectedContact.read_at)}</p>
                  </div>
                )}
                
                {selectedContact.replied_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Replied At</label>
                    <p className="text-gray-900">{formatDate(selectedContact.replied_at)}</p>
                  </div>
                )}
                
                {selectedContact.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-900">{selectedContact.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a contact to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactViewer;
