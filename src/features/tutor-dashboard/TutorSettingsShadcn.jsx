import React, { useEffect, useMemo, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/card';
import { Button } from '../../components/Button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { getMySettings, updateMySettings } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';
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
  tutor: {
    subjects: [],
    availability: [],
    profileVisibility: 'public',
    sessionPrice: 0
  }
};

const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const TutorSettingsShadcn = () => {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState(initialState);
  const [subjectsInput, setSubjectsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedAvailabilityDays = useMemo(
    () => new Set((settings.tutor.availability || []).map((slot) => slot.day)),
    [settings.tutor.availability]
  );

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
          tutor: {
            ...initialState.tutor,
            ...(response.data.data.settings.tutor || {})
          },
          preferredContactMethod: response.data.data.settings.preferredContactMethod || 'email'
        };
        setSettings(merged);
        if (merged.theme) {
          setTheme(merged.theme);
        }
        setSubjectsInput((merged.tutor.subjects || []).join(', '));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load tutor settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const queryClient = useQueryClient();

  const toggleDay = (day) => {
    setSettings((prev) => {
      const exists = prev.tutor.availability.some((slot) => slot.day === day);
      const availability = exists
        ? prev.tutor.availability.filter((slot) => slot.day !== day)
        : [...prev.tutor.availability, { day, start: '18:00', end: '20:00' }];

      return {
        ...prev,
        tutor: {
          ...prev.tutor,
          availability
        }
      };
    });
  };

  const handleSave = async () => {
    const subjects = subjectsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      timezone: settings.timezone,
      language: settings.language,
      theme: settings.theme,
      preferredContactMethod: settings.preferredContactMethod,
      notifications: settings.notifications,
      tutor: {
        ...settings.tutor,
        subjects
      }
    };

    try {
      setSaving(true);
      await updateMySettings(payload);
      setTheme(settings.theme);
      // refresh my settings cache so other components see changes immediately
      try { queryClient.invalidateQueries(['mySettings']); } catch (e) { /* ignore */ }
      toast.success('Tutor settings updated');
    } catch (error) {
      toast.error(error.message || 'Failed to save tutor settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Tutor Settings
        </CardTitle>
        <CardDescription>
          Manage your basic tutor preferences for schedule visibility and notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tutorTimezone">Timezone</Label>
                <Input
                  id="tutorTimezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, timezone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tutorLanguage">Language</Label>
                <select
                  id="tutorLanguage"
                  value={settings.language}
                  onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="si">Sinhala</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tutorTheme">Theme</Label>
                <select
                  id="tutorTheme"
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
              <Label htmlFor="subjectsInput">Subjects (comma separated)</Label>
              <Input
                id="subjectsInput"
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="Combined Maths, Physics"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionPrice">Session Price (per hour)</Label>
              <Input
                id="sessionPrice"
                type="number"
                min={0}
                max={100000}
                step={0.01}
                value={settings.tutor.sessionPrice}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    tutor: {
                      ...prev.tutor,
                      sessionPrice: Number(e.target.value || 0)
                    }
                  }))
                }
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Price per hour for your tutoring sessions.
              </p>
            </div>

            <div className="space-y-3 border rounded-md p-4">
              <Label>Available Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekdays.map((day) => (
                  <label key={day} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedAvailabilityDays.has(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
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
                <Label htmlFor="tutorVisibility">Profile Visibility</Label>
                <select
                  id="tutorVisibility"
                  value={settings.tutor.profileVisibility}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      tutor: {
                        ...prev.tutor,
                        profileVisibility: e.target.value
                      }
                    }))
                  }
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="tutorEmailNotifications">Email Notifications</Label>
                <Switch
                  id="tutorEmailNotifications"
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
                <Label htmlFor="tutorPushNotifications">Push Notifications</Label>
                <Switch
                  id="tutorPushNotifications"
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

export default TutorSettingsShadcn;
