import React, { useEffect, useState } from 'react';
import { Save, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/card';
import { Button } from '../../components/Button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { getAppSettings, updateAppSettings } from '../../services/adminApi';

const initialState = {
  siteName: 'Kuppi.lk',
  logoUrl: '',
  defaultTimezone: 'Asia/Colombo',
  defaultLanguage: 'en',
  emailFromName: 'Kuppi',
  emailFromAddress: 'support@kuppi.lk',
  maintenanceMode: false,
  notifications: {
    systemEmailEnabled: true
  }
};

const AdminSettingsBasicShadcn = () => {
  const [settings, setSettings] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getAppSettings();
      if (response?.data?.data) {
        setSettings({
          ...initialState,
          ...response.data.data,
          notifications: {
            ...initialState.notifications,
            ...(response.data.data.notifications || {})
          }
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAppSettings(settings);
      toast.success('Admin settings updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Basic Admin Settings
          </CardTitle>
          <CardDescription>
            First-phase simple configuration for platform branding and system behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logoUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Input
                    id="defaultTimezone"
                    value={settings.defaultTimezone}
                    onChange={(e) => setSettings((prev) => ({ ...prev, defaultTimezone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <select
                    id="defaultLanguage"
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings((prev) => ({ ...prev, defaultLanguage: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="en">English</option>
                    <option value="si">Sinhala</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFromName">Email Sender Name</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, emailFromName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFromAddress">Email Sender Address</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={settings.emailFromAddress}
                    onChange={(e) => setSettings((prev) => ({ ...prev, emailFromAddress: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily limit platform access.</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemEmailEnabled">System Emails</Label>
                    <p className="text-xs text-muted-foreground">Enable platform-level email notifications.</p>
                  </div>
                  <Switch
                    id="systemEmailEnabled"
                    checked={settings.notifications.systemEmailEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          systemEmailEnabled: checked
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsBasicShadcn;
