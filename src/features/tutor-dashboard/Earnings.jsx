import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';

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
    status: 'paid'
  },
  {
    id: 2,
    sessionTitle: 'Database Systems',
    date: '2024-06-23',
    students: 12,
    amount: 3600,
    status: 'paid'
  },
  {
    id: 3,
    sessionTitle: 'Machine Learning Basics',
    date: '2024-06-20',
    students: 18,
    amount: 5400,
    status: 'pending'
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
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payout Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {earningsData.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{growthPercentage}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
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
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
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
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {(earningsData.totalEarnings / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              Since joining platform
            </p>
          </CardContent>
        </Card>
      </div>

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
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
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