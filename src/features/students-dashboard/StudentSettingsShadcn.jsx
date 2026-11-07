import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/card';
import { Button } from '../../components/Button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { getMySettings, updateMySettings } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const initialState = {
  timezone: 'Asia/Colombo',
  language: 'en',
  theme: 'system',
  preferredContactMethod: 'email',
  notifications: {
    email: true,
    push: true,
    reminders: true
  },
  student: {
    defaultReminderOffsetMinutes: 1440,
    learningGoals: []
  }
};

const StudentSettingsShadcn = () => {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getMySettings();
      if (response?.data?.data?.settings) {
        const merged = {
          ...initialState,
          ...response.data.data.settings,
          notifications: {
            ...initialState.notifications,
            ...(response.data.data.settings.notifications || {})
          },
          student: {
            ...initialState.student,
            ...(response.data.data.settings.student || {})
          },
          preferredContactMethod: response.data.data.settings.preferredContactMethod || 'email'
        };
        setSettings(merged);
        if (merged.theme) {
          setTheme(merged.theme);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load student settings');
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
      await updateMySettings({
        timezone: settings.timezone,
        language: settings.language,
        theme: settings.theme,
        preferredContactMethod: settings.preferredContactMethod,
        notifications: settings.notifications,
        student: settings.student
      });
      setTheme(settings.theme);
      toast.success('Student settings updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Student Settings
        </CardTitle>
        <CardDescription>
          Configure your learning preferences and reminder behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentTimezone">Timezone</Label>
                <Input
                  id="studentTimezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentLanguage">Language</Label>
                <select
                  id="studentLanguage"
                  value={settings.language}
                  onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentTheme">Theme</Label>
                <select
                  id="studentTheme"
                  value={settings.theme}
                  onChange={(e) => {
                    const selectedTheme = e.target.value;
                    setSettings((prev) => ({ ...prev, theme: selectedTheme }));
                    setTheme(selectedTheme);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoals">Learning Goals (comma separated)</Label>
              <Input
                id="learningGoals"
                type="text"
                value={(settings.student.learningGoals || []).join(', ')}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    student: {
                      ...prev.student,
                      learningGoals: e.target.value
                        .split(',')
                        .map(g => g.trim())
                        .filter(Boolean)
                    }
                  }))
                }
                placeholder="e.g., Complete Algebra, Learn Calculus"
              />
              <p className="text-xs text-muted-foreground">
                Enter your learning goals separated by commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultReminderOffsetMinutes">Default Reminder Offset (minutes)</Label>
              <Input
                id="defaultReminderOffsetMinutes"
                type="number"
                min={0}
                max={10080}
                value={settings.student.defaultReminderOffsetMinutes}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    student: {
                      ...prev.student,
                      defaultReminderOffsetMinutes: Number(e.target.value || 0)
                    }
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Example: 1440 = 24 hours before a session.
              </p>
            </div>

            <div className="space-y-3 border rounded-md p-4">
              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <select
                  id="preferredContactMethod"
                  value={settings.preferredContactMethod}
                  onChange={(e) => setSettings((prev) => ({ ...prev, preferredContactMethod: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="border-t pt-3"></div>

              <div className="flex items-center justify-between">
                <Label htmlFor="studentEmailNotifications">Email Notifications</Label>
                <Switch
                  id="studentEmailNotifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        email: checked
                      }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="studentPushNotifications">Push Notifications</Label>
                <Switch
                  id="studentPushNotifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        push: checked
                      }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="studentReminderNotifications">Reminder Notifications</Label>
                <Switch
                  id="studentReminderNotifications"
                  checked={settings.notifications.reminders}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        reminders: checked
                      }
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSettingsShadcn;
