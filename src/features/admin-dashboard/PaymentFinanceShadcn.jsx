import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  BarChart3,
  PieChart
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
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';

const PaymentFinanceShadcn = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    {
      id: 'TXN001',
      type: 'payment',
      student: 'John Doe',
      session: 'Advanced Calculus',
      amount: 300,
      status: 'completed',
      date: '2026-02-11',
      time: '10:30 AM',
      paymentMethod: 'Credit Card',
      currency: 'LKR'
    },
    {
      id: 'TXN002',
      type: 'payment',
      student: 'Jane Smith',
      session: 'Organic Chemistry',
      amount: 250,
      status: 'completed',
      date: '2026-02-11',
      time: '09:15 AM',
      paymentMethod: 'Debit Card',
      currency: 'LKR'
    },
    {
      id: 'TXN003',
      type: 'payment',
      student: 'Sarah Wilson',
      session: 'Quantum Physics',
      amount: 350,
      status: 'pending',
      date: '2026-02-11',
      time: '08:45 AM',
      paymentMethod: 'Bank Transfer',
      currency: 'LKR'
    },
    {
      id: 'TXN004',
      type: 'refund',
      student: 'Mike Johnson',
      session: 'Biology Basics',
      amount: 200,
      status: 'processing',
      date: '2026-02-10',
      time: '03:20 PM',
      paymentMethod: 'Credit Card',
      currency: 'LKR'
    },
    {
      id: 'TXN005',
      type: 'payment',
      student: 'Emily Davis',
      session: 'Linear Algebra',
      amount: 280,
      status: 'completed',
      date: '2026-02-10',
      time: '02:10 PM',
      paymentMethod: 'Digital Wallet',
      currency: 'LKR'
    }
  ];

  const tutorPayouts = [
    {
      id: 'PAY001',
      tutor: 'Dr. Robert Chen',
      earnings: 12500,
      sessions: 15,
      status: 'pending',
      dueDate: '2026-02-15',
      bankAccount: '****1234',
      currency: 'LKR'
    },
    {
      id: 'PAY002',
      tutor: 'Prof. Lisa Anderson',
      earnings: 9800,
      sessions: 12,
      status: 'pending',
      dueDate: '2026-02-15',
      bankAccount: '****5678',
      currency: 'LKR'
    },
    {
      id: 'PAY003',
      tutor: 'Ms. Emily Davis',
      earnings: 8400,
      sessions: 10,
      status: 'completed',
      paidDate: '2026-02-08',
      bankAccount: '****9012',
      currency: 'LKR'
    },
    {
      id: 'PAY004',
      tutor: 'Mr. David Brown',
      earnings: 6500,
      sessions: 8,
      status: 'completed',
      paidDate: '2026-02-08',
      bankAccount: '****3456',
      currency: 'LKR'
    }
  ];

  const refundRequests = [
    {
      id: 'REF001',
      student: 'Mike Johnson',
      session: 'Biology Basics',
      amount: 200,
      reason: 'Session cancelled by tutor',
      status: 'pending',
      requestDate: '2026-02-10',
      currency: 'LKR'
    },
    {
      id: 'REF002',
      student: 'Alex Brown',
      session: 'Physics Fundamentals',
      amount: 180,
      reason: 'Technical issues during session',
      status: 'approved',
      requestDate: '2026-02-09',
      approvedDate: '2026-02-10',
      currency: 'LKR'
    },
    {
      id: 'REF003',
      student: 'Maria Garcia',
      session: 'Chemistry Lab',
      amount: 220,
      reason: 'Duplicate payment',
      status: 'completed',
      requestDate: '2026-02-08',
      completedDate: '2026-02-09',
      currency: 'LKR'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      completed: { className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300', label: 'Completed' },
      pending: { className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', label: 'Pending' },
      processing: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300', label: 'Processing' },
      approved: { className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', label: 'Approved' },
      failed: { className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', label: 'Failed' }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (amount, currency = 'LKR') => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.session.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rs. 234,500</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">Rs. 45,200</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-600">2 tutors</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Service Fee</p>
                <p className="text-2xl font-bold">Rs. 28,140</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600">12%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refunds</p>
                <p className="text-2xl font-bold">Rs. 3,200</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">3 requests</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Tutor Payouts</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Transactions</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">TRANSACTION ID</th>
                        <th className="text-left p-4 font-medium text-sm">STUDENT</th>
                        <th className="text-left p-4 font-medium text-sm">SESSION</th>
                        <th className="text-left p-4 font-medium text-sm">AMOUNT</th>
                        <th className="text-left p-4 font-medium text-sm">PAYMENT METHOD</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">DATE</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="font-mono text-sm font-semibold">{tx.id}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{tx.student}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{tx.session}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              {tx.type === 'payment' ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                              )}
                              <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{tx.paymentMethod}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(tx.status)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{formatDate(tx.date)}</div>
                            <div className="text-xs text-muted-foreground">{tx.time}</div>
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedTransaction(tx)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

        {/* Tutor Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tutor Payouts</CardTitle>
                <Button className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Process Pending Payouts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutorPayouts.map((payout) => (
                  <Card key={payout.id} className={cn(
                    "border-l-4",
                    payout.status === 'pending' ? "border-l-orange-500" : "border-l-green-500"
                  )}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{payout.tutor}</h3>
                            {getStatusBadge(payout.status)}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Earnings</p>
                              <p className="font-semibold text-lg">{formatCurrency(payout.earnings)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sessions</p>
                              <p className="font-medium">{payout.sessions} sessions</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                {payout.status === 'pending' ? 'Due Date' : 'Paid Date'}
                              </p>
                              <p className="font-medium">
                                {formatDate(payout.status === 'pending' ? payout.dueDate : payout.paidDate)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            Bank Account: {payout.bankAccount}
                          </div>
                        </div>
                        {payout.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Process Payout
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refundRequests.map((refund) => (
                  <Card key={refund.id} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold">{refund.student}</h3>
                            {getStatusBadge(refund.status)}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Session</p>
                              <p className="font-medium">{refund.session}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Amount</p>
                              <p className="font-semibold text-lg text-red-600">{formatCurrency(refund.amount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Request Date</p>
                              <p className="font-medium">{formatDate(refund.requestDate)}</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">Reason:</p>
                            <p>{refund.reason}</p>
                          </div>
                        </div>
                        {refund.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-2">
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Credit Card</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Debit Card</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Bank Transfer</span>
                    <span className="text-sm text-muted-foreground">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Digital Wallet</span>
                    <span className="text-sm text-muted-foreground">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Student Payments</p>
                    <p className="text-xl font-bold">Rs. 206,360</p>
                  </div>
                  <div className="text-green-600 text-sm font-medium">88%</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Service Fees</p>
                    <p className="text-xl font-bold">Rs. 28,140</p>
                  </div>
                  <div className="text-blue-600 text-sm font-medium">12%</div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold">Rs. 234,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Detailed analytics charts coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>Transaction ID: {selectedTransaction.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student</p>
                  <p className="font-medium">{selectedTransaction.student}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Session</p>
                  <p className="font-medium">{selectedTransaction.session}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{formatDate(selectedTransaction.date)} at {selectedTransaction.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Type</p>
                  <p className="font-medium capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{selectedTransaction.currency}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentFinanceShadcn;
