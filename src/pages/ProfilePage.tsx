import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useModelStore } from '../store/modelStore';
import {
  User,
  Mail,
  Calendar,
  Box,
  Save,
  Camera,
  Shield,
  Bell,
  Palette,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { models } = useModelStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: 'Total Models', value: models.length, icon: Box },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', icon: Calendar },
    { label: 'Categories Used', value: new Set(models.map((m) => m.category)).size, icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-900">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <button className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Change Avatar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-800/30 rounded-xl p-4 text-center">
                <stat.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-400 animate-pulse">✓ Changes saved!</span>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          Preferences
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Email notifications', desc: 'Receive updates about your models', enabled: true },
            { label: 'Generation alerts', desc: 'Get notified when models finish generating', enabled: true },
            { label: 'Marketing emails', desc: 'Receive tips and product updates', enabled: false },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{pref.label}</p>
                <p className="text-xs text-gray-400">{pref.desc}</p>
              </div>
              <button
                className={`w-11 h-6 rounded-full transition-all ${
                  pref.enabled ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                    pref.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Security
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Change Password</p>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
            <button className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-colors">
              Update
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-800/50">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-sm text-indigo-400 hover:bg-indigo-500/30 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
