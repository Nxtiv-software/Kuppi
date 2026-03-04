import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Download,
  Eye,
  Pencil,
  UserCog,
  Ban,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  AlertCircle,
  Lock,
  Unlock,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
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
import { cn } from '../../utils/utils';
import { getAllUsers, getAdminOverview, createUser, updateUser, updateUserRole, deleteUser } from '../../services/adminApi';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const UserManagementShadcn = ({ setActiveTab }) => {
  const queryClient = useQueryClient();
  const [activeUserTab, setActiveUserTab] = useState('students');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, userId: null, role: null });
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  
  // Form states
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    username: '',
    password: '',
    role: 'student'
  });
  
  const [editUserForm, setEditUserForm] = useState({
    username: '',
    email: '',
    role: ''
  });

  // Fetch users based on current tab
  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['adminUsers', activeUserTab, currentPage, searchTerm, statusFilter],
    queryFn: () => getAllUsers({
      page: currentPage,
      limit,
      role: activeUserTab === 'all' ? 'all' : activeUserTab.slice(0, -1), // Remove 's' from 'students' -> 'student'
      search: searchTerm
    }),
    keepPreviousData: true,
  });

  // Fetch overview for role counts
  const { data: overviewData } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: getAdminOverview,
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole({ userId, role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('User created successfully');
      setCreateUserDialog(false);
      setNewUserForm({ email: '', username: '', password: '', role: 'student' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, ...data }) => updateUser({ userId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      queryClient.invalidateQueries(['adminOverview']);
      toast.success('User updated successfully');
      setEditUserDialog(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  });

  const users = usersData?.data?.users || [];
  const totalUsers = usersData?.data?.total || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  // Get role counts from overview data
  const roleStats = overviewData?.data?.users?.byRole || { students: 0, tutors: 0, admins: 0 };
  const studentCount = roleStats.students || 0;
  const tutorCount = roleStats.tutors || 0;
  const adminCount = roleStats.admins || 0;
  const allUsersCount = (roleStats.students || 0) + (roleStats.tutors || 0) + (roleStats.admins || 0);

  // Filter users for display in current tab
  const displayUsers = users; // Users are already filtered by backend based on activeUserTab

  const handleUserAction = (action, userId, currentRole) => {
    setActionDialog({ isOpen: true, action, userId, role: currentRole });
  };

  const confirmAction = () => {
    const { action, userId, role } = actionDialog;
    
    switch(action) {
      case 'delete':
        deleteUserMutation.mutate(userId);
        break;
      case 'makeAdmin':
        updateRoleMutation.mutate({ userId, role: 'admin' });
        break;
      case 'makeTutor':
        updateRoleMutation.mutate({ userId, role: 'tutor' });
        break;
      case 'makeStudent':
        updateRoleMutation.mutate({ userId, role: 'student' });
        break;
      default:
        break;
    }
    
    setActionDialog({ isOpen: false, action: null, userId: null, role: null });
  };

  const handleCreateUser = () => {
    if (!newUserForm.email || !newUserForm.username || !newUserForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    createUserMutation.mutate(newUserForm);
  };

  const handleEditUser = (user) => {
    setEditUserForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setEditUserDialog(user);
  };

  const handleUpdateUser = () => {
    if (!editUserDialog) return;
    updateUserMutation.mutate({
      userId: editUserDialog._id,
      ...editUserForm
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: 'default', label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
      suspended: { variant: 'secondary', label: 'Suspended', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
      verified: { variant: 'default', label: 'Verified', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
      pending: { variant: 'secondary', label: 'Pending', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' }
    };
    
    const config = variants[status] || variants.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getActivityScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading users...</p>
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
              <h3 className="font-semibold mb-1">Failed to load users</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {error?.message || 'An error occurred while fetching users'}
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

  return (
    <div className="space-y-6">
      {/* Header with Create User Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions. All changes sync with Clerk.</p>
        </div>
        <Button onClick={() => setCreateUserDialog(true)} className="gap-2">
          <UserCog className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeUserTab} onValueChange={(val) => { setActiveUserTab(val); setCurrentPage(1); }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students ({studentCount})</TabsTrigger>
          <TabsTrigger value="tutors">Tutors ({tutorCount})</TabsTrigger>
          <TabsTrigger value="all">All Users ({allUsersCount})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({adminCount})</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Management ({studentCount})</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Users Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">USER</th>
                        <th className="text-left p-4 font-medium text-sm">CONTACT</th>
                        <th className="text-left p-4 font-medium text-sm">ROLE</th>
                        <th className="text-left p-4 font-medium text-sm">JOINED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {user.imageUrl ? (
                                  <AvatarImage src={user.imageUrl} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-semibold">{user.username || 'No name'}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {user._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={cn(
                              user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                              user.role === 'tutor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            )}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...user, type: user.role })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {user.role !== 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                  onClick={() => handleUserAction(
                                    user.role === 'student' ? 'makeTutor' : 'makeStudent',
                                    user.clerkUserId,
                                    user.role
                                  )}
                                  title={`Make ${user.role === 'student' ? 'Tutor' : 'Student'}`}
                                >
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleUserAction('delete', user.clerkUserId, user.role)}
                                title="Delete User"
                                disabled={deleteUserMutation.isLoading}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutors Tab */}
        <TabsContent value="tutors" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tutor Management ({tutorCount})</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Users Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">USER</th>
                        <th className="text-left p-4 font-medium text-sm">CONTACT</th>
                        <th className="text-left p-4 font-medium text-sm">ROLE</th>
                        <th className="text-left p-4 font-medium text-sm">JOINED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {user.imageUrl ? (
                                  <AvatarImage src={user.imageUrl} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-semibold">{user.username || 'No name'}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {user._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={cn(
                              user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                              user.role === 'tutor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            )}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...user, type: user.role })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {user.role !== 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                  onClick={() => handleUserAction(
                                    user.role === 'student' ? 'makeTutor' : 'makeStudent',
                                    user.clerkUserId,
                                    user.role
                                  )}
                                  title={`Make ${user.role === 'student' ? 'Tutor' : 'Student'}`}
                                >
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleUserAction('delete', user.clerkUserId, user.role)}
                                title="Delete User"
                                disabled={deleteUserMutation.isLoading}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Users Tab */}
        <TabsContent value="all" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Users ({allUsersCount})</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Users Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">USER</th>
                        <th className="text-left p-4 font-medium text-sm">CONTACT</th>
                        <th className="text-left p-4 font-medium text-sm">ROLE</th>
                        <th className="text-left p-4 font-medium text-sm">JOINED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {user.imageUrl ? (
                                  <AvatarImage src={user.imageUrl} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-semibold">{user.username || 'No name'}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {user._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={cn(
                              user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                              user.role === 'tutor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            )}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...user, type: user.role })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {user.role !== 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                  onClick={() => handleUserAction(
                                    user.role === 'student' ? 'makeTutor' : 'makeStudent',
                                    user.clerkUserId,
                                    user.role
                                  )}
                                  title={`Make ${user.role === 'student' ? 'Tutor' : 'Student'}`}
                                >
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleUserAction('delete', user.clerkUserId, user.role)}
                                title="Delete User"
                                disabled={deleteUserMutation.isLoading}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admin Management ({adminCount})</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Users Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">USER</th>
                        <th className="text-left p-4 font-medium text-sm">CONTACT</th>
                        <th className="text-left p-4 font-medium text-sm">ROLE</th>
                        <th className="text-left p-4 font-medium text-sm">JOINED</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {user.imageUrl ? (
                                  <AvatarImage src={user.imageUrl} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-semibold">{user.username || 'No name'}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {user._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={cn(
                              user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                              user.role === 'tutor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            )}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-muted-foreground">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...user, type: user.role })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                                onClick={() => handleEditUser(user)}
                                title="Edit User"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                onClick={() => handleUserAction('makeStudent', user.clerkUserId, user.role)}
                                title="Demote to Student"
                              >
                                <UserCog className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Assignment Tab - Removed */}
        {/* Permissions Tab - Removed */}
      </Tabs>

      {/* User Profile Dialog */}
      {showUserProfile && (
        <Dialog open={!!showUserProfile} onOpenChange={() => setShowUserProfile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                {showUserProfile.type === 'student' ? 'Student' : 'Tutor'} details and information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {showUserProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{showUserProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{showUserProfile.email}</p>
                  <div className="mt-2">
                    {getStatusBadge(showUserProfile.status)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{showUserProfile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(showUserProfile.joinDate).toLocaleDateString()}</p>
                </div>
                {showUserProfile.type === 'student' ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Sessions</p>
                      <p className="font-medium">{showUserProfile.sessions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                      <p className="font-medium">{showUserProfile.totalSpent}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Activity Score</p>
                      <p className={cn("font-medium", getActivityScoreColor(showUserProfile.activityScore))}>
                        {showUserProfile.activityScore}%
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{showUserProfile.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">{showUserProfile.rating || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{showUserProfile.students}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="font-medium">{showUserProfile.totalEarnings}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserProfile(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.isOpen} onOpenChange={(open) => !open && setActionDialog({ isOpen: false, action: null, userId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'suspend' && 'Are you sure you want to suspend this user? They will not be able to access the platform.'}
              {actionDialog.action === 'reactivate' && 'Are you sure you want to reactivate this user? They will regain access to the platform.'}
              {actionDialog.action === 'ban' && 'Are you sure you want to permanently ban this user? This action cannot be undone.'}
              {actionDialog.action === 'verify' && 'Are you sure you want to verify this tutor? They will be able to create sessions.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. This will create a user account in Clerk and sync with the database.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="user@example.com"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-username">Username *</Label>
              <Input
                id="create-username"
                type="text"
                placeholder="johndoe"
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="••••••••"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role *</Label>
              <Select
                value={newUserForm.role}
                onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
              >
                <SelectTrigger id="create-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="tutor">Tutor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateUserDialog(false);
                setNewUserForm({ email: '', username: '', password: '', role: 'student' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={createUserMutation.isLoading}
            >
              {createUserMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUserDialog} onOpenChange={(open) => !open && setEditUserDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Changes will be synced with Clerk.
            </DialogDescription>
          </DialogHeader>
          {editUserDialog && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  type="text"
                  placeholder="johndoe"
                  value={editUserForm.username}
                  onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="user@example.com"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editUserForm.role}
                  onValueChange={(value) => setEditUserForm({ ...editUserForm, role: value })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                <p>Current User ID: {editUserDialog._id}</p>
                <p>Clerk ID: {editUserDialog.clerkUserId}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUserDialog(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isLoading}
            >
              {updateUserMutation.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementShadcn;
