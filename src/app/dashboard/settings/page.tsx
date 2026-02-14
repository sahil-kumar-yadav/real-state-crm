"use client";

import { useState } from "react";
import { FiSave as Save } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Real Estate CRM",
    email: "admin@recrm.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    timezone: "UTC",
    language: "English",
    theme: "light",
    notificationsEmail: true,
    notificationsWeb: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your account and application settings</p>
      </div>

      {/* Company Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="input-base w-full"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="input-base w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="input-base w-full"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="input-base w-full"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="input-base w-full"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === "light"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Light</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === "dark"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Dark</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={settings.theme === "auto"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Auto</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="notificationsEmail"
              checked={settings.notificationsEmail}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm text-gray-700">
              Send email notifications
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="notificationsWeb"
              checked={settings.notificationsWeb}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm text-gray-700">
              Send web notifications
            </span>
          </label>
        </div>
      </div>

      {/* Account Management */}
      <div className="card border-red-200 bg-red-50">
        <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 text-left rounded-lg border border-red-300 text-red-700 hover:bg-red-100 transition">
            Reset Password
          </button>
          <button className="w-full px-4 py-2 text-left rounded-lg border border-red-300 text-red-700 hover:bg-red-100 transition">
            Download My Data
          </button>
          <button className="w-full px-4 py-2 text-left rounded-lg border border-red-300 text-red-700 hover:bg-red-100 transition">
            Delete Account
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => toast.success("Changes discarded")}
          className="btn-secondary px-6 py-2"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
