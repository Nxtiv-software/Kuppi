import React, { useState } from 'react';
import {
  Search,
  Download,
  Eye,
  UserCog,
  Ban,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
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

const UserManagementShadcn = ({ setActiveTab }) => {
  const [activeUserTab, setActiveUserTab] = useState('students');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserProfile, setShowUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionDialog, setActionDialog] = useState({ isOpen: false, action: null, userId: null });

  const students = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      joinDate: '2024-01-15', 
      status: 'active', 
      sessions: 12,
      phone: '+94 77 123 4567',
      lastActive: '2024-10-14',
      totalSpent: 'Rs. 25,000',
      favoriteSubjects: ['Mathematics', 'Physics'],
      activityScore: 85
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      joinDate: '2024-02-20', 
      status: 'active', 
      sessions: 8,
      phone: '+94 77 234 5678',
      lastActive: '2024-10-15',
      totalSpent: 'Rs. 18,500',
      favoriteSubjects: ['Chemistry', 'Biology'],
      activityScore: 92
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike@example.com', 
      joinDate: '2024-01-10', 
      status: 'suspended', 
      sessions: 3,
      phone: '+94 77 345 6789',
      lastActive: '2024-09-20',
      totalSpent: 'Rs. 5,200',
      favoriteSubjects: ['Mathematics'],
      activityScore: 45,
      suspendedReason: 'Violation of community guidelines'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah@example.com', 
      joinDate: '2024-03-05', 
      status: 'active', 
      sessions: 15,
      phone: '+94 77 456 7890',
      lastActive: '2024-10-15',
      totalSpent: 'Rs. 32,000',
      favoriteSubjects: ['Physics', 'Mathematics', 'Chemistry'],
      activityScore: 96
    }
  ];

  const tutors = [
    { 
      id: 1, 
      name: 'Dr. Robert Chen', 
      email: 'robert@example.com', 
      subject: 'Mathematics', 
      rating: 4.8, 
      students: 45, 
      status: 'verified',
      phone: '+94 77 567 8901',
      joinDate: '2024-01-05',
      qualifications: 'PhD Mathematics, University of Colombo',
      experience: '8 years',
      totalEarnings: 'Rs. 185,000',
      completionRate: 98,
      responseTime: '2 minutes'
    },
    { 
      id: 2, 
      name: 'Prof. Lisa Anderson', 
      email: 'lisa@example.com', 
      subject: 'Physics', 
      rating: 4.7, 
      students: 38, 
      status: 'verified',
      phone: '+94 77 678 9012',
      joinDate: '2024-01-12',
      qualifications: 'MSc Physics, University of Peradeniya',
      experience: '6 years',
      totalEarnings: 'Rs. 142,000',
      completionRate: 95,
      responseTime: '5 minutes'
    },
    { 
      id: 3, 
      name: 'Mr. David Brown', 
      email: 'david@example.com', 
      subject: 'Chemistry', 
      rating: 0, 
      students: 0, 
      status: 'pending',
      phone: '+94 77 789 0123',
      joinDate: '2024-10-10',
      qualifications: 'BSc Chemistry, University of Moratuwa',
      experience: '4 years',
      totalEarnings: 'Rs. 0',
      completionRate: 0,
      responseTime: 'N/A'
    },
    { 
      id: 4, 
      name: 'Ms. Emily Davis', 
      email: 'emily@example.com', 
      subject: 'Biology', 
      rating: 4.6, 
      students: 29, 
      status: 'verified',
      phone: '+94 77 890 1234',
      joinDate: '2024-02-15',
      qualifications: 'MSc Biology, University of Sri Jayewardenepura',
      experience: '5 years',
      totalEarnings: 'Rs. 98,000',
      completionRate: 92,
      responseTime: '3 minutes'
    }
  ];

  const handleUserAction = (action, userId) => {
    setActionDialog({ isOpen: true, action, userId });
  };

  const confirmAction = () => {
    const { action, userId } = actionDialog;
    
    switch(action) {
      case 'suspend':
        toast.success('User suspended successfully');
        break;
      case 'reactivate':
        toast.success('User reactivated successfully');
        break;
      case 'ban':
        toast.success('User banned successfully');
        break;
      case 'verify':
        toast.success('Tutor verified successfully');
        break;
      default:
        break;
    }
    
    setActionDialog({ isOpen: false, action: null, userId: null });
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      <Tabs value={activeUserTab} onValueChange={setActiveUserTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="tutors">Tutors ({tutors.length})</TabsTrigger>
          <TabsTrigger value="roles">Role Assignment</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Management</CardTitle>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Students Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">STUDENT</th>
                        <th className="text-left p-4 font-medium text-sm">CONTACT</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIVITY</th>
                        <th className="text-left p-4 font-medium text-sm">SESSIONS</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {student.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{student.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {student.id} • Joined {new Date(student.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{student.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{student.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={cn("font-semibold", getActivityScoreColor(student.activityScore))}>
                              Score: {student.activityScore}%
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">{student.totalSpent}</div>
                            <div className="text-sm text-muted-foreground">{student.sessions} sessions</div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(student.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...student, type: 'student' })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {student.status === 'active' ? (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                  onClick={() => handleUserAction('suspend', student.id)}
                                  title="Suspend User"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                  onClick={() => handleUserAction('reactivate', student.id)}
                                  title="Reactivate User"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                                onClick={() => handleUserAction('ban', student.id)}
                                title="Ban User"
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
                <CardTitle>Tutor Management</CardTitle>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tutors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Tutors Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="text-left p-4 font-medium text-sm">TUTOR</th>
                        <th className="text-left p-4 font-medium text-sm">SUBJECT</th>
                        <th className="text-left p-4 font-medium text-sm">RATING</th>
                        <th className="text-left p-4 font-medium text-sm">STUDENTS</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTutors.map((tutor) => (
                        <tr key={tutor.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold">
                                  {tutor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{tutor.name}</div>
                                <div className="text-sm text-muted-foreground">{tutor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{tutor.subject}</Badge>
                          </td>
                          <td className="p-4">
                            {tutor.rating > 0 ? (
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-yellow-500" />
                                <span className="font-semibold">{tutor.rating}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No rating</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">{tutor.students} students</div>
                            <div className="text-sm text-muted-foreground">{tutor.totalEarnings}</div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(tutor.status)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => setShowUserProfile({ ...tutor, type: 'tutor' })}
                                title="View Profile"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {tutor.status === 'pending' ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                    onClick={() => handleUserAction('verify', tutor.id)}
                                    title="Verify Tutor"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                                    onClick={() => handleUserAction('reject', tutor.id)}
                                    title="Reject Application"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-8 w-8 p-0"
                                  onClick={() => setShowUserProfile({ ...tutor, type: 'tutor' })}
                                  title="Edit Profile"
                                >
                                  <UserCog className="h-4 w-4" />
                                </Button>
                              )}
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

        {/* Role Assignment Tab */}
        <TabsContent value="roles" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Role assignment functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permissions Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Permissions management functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
    </div>
  );
};

export default UserManagementShadcn;
