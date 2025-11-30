import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, Mail, MessageSquare, Inbox, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Spinner from '@/components/ui/spinner';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const ContactRequests = () => {
  const { loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load contact requests.');
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already read

    const { error } = await supabase
      .from('contact_requests')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.');
    } else {
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, is_read: true } : req))
      );
      toast.success('Marked as read.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', requestToDelete);

    if (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request.');
    } else {
      setRequests((prev) => prev.filter((req) => req.id !== requestToDelete));
      toast.success('Request deleted.');
    }
    setRequestToDelete(null);
  };

  const handleViewDetails = async (request: ContactRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
    if (!request.is_read) {
      await markAsRead(request.id, false);
    }
  };

  const totalRequests = requests.length;
  const unreadRequests = requests.filter((req) => !req.is_read).length;

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <AdminSidebar loading={authLoading} />

      <main className='flex-1 p-8 lg:ml-0 md:ml-0 sm:ml-0'>
        <div className='flex justify-between items-center mb-6 mt-16 lg:mt-0'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-white'>
            Contact Requests
          </h1>
          <Button onClick={fetchRequests} variant='outline'>
            Refresh
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Requests
              </CardTitle>
              <Inbox className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalRequests}</div>
              <p className='text-xs text-muted-foreground'>
                All time contact form submissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Unread Requests
              </CardTitle>
              <MessageSquare className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{unreadRequests}</div>
              <p className='text-xs text-muted-foreground'>
                Messages waiting for your review
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner size='lg' />
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center h-24'>
                      No contact requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow
                      key={request.id}
                      className={
                        !request.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }
                    >
                      <TableCell>
                        {request.is_read ? (
                          <Badge variant='secondary'>Read</Badge>
                        ) : (
                          <Badge variant='default' className='bg-blue-500'>
                            New
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.created_at), 'PP p')}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-medium'>{request.name}</span>
                          <span className='text-xs text-gray-500'>
                            {request.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-xs truncate'>
                        {request.subject}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          {!request.is_read && (
                            <Button
                              size='sm'
                              variant='ghost'
                              title='Mark as Read'
                              onClick={() => markAsRead(request.id, false)}
                            >
                              <CheckCircle className='h-4 w-4 text-green-600' />
                            </Button>
                          )}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className='h-4 w-4 mr-1' /> View
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-red-500 hover:text-red-700 hover:bg-red-50'
                            onClick={() => handleDeleteClick(request.id)}
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>Contact Request Details</DialogTitle>
              <DialogDescription>
                Received on{' '}
                {selectedRequest &&
                  format(new Date(selectedRequest.created_at), 'PP p')}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <span className='font-bold text-right'>Name:</span>
                  <span className='col-span-3'>{selectedRequest.name}</span>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <span className='font-bold text-right'>Email:</span>
                  <span className='col-span-3 flex items-center gap-2'>
                    {selectedRequest.email}
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      <Mail className='h-4 w-4' />
                    </a>
                  </span>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <span className='font-bold text-right'>Subject:</span>
                  <span className='col-span-3'>{selectedRequest.subject}</span>
                </div>
                <div className='grid grid-cols-4 gap-4'>
                  <span className='font-bold text-right mt-1'>Message:</span>
                  <div className='col-span-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-md whitespace-pre-wrap max-h-60 overflow-y-auto'>
                    {selectedRequest.message}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!requestToDelete}
          onOpenChange={(open) => !open && setRequestToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                contact request from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className='bg-red-600 hover:bg-red-700'
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default ContactRequests;
