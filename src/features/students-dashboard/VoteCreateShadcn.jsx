import React, { useState } from 'react';
import { createPoll, getTrendingPolls, getPolls, voteOnPoll, removeVote, deletePoll } from '../../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { Plus, TrendingUp, Calendar, Users, Clock, Vote, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';
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

const VoteCreateShadcn = () => {
  const [activeView, setActiveView] = useState('polls');
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-8">
      {activeView === 'create' ? (
        <CreatePollForm onBack={() => setActiveView('polls')} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Poll Management</h2>
              <p className="text-muted-foreground">Vote on existing polls or create a new one</p>
            </div>
            <Button 
              size="lg"
              onClick={() => setActiveView('create')}
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Poll
            </Button>
          </div>
          <PollsList />
        </>
      )}
    </div>
  );
};

const CreatePollForm = ({ onBack }) => {
  const queryClient = useQueryClient();
  const { user, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pollData, setPollData] = useState({
    title: '',
    subject: '',
    chapter: '',
    description: '',
    preferredDate: '',
    timeSlot: '',
    maxStudents: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast.error('Authentication Required', {
        description: 'Please sign in to create a poll',
      });
      return;
    }

    if (!pollData.title || !pollData.subject || !pollData.chapter || !pollData.description || 
        !pollData.preferredDate || !pollData.timeSlot || !pollData.maxStudents) {
      toast.error('Missing Information', {
        description: 'Please fill in all required fields to continue',
      });
      return;
    }

    if (pollData.title.length < 5 || pollData.title.length > 200) {
      toast.error('Invalid Title Length', {
        description: 'Title must be between 5 and 200 characters',
      });
      return;
    }

    if (pollData.description.length < 10 || pollData.description.length > 1000) {
      toast.error('Invalid Description Length', {
        description: 'Description must be between 10 and 1000 characters',
      });
      return;
    }

    if (parseInt(pollData.maxStudents) < 1 || parseInt(pollData.maxStudents) > 50) {
      toast.error('Invalid Student Count', {
        description: 'Maximum students must be between 1 and 50',
      });
      return;
    }

    const selectedDate = new Date(pollData.preferredDate);
    if (selectedDate <= new Date()) {
      toast.error('Invalid Date', {
        description: 'Preferred date must be in the future',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const pollDataWithUser = {
        ...pollData,
        maxStudents: parseInt(pollData.maxStudents),
        createdBy: user.id,
        creatorName: user.name || user.firstName || 'Anonymous'
      };
      
      await createPoll(pollDataWithUser);
      toast.success('Poll Created Successfully!', {
        description: `Your poll "${pollData.title}" has been published`,
      });
      onBack();
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
      
      setPollData({
        title: '',
        subject: '',
        chapter: '',
        description: '',
        preferredDate: '',
        timeSlot: '',
        maxStudents: '',
      });
    } catch (error) {
      toast.error('Failed to Create Poll', {
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Create New Poll</CardTitle>
            <CardDescription className="text-sm">
              Propose a new study session topic for the community to vote on
            </CardDescription>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-8 pb-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Basic Information</h3>
              <Separator />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Poll Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={pollData.title}
                onChange={(e) => setPollData({ ...pollData, title: e.target.value })}
                placeholder="Enter a descriptive title for your poll"
                className="h-10"
                required
              />
              <p className="text-xs text-muted-foreground">
                {pollData.title.length}/200 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject <span className="text-destructive">*</span></Label>
                <Select value={pollData.subject} onValueChange={(value) => setPollData({ ...pollData, subject: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combined-maths">Combined Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chapter" className="text-sm font-medium">Chapter/Topic <span className="text-destructive">*</span></Label>
                <Input
                  id="chapter"
                  value={pollData.chapter}
                  onChange={(e) => setPollData({ ...pollData, chapter: e.target.value })}
                  placeholder="e.g., Limits and Derivatives"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Schedule Details</h3>
              <Separator />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="preferredDate" className="text-sm font-medium">
                  Preferred Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={pollData.preferredDate}
                  onChange={(e) => setPollData({ ...pollData, preferredDate: e.target.value })}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot" className="text-sm font-medium">
                  Time Slot <span className="text-destructive">*</span>
                </Label>
                <Select value={pollData.timeSlot} onValueChange={(value) => setPollData({ ...pollData, timeSlot: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudents" className="text-sm font-medium">
                  Max Students <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxStudents"
                  type="number"
                  value={pollData.maxStudents}
                  onChange={(e) => setPollData({ ...pollData, maxStudents: e.target.value })}
                  min="1"
                  max="50"
                  placeholder="20"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Description</h3>
              <Separator />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Poll Description <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                value={pollData.description}
                onChange={(e) => setPollData({ ...pollData, description: e.target.value })}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Describe the topics to be covered, learning objectives, and any special requirements..."
                minLength="10"
                maxLength="1000"
                required
              />
              <p className="text-xs text-muted-foreground">
                {pollData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const PollsList = () => {
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    subject: 'all',
    status: 'all',
    date: 'all'
  });

  const { data: pollsData, isLoading } = useQuery({
    queryKey: ['polls', filters],
    queryFn: () => getPolls(filters),
    enabled: isSignedIn,
  });

  const { data: trendingData } = useQuery({
    queryKey: ['trendingPolls'],
    queryFn: getTrendingPolls,
    enabled: isSignedIn,
  });

  const polls = pollsData?.data?.polls || [];
  const trendingPolls = trendingData?.data || [];

  const handleVote = async (pollId) => {
    if (!isSignedIn) {
      toast.error('Authentication Required', {
        description: 'Please sign in to vote on polls',
      });
      return;
    }
    try {
      await voteOnPoll(pollId);
      toast.success('Vote Recorded!', {
        description: 'Your vote has been successfully added',
      });
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      toast.error('Failed to Vote', {
        description: error.message || 'An unexpected error occurred',
      });
    }
  };

  const handleRemoveVote = async (pollId) => {
    if (!isSignedIn) {
      toast.error('Authentication Required', {
        description: 'Please sign in to remove your vote',
      });
      return;
    }
    try {
      await removeVote(pollId);
      toast.success('Vote Removed!', {
        description: 'Your vote has been successfully removed',
      });
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      toast.error('Failed to Remove Vote', {
        description: error.message || 'An unexpected error occurred',
      });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);

  const handleDeleteClick = (pollId) => {
    setPollToDelete(pollId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pollToDelete) return;
    try {
      await deletePoll(pollToDelete);
      toast.success('Poll deleted successfully!', {
        description: 'The poll has been removed from the system.',
      });
      queryClient.invalidateQueries(['polls']);
      queryClient.invalidateQueries(['trendingPolls']);
    } catch (error) {
      toast.error('Failed to delete poll', {
        description: error.message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setPollToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Filter Polls</CardTitle>
              <CardDescription className="text-sm">Refine your search criteria</CardDescription>
            </div>
            <Badge variant="secondary">
              {polls.length} {polls.length === 1 ? 'Result' : 'Results'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Subject
              </Label>
              <Select value={filters.subject} onValueChange={(value) => setFilters({ ...filters, subject: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="combined-maths">Combined Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Date Range
              </Label>
              <Select value={filters.date} onValueChange={(value) => setFilters({ ...filters, date: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Polls */}
      {trendingPolls.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Trending Polls
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Most popular polls</p>
            </div>
            <Badge variant="outline">
              {trendingPolls.length}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingPolls.slice(0, 3).map((poll) => (
              <PollCard key={poll._id} poll={poll} onVote={handleVote} onRemoveVote={handleRemoveVote} onDelete={handleDeleteClick} user={user} isTrending />
            ))}
          </div>
        </div>
      )}

      {/* All Polls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">All Polls</h3>
            <p className="text-sm text-muted-foreground mt-1">{polls.length} {polls.length === 1 ? 'poll' : 'polls'} available</p>
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : polls.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-muted">
                  <Vote className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No polls found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new poll</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard key={poll._id} poll={poll} onVote={handleVote} onRemoveVote={handleRemoveVote} onDelete={handleDeleteClick} user={user} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Poll
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this poll? This action cannot be undone.
              All votes and data associated with this poll will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const PollCard = ({ poll, onVote, onRemoveVote, onDelete, user, isTrending = false }) => {
  // Backend sends hasVoted boolean directly
  const hasVoted = poll.hasVoted || false;
  // Backend sends creatorInfo.id, not creator or createdBy
  const isCreator = poll.creatorInfo?.id === user?.id;
  // Backend sends voteCount, not votes array
  const canDelete = isCreator && (poll.voteCount === 0);

  return (
    <Card className={`group relative hover:shadow-lg transition-all duration-200 ${isTrending ? 'border-orange-200 dark:border-orange-900' : ''}`}>
      {isTrending && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="line-clamp-2 text-base font-semibold">
            {poll.title}
          </CardTitle>
          <Badge 
            variant={poll.status === 'active' ? 'default' : poll.status === 'accepted' ? 'secondary' : 'destructive'}
            className="shrink-0 text-xs"
          >
            {poll.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center border">
            <span className="text-xs font-medium">
              {poll.creatorName?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <CardDescription className="text-xs">by {poll.creatorName || 'Anonymous'}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {poll.subject?.replace('-', ' ')}
          </Badge>
          <span className="text-xs text-muted-foreground">• {poll.chapter}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {poll.description}
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(poll.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="capitalize">{poll.timeSlot}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Max {poll.maxStudents} students</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-primary" />
              <span className="text-lg font-semibold">{poll.voteCount || 0}</span>
              <span className="text-xs text-muted-foreground">
                / {poll.targetVotes || 10} votes
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {Math.round(((poll.voteCount || 0) / (poll.targetVotes || 10)) * 100)}%
            </Badge>
          </div>
          <Progress 
            value={((poll.voteCount || 0) / (poll.targetVotes || 10)) * 100} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {(poll.targetVotes || 10) - (poll.voteCount || 0)} more votes needed
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4">
        {hasVoted ? (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onRemoveVote(poll._id)}
          >
            <X className="mr-2 h-4 w-4" />
            Remove Vote
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={() => onVote(poll._id)}
            disabled={poll.status !== 'active'}
          >
            <Vote className="mr-2 h-4 w-4" />
            Vote
          </Button>
        )}
        
        {canDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(poll._id)}
            title="Delete poll (only possible when no votes)"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VoteCreateShadcn;
