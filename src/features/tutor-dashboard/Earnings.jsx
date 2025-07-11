import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Eye,
  CreditCard
} from 'lucide-react';

const earningsData = {
  thisMonth: 45000,
  lastMonth: 38500,
  thisYear: 420000,
  totalEarnings: 1250000,
  pendingPayouts: 12500,
  nextPayout: '2024-07-01'
};

const recentTransactions = [
  {
    id: 1,
    sessionTitle: 'Data Structures & Algorithms',
    date: '2024-06-25',
    students: 15,
    amount: 4500,
    status: 'paid',
    type: 'session'
  },
  {
    id: 2,
    sessionTitle: 'Database Systems',
    date: '2024-06-23',
    students: 12,
    amount: 3600,
    status: 'paid',
    type: 'session'
  },
  {
    id: 3,
    sessionTitle: 'Machine Learning Basics',
    date: '2024-06-20',
    students: 18,
    amount: 5400,
    status: 'pending',
    type: 'session'
  },
  {
    id: 4,
    sessionTitle: 'Web Development',
    date: '2024-06-18',
    students: 22,
    amount: 5500,
    status: 'paid',
    type: 'session'
  },
  {
    id: 5,
    sessionTitle: 'Object Oriented Programming',
    date: '2024-06-15',
    students: 8,
    amount: 2400,
    status: 'paid',
    type: 'session'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Earnings = () => {
  const growthPercentage = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h2>
          <p className="text-gray-600">Track your income and payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Payout Settings
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {earningsData.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +{growthPercentage}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {(earningsData.thisYear / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              6 months of teaching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {earningsData.pendingPayouts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Next: {new Date(earningsData.nextPayout).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {(earningsData.totalEarnings / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Since joining platform
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Earnings chart visualization</p>
              <p className="text-sm">Would be implemented with recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{transaction.sessionTitle}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    <span>{transaction.students} students</span>
                    <span>Session Payment</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                  
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      Rs. {transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rs. {Math.round(transaction.amount / transaction.students)}/student
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button variant="outline">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Payment Schedule</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payout Frequency:</span>
                  <span className="font-medium">Weekly</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Payout:</span>
                  <span className="font-medium">{new Date(earningsData.nextPayout).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Payment Method</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Bank Account:</span>
                  <span className="font-medium">****1234</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank:</span>
                  <span className="font-medium">Commercial Bank</span>
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Update Payment Method
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
