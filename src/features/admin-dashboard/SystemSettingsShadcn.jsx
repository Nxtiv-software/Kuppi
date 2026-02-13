import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  BookOpen,
  Shield,
  Save,
  Globe,
  Clock,
  Percent,
  Users,
  Lock,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { cn } from '../../utils/utils';

const SystemSettingsShadcn = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Kuppi.lk',
    supportEmail: 'support@kuppi.lk',
    timezone: 'Asia/Colombo',
    currency: 'LKR',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true
  });

  const [feeSettings, setFeeSettings] = useState({
    platformFee: 12,
    paymentProcessingFee: 2.5,
    minimumSessionPrice: 100,
    maximumSessionPrice: 10000,
    tutorPayoutSchedule: 'weekly',
    autoPayoutEnabled: true
  });

  const [sessionSettings, setSessionSettings] = useState({
    minimumDuration: 30,
    maximumDuration: 180,
    minimumStudents: 1,
    maximumStudents: 100,
    cancellationWindow: 24,
    autoApproval: false,
    requireDocuments: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelisting: false,
    dataEncryption: true,
    auditLogging: true
  });

  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully');
  };

  const handleSaveFees = () => {
    toast.success('Service fee settings saved successfully');
  };

  const handleSaveSession = () => {
    toast.success('Session rules saved successfully');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platform Status</p>
                <p className="text-lg font-bold">
                  {generalSettings.maintenanceMode ? 'Maintenance' : 'Online'}
                </p>
              </div>
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                generalSettings.maintenanceMode ? "bg-orange-100 dark:bg-orange-950" : "bg-green-100 dark:bg-green-950"
              )}>
                <Globe className={cn(
                  "h-6 w-6",
                  generalSettings.maintenanceMode ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Service Fee</p>
                <p className="text-lg font-bold">{feeSettings.platformFee}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Percent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Level</p>
                <p className="text-lg font-bold">
                  {securitySettings.twoFactorAuth ? 'High' : 'Standard'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto Approval</p>
                <p className="text-lg font-bold">
                  {sessionSettings.autoApproval ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="fees">Service Fees</TabsTrigger>
          <TabsTrigger value="session-rules">Session Rules</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Platform Settings</CardTitle>
              <CardDescription>Configure basic platform information and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={generalSettings.platformName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Asia/Colombo">Asia/Colombo (Sri Lanka)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (India)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="LKR">LKR (Sri Lankan Rupee)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Platform Features</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to disable user access for maintenance
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registrationEnabled">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch
                    id="registrationEnabled"
                    checked={generalSettings.registrationEnabled}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, registrationEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailVerification">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch
                    id="emailVerification"
                    checked={generalSettings.emailVerification}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, emailVerification: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button className="gap-2" onClick={handleSaveGeneral}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Fees Tab */}
        <TabsContent value="fees" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Fee Configuration</CardTitle>
              <CardDescription>Manage platform fees and payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">Platform Service Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={feeSettings.platformFee}
                    onChange={(e) => setFeeSettings({ ...feeSettings, platformFee: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Current fee: {feeSettings.platformFee}% of session price
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentProcessingFee">Payment Processing Fee (%)</Label>
                  <Input
                    id="paymentProcessingFee"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={feeSettings.paymentProcessingFee}
                    onChange={(e) => setFeeSettings({ ...feeSettings, paymentProcessingFee: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Gateway charges: {feeSettings.paymentProcessingFee}%
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Session Pricing Limits</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumSessionPrice">Minimum Session Price (LKR)</Label>
                    <Input
                      id="minimumSessionPrice"
                      type="number"
                      min="0"
                      value={feeSettings.minimumSessionPrice}
                      onChange={(e) => setFeeSettings({ ...feeSettings, minimumSessionPrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximumSessionPrice">Maximum Session Price (LKR)</Label>
                    <Input
                      id="maximumSessionPrice"
                      type="number"
                      min="0"
                      value={feeSettings.maximumSessionPrice}
                      onChange={(e) => setFeeSettings({ ...feeSettings, maximumSessionPrice: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Payout Settings</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="tutorPayoutSchedule">Tutor Payout Schedule</Label>
                  <select
                    id="tutorPayoutSchedule"
                    value={feeSettings.tutorPayoutSchedule}
                    onChange={(e) => setFeeSettings({ ...feeSettings, tutorPayoutSchedule: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoPayoutEnabled">Automatic Payouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process tutor payouts on schedule
                    </p>
                  </div>
                  <Switch
                    id="autoPayoutEnabled"
                    checked={feeSettings.autoPayoutEnabled}
                    onCheckedChange={(checked) => setFeeSettings({ ...feeSettings, autoPayoutEnabled: checked })}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Fee Calculation Example</p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Session price: Rs. 1,000 → Platform fee ({feeSettings.platformFee}%): Rs. {(1000 * feeSettings.platformFee / 100).toFixed(2)} → 
                      Tutor receives: Rs. {(1000 * (1 - feeSettings.platformFee / 100)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button className="gap-2" onClick={handleSaveFees}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Rules Tab */}
        <TabsContent value="session-rules" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Rules & Requirements</CardTitle>
              <CardDescription>Configure session creation and management rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Duration Limits</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumDuration">Minimum Duration (minutes)</Label>
                    <Input
                      id="minimumDuration"
                      type="number"
                      min="15"
                      step="15"
                      value={sessionSettings.minimumDuration}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, minimumDuration: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximumDuration">Maximum Duration (minutes)</Label>
                    <Input
                      id="maximumDuration"
                      type="number"
                      min="30"
                      step="15"
                      value={sessionSettings.maximumDuration}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, maximumDuration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Student Capacity</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumStudents">Minimum Students</Label>
                    <Input
                      id="minimumStudents"
                      type="number"
                      min="1"
                      value={sessionSettings.minimumStudents}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, minimumStudents: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximumStudents">Maximum Students</Label>
                    <Input
                      id="maximumStudents"
                      type="number"
                      min="1"
                      value={sessionSettings.maximumStudents}
                      onChange={(e) => setSessionSettings({ ...sessionSettings, maximumStudents: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Cancellation & Approval</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                  <Input
                    id="cancellationWindow"
                    type="number"
                    min="0"
                    value={sessionSettings.cancellationWindow}
                    onChange={(e) => setSessionSettings({ ...sessionSettings, cancellationWindow: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Students must cancel at least {sessionSettings.cancellationWindow} hours before the session
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoApproval">Auto-Approve Sessions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve tutor session requests
                    </p>
                  </div>
                  <Switch
                    id="autoApproval"
                    checked={sessionSettings.autoApproval}
                    onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, autoApproval: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireDocuments">Require Documents</Label>
                    <p className="text-sm text-muted-foreground">
                      Tutors must upload verification documents
                    </p>
                  </div>
                  <Switch
                    id="requireDocuments"
                    checked={sessionSettings.requireDocuments}
                    onCheckedChange={(checked) => setSessionSettings({ ...sessionSettings, requireDocuments: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button className="gap-2" onClick={handleSaveSession}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Privacy Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy Settings</CardTitle>
              <CardDescription>Configure security policies and data protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Authentication</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      min="0"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Account will be locked after {securitySettings.loginAttempts} failed attempts
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Data Protection</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataEncryption">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt sensitive data at rest and in transit
                    </p>
                  </div>
                  <Switch
                    id="dataEncryption"
                    checked={securitySettings.dataEncryption}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, dataEncryption: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auditLogging">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all administrative actions
                    </p>
                  </div>
                  <Switch
                    id="auditLogging"
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ipWhitelisting">IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    id="ipWhitelisting"
                    checked={securitySettings.ipWhitelisting}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelisting: checked })}
                  />
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-300">Security Warning</p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Disabling security features may expose the platform to risks. Only modify these settings if you understand the implications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Default</Button>
                <Button className="gap-2" onClick={handleSaveSecurity}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettingsShadcn;
