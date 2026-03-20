import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle, RefreshCw, FileCheck2, User, Phone, MapPin, GraduationCap, Mail, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/tabs';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  getTutorApplications,
  approveTutorApplication,
  rejectTutorApplication,
  deleteTutorApplication,
  updateTutorApplicationEmail,
} from '../../services/adminApi';

const statusBadgeClass = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  approved: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const TutorApplicationsShadcn = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({ open: false, applicationId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, applicationId: null });
  const [adminNote, setAdminNote] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const limit = 20;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['tutorApplications', statusFilter, currentPage],
    queryFn: () => getTutorApplications({ page: currentPage, limit, status: statusFilter }),
    keepPreviousData: true,
  });

  const approveMutation = useMutation({
    mutationFn: approveTutorApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['tutorApplications']);
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('Application approved and user promoted to tutor');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to approve application');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ applicationId, adminNote }) => rejectTutorApplication(applicationId, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutorApplications']);
      toast.success('Application rejected');
      setRejectDialog({ open: false, applicationId: null });
      setAdminNote('');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to reject application');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTutorApplication,
    onSuccess: () => {
      queryClient.invalidateQueries(['tutorApplications']);
      toast.success('Rejected application deleted');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete application');
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: ({ applicationId, email }) => updateTutorApplicationEmail(applicationId, email),
    onSuccess: (result) => {
      queryClient.invalidateQueries(['tutorApplications']);
      toast.success('Application email updated');
      if (selectedApplication) {
        setSelectedApplication({ ...selectedApplication, email: result?.data?.email || editEmail });
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update email');
    },
  });

  const applications = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleApprove = (applicationId) => {
    approveMutation.mutate(applicationId);
  };

  const handleReject = () => {
    if (!rejectDialog.applicationId) return;
    rejectMutation.mutate({ applicationId: rejectDialog.applicationId, adminNote });
  };

  const handleDelete = (applicationId) => {
    setDeleteDialog({ open: true, applicationId });
  };

  const confirmDelete = () => {
    if (!deleteDialog.applicationId) return;
    deleteMutation.mutate(deleteDialog.applicationId, {
      onSuccess: () => {
        setDeleteDialog({ open: false, applicationId: null });
      },
    });
  };

  const statusCount = {
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading tutor applications...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Failed to load tutor applications</h3>
            <p className="text-sm text-muted-foreground">{error?.message || 'Unknown error'}</p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileCheck2 className="h-6 w-6 text-primary" />
                Tutor Applications
              </CardTitle>
              <p className="text-muted-foreground mt-1">Review student requests to become tutors</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => refetch()} className="gap-2" disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="text-sm text-muted-foreground">Total: {total} applications</div>

          {applications.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No tutor applications found for this filter.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card key={app._id} className="border">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{app.fullName}</h3>
                          <Badge className={statusBadgeClass[app.status] || statusBadgeClass.pending}>
                            {app.status}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{app.email || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{app.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{app.city}, {app.district}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{app.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{(app.languages || []).join(', ') || 'No languages'}</span>
                          </div>
                        </div>

                        <p className="text-sm line-clamp-2 text-muted-foreground max-w-3xl">{app.bio}</p>

                        <div className="flex flex-wrap gap-2">
                          {(app.subjects || []).slice(0, 6).map((subject) => (
                            <Badge key={subject} variant="secondary">{subject}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:items-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedApplication(app);
                            setEditEmail(app.email || '');
                          }}
                        >
                          View Details
                        </Button>

                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(app._id)}
                              disabled={approveMutation.isLoading || rejectMutation.isLoading}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              className="gap-2"
                              onClick={() => setRejectDialog({ open: true, applicationId: app._id })}
                              disabled={approveMutation.isLoading || rejectMutation.isLoading}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {['rejected', 'approved'].includes(app.status) && (
                          <Button
                            variant="destructive"
                            className="gap-2"
                            onClick={() => handleDelete(app._id)}
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tutor Application Details</DialogTitle>
            <DialogDescription>
              Full submitted details for {selectedApplication?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid gap-4 text-sm">
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-2">Applicant Email</p>
                <div className="flex gap-2">
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="applicant@email.com"
                  />
                  <Button
                    onClick={() => updateEmailMutation.mutate({ applicationId: selectedApplication._id, email: editEmail })}
                    disabled={updateEmailMutation.isLoading || !editEmail.trim()}
                  >
                    {updateEmailMutation.isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Detail label="Full Name" value={selectedApplication.fullName} />
                <Detail label="Email" value={selectedApplication.email} />
                <Detail label="NIC" value={selectedApplication.nicNumber} />
                <Detail label="Date of Birth" value={selectedApplication.dateOfBirth} />
                <Detail label="Phone" value={selectedApplication.phone} />
                <Detail label="District" value={selectedApplication.district} />
                <Detail label="City" value={selectedApplication.city} />
              </div>

              <Detail label="Bio" value={selectedApplication.bio} multiline />
              <Detail label="Languages" value={(selectedApplication.languages || []).join(', ')} />

              <div className="grid gap-2 sm:grid-cols-2">
                <Detail label="Qualification" value={selectedApplication.qualification} />
                <Detail label="University" value={selectedApplication.university} />
                <Detail label="Field of Study" value={selectedApplication.fieldOfStudy} />
                <Detail label="Graduation Year" value={selectedApplication.graduationYear} />
                <Detail label="A/L Stream" value={selectedApplication.alStream} />
              </div>

              <Detail label="A/L Results" value={selectedApplication.alResults} multiline />
              <Detail label="Subjects" value={(selectedApplication.subjects || []).join(', ')} multiline />
              <Detail label="Grades" value={(selectedApplication.grades || []).join(', ')} />

              <div className="grid gap-2 sm:grid-cols-2">
                <Detail label="Experience Years" value={selectedApplication.experienceYears} />
                <Detail label="Teaching Type" value={selectedApplication.teachingType} />
              </div>

              <Detail label="Available Days" value={(selectedApplication.availableDays || []).join(', ')} />
              <Detail label="Availability Time" value={selectedApplication.availability} />
              <Detail label="LinkedIn" value={selectedApplication.linkedin} />
              <Detail label="Certificate Link" value={selectedApplication.certificateLink} />

              {selectedApplication.adminNote && (
                <Detail label="Admin Note" value={selectedApplication.adminNote} multiline />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, applicationId: null })}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Optionally add a reason for rejection.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Reason (optional)"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, applicationId: null })}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isLoading}>
              {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, applicationId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rejected Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the rejected tutor application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Detail = ({ label, value, multiline = false }) => (
  <div className="rounded-md border bg-muted/30 p-3">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={multiline ? 'whitespace-pre-wrap' : ''}>{value || '-'}</p>
  </div>
);

export default TutorApplicationsShadcn;
