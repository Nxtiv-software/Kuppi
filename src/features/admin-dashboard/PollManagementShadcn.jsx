import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  AlertCircle,
  Search,
  Loader2,
  Trash2,
  Ban,
  BarChart3,
  FileText,
  PlayCircle,
  StopCircle,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
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
import { toast } from 'sonner';
import { getAllPolls, deletePoll, updatePollStatus, forceClosePoll } from '../../services/adminApi';

const PollManagementShadcn = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const resolveTabFromSearch = (search) => {
    const params = new URLSearchParams(search);
    const tab = params.get('pollStatus') || params.get('status');
    const validTabs = new Set(['active', 'pending', 'accepted', 'expired', 'rejected']);
    return tab && validTabs.has(tab) ? tab : 'active';
  };

  const [activeTab, setActiveTab] = useState(() => resolveTabFromSearch(location.search));
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [viewDetailsDialog, setViewDetailsDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, pollId: null, pollTitle: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const tabFromUrl = resolveTabFromSearch(location.search);
    setActiveTab((previousTab) => {
      if (tabFromUrl !== previousTab) {
        setCurrentPage(1);
        return tabFromUrl;
      }
      return previousTab;
    });
  }, [location.search]);

  // Fetch polls based on status
  const { data: pollsData, isLoading, error } = useQuery({
    queryKey: ['adminPolls', activeTab, currentPage, searchTerm],
    queryFn: () => getAllPolls({
      page: currentPage,
      limit,
      status: activeTab,
      search: searchTerm
    }),
    keepPreviousData: true,
  });

  // Delete poll mutation
  const deletePollMutation = useMutation({
    mutationFn: deletePoll,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPolls']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('Poll deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete poll');
    }
  });

  // Force close poll mutation
  const forceClosePollMutation = useMutation({
    mutationFn: forceClosePoll,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPolls']);
      toast.success('Poll closed and archived successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to close poll');
    }
  });

  // Update poll status mutation (approve/reject)
  const updateStatusMutation = useMutation({
    mutationFn: ({ pollId, status, reason }) => updatePollStatus(pollId, status, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['adminPolls']);
      const action = variables.status === 'accepted' ? 'approved' : 'rejected';
      toast.success(`Poll ${action} successfully`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update poll status');
    }
  });

  const polls = pollsData?.data?.polls || [];
  const totalPolls = pollsData?.data?.total || 0;
  const totalPages = Math.ceil(totalPolls / limit);

  // Get counts for each tab
  const activePollsCount = pollsData?.data?.counts?.active || 0;
  const pendingCount = pollsData?.data?.counts?.pending || 0;
  const acceptedCount = pollsData?.data?.counts?.accepted || 0;
  const expiredCount = pollsData?.data?.counts?.expired || 0;
  const rejectedCount = pollsData?.data?.counts?.rejected || 0;

  const handlePollAction = (action, pollId, pollTitle = '') => {
    setActionDialog({ isOpen: true, action, pollId, pollTitle });
  };

  const confirmAction = () => {
    const { action, pollId } = actionDialog;
    
    switch(action) {
      case 'delete':
        deletePollMutation.mutate(pollId);
        break;
      case 'forceClose':
        forceClosePollMutation.mutate(pollId);
        break;
      case 'approve':
        updateStatusMutation.mutate({ pollId, status: 'accepted' });
        break;
      case 'reject':
        // You might want to add a reason input here
        updateStatusMutation.mutate({ pollId, status: 'rejected', reason: 'Not approved by admin' });
        break;
      default:
        break;
    }
    
    setActionDialog({ isOpen: false, action: null, pollId: null, pollTitle: null });
  };

  const getStatusBadge = (status, hasEnoughVotes = false) => {
    const variants = {
      active: { 
        className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', 
        label: 'Active', 
        icon: PlayCircle 
      },
      pending: { 
        className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', 
        label: 'Pending Approval', 
        icon: Clock 
      },
      accepted: { 
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', 
        label: 'Accepted', 
        icon: CheckCircle2 
      },
      expired: { 
        className: 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300', 
        label: 'Expired', 
        icon: StopCircle 
      },
      rejected: { 
        className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', 
        label: 'Rejected', 
        icon: XCircle 
      }
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeleteActionConfig = (status) => {
    const configs = {
      active: {
        action: 'forceClose',
        title: 'Force Close Poll',
        description: 'This will close the poll and save all votes and analytics. The poll will be archived.',
        buttonText: 'Force Close & Archive',
        variant: 'destructive'
      },
      pending: {
        action: 'delete',
        title: 'Delete Poll',
        description: 'This poll is pending approval. Deleting it will have no impact on students.',
        buttonText: 'Delete Poll',
        variant: 'destructive'
      },
      accepted: {
        action: 'delete',
        title: 'Delete Accepted Poll',
        description: 'This will unschedule the poll (if scheduled) and move it to archive.',
        buttonText: 'Delete & Archive',
        variant: 'destructive'
      },
      expired: {
        action: 'delete',
        title: 'Delete Expired Poll',
        description: 'Analytics and results will be preserved. The poll will be hidden from main lists.',
        buttonText: 'Delete Poll',
        variant: 'destructive'
      },
      rejected: {
        action: 'delete',
        title: 'Delete Rejected Poll',
        description: 'This poll was rejected. You can safely delete it.',
        buttonText: 'Delete Poll',
        variant: 'destructive'
      }
    };
    return configs[status] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading polls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Failed to load polls</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {error?.message || 'An error occurred while fetching polls'}
              </p>
              <Button size="sm" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPollCard = (poll) => {
    const votePercentage = poll.targetVotes > 0 ? (poll.votes?.length / poll.targetVotes) * 100 : 0;
    const hasEnoughVotes = poll.votes?.length >= poll.targetVotes;

    return (
      <Card key={poll._id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold pr-4">{poll.title}</h3>
                  {getStatusBadge(poll.status, hasEnoughVotes)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{poll.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Subject:</span>
                  <span className="text-muted-foreground capitalize">{poll.subject?.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Preferred:</span>
                  <span className="text-muted-foreground">{formatDate(poll.preferredDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Votes:</span>
                  <span className="text-muted-foreground">{poll.votes?.length || 0} / {poll.targetVotes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time:</span>
                  <span className="text-muted-foreground capitalize">{poll.timeSlot}</span>
                </div>
              </div>

              {/* Vote Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vote Progress</span>
                  <span className="font-medium">{Math.round(votePercentage)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      hasEnoughVotes ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(votePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{poll.subject}</Badge>
                {poll.chapter && <Badge variant="secondary">{poll.chapter}</Badge>}
                {hasEnoughVotes && <Badge className="bg-green-100 text-green-700">Target Reached</Badge>}
              </div>

              {poll.creator && (
                <div className="text-sm text-muted-foreground">
                  Created by: {poll.creatorName || 'Student'}
                </div>
              )}

              {poll.acceptedByInfo && (
                <div className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Accepted by: {poll.acceptedByInfo.name || poll.acceptedByInfo.email?.split('@')[0] || 'Tutor'}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-[120px]">
              <Button
                size="sm"
                variant="ghost"
                className="gap-2 justify-start"
                onClick={() => {
                  setSelectedPoll(poll);
                  setViewDetailsDialog(true);
                }}
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>

              {activeTab === 'pending' && (
                <>
                  <Button
                    size="sm"
                    className="gap-2 justify-start bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handlePollAction('approve', poll._id, poll.title)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 justify-start border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handlePollAction('reject', poll._id, poll.title)}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {activeTab === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 justify-start border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => handlePollAction('forceClose', poll._id, poll.title)}
                >
                  <StopCircle className="h-4 w-4" />
                  Force Close
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="gap-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handlePollAction('delete', poll._id, poll.title)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Poll Management</h2>
        <p className="text-muted-foreground">Manage student polls, approvals, and analytics</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setCurrentPage(1); }}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="active" className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Active ({activePollsCount})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Accepted ({acceptedCount})
          </TabsTrigger>
          <TabsTrigger value="expired" className="gap-2">
            <Archive className="h-4 w-4" />
            Expired ({expiredCount})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            Rejected ({rejectedCount})
          </TabsTrigger>
        </TabsList>

        {/* Active Polls Tab */}
        <TabsContent value="active" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Polls</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Currently running polls with real-time participation</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.length > 0 ? (
                polls.map(renderPollCard)
              ) : (
                <div className="text-center py-12">
                  <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active polls found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approval Tab */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Approval</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Polls created by tutors awaiting admin approval</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.length > 0 ? (
                polls.map(renderPollCard)
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending polls</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accepted Polls Tab */}
        <TabsContent value="accepted" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Accepted Polls</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Approved polls that can be scheduled or activated</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.length > 0 ? (
                polls.map(renderPollCard)
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No accepted polls</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expired/Closed Polls Tab */}
        <TabsContent value="expired" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Expired / Closed Polls</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Polls that have ended with results and analytics available</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.length > 0 ? (
                polls.map(renderPollCard)
              ) : (
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No expired polls</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Polls Tab */}
        <TabsContent value="rejected" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rejected Polls</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Polls declined by admin with rejection reasons logged</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.length > 0 ? (
                polls.map(renderPollCard)
              ) : (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No rejected polls</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {polls.length} of {totalPolls} polls
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialog} onOpenChange={setViewDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Poll Details</DialogTitle>
            <DialogDescription>Complete information about this poll</DialogDescription>
          </DialogHeader>
          {selectedPoll && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedPoll.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedPoll.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Subject:</span>
                  <span className="text-muted-foreground ml-2 capitalize">
                    {selectedPoll.subject?.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Chapter:</span>
                  <span className="text-muted-foreground ml-2">{selectedPoll.chapter}</span>
                </div>
                <div>
                  <span className="font-medium">Preferred Date:</span>
                  <span className="text-muted-foreground ml-2">{formatDate(selectedPoll.preferredDate)}</span>
                </div>
                <div>
                  <span className="font-medium">Time Slot:</span>
                  <span className="text-muted-foreground ml-2 capitalize">{selectedPoll.timeSlot}</span>
                </div>
                <div>
                  <span className="font-medium">Max Students:</span>
                  <span className="text-muted-foreground ml-2">{selectedPoll.maxStudents}</span>
                </div>
                <div>
                  <span className="font-medium">Current Votes:</span>
                  <span className="text-muted-foreground ml-2">
                    {selectedPoll.votes?.length || 0} / {selectedPoll.targetVotes}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2">{getStatusBadge(selectedPoll.status)}</span>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="text-muted-foreground ml-2">{formatDate(selectedPoll.createdAt)}</span>
                </div>
              </div>

              {selectedPoll.creatorName && (
                <div className="text-sm">
                  <span className="font-medium">Created by:</span>
                  <span className="text-muted-foreground ml-2">{selectedPoll.creatorName}</span>
                </div>
              )}

              {selectedPoll.acceptedByInfo && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Accepted Tutor Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Tutor Name:</span>
                      <span className="text-muted-foreground ml-2">
                        {selectedPoll.acceptedByInfo.name || selectedPoll.acceptedByInfo.email?.split('@')[0] || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tutor Email:</span>
                      <span className="text-muted-foreground ml-2">{selectedPoll.acceptedByInfo.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, action: null, pollId: null, pollTitle: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'approve' && 'Approve Poll'}
              {actionDialog.action === 'reject' && 'Reject Poll'}
              {actionDialog.action === 'forceClose' && 'Force Close Poll'}
              {actionDialog.action === 'delete' && 'Delete Poll'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'approve' && 
                `Are you sure you want to approve "${actionDialog.pollTitle}"? Students will be able to vote on this poll.`
              }
              {actionDialog.action === 'reject' && 
                `Are you sure you want to reject "${actionDialog.pollTitle}"? The creator will be notified.`
              }
              {actionDialog.action === 'forceClose' && 
                `This will close "${actionDialog.pollTitle}" and save all votes and analytics. The poll will be archived.`
              }
              {actionDialog.action === 'delete' && 
                `Are you sure you want to delete "${actionDialog.pollTitle}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                actionDialog.action === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : actionDialog.action === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }
            >
              {actionDialog.action === 'approve' && 'Approve'}
              {actionDialog.action === 'reject' && 'Reject'}
              {actionDialog.action === 'forceClose' && 'Force Close'}
              {actionDialog.action === 'delete' && 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PollManagementShadcn;
