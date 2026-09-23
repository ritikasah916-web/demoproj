import React from 'react';
import { Link } from 'react-router-dom';
import { useModelStore } from '../store/modelStore';
import { useAuthStore } from '../store/authStore';
import {
  Box,
  Wand2,
  Clock,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import ModelPreview from '../three/ModelPreview';
import { Suspense } from 'react';

export default function DashboardPage() {
  const { models } = useModelStore();
  const { user } = useAuthStore();

  const recentModels = models.slice(0, 4);
  const totalModels = models.length;
  const completedModels = models.filter((m) => m.generationStatus === 'completed').length;

  const stats = [
    { label: 'Total Models', value: totalModels, icon: Box, color: 'from-indigo-500 to-blue-500' },
    { label: 'Completed', value: completedModels, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Categories', value: new Set(models.map((m) => m.category)).size, icon: FolderOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'This Week', value: models.filter((m) => {
      const d = new Date(m.createdAt);
      const now = new Date();
      return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length, icon: Clock, color: 'from-orange-500 to-red-500' },
  ];

  const geometryMap: Record<string, string> = {
    character: 'torus',
    vehicle: 'box',
    building: 'cylinder',
    furniture: 'dodecahedron',
    nature: 'icosahedron',
    abstract: 'torus',
    weapon: 'cone',
    prop: 'octahedron',
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name || 'Creator'} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your 3D models.</p>
        </div>
        <Link
          to="/generator"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          New Model
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/generator"
          className="group bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <Wand2 className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Generate New Model</h3>
              <p className="text-sm text-gray-400">Create 3D models from text descriptions</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/models"
          className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Browse Models</h3>
              <p className="text-sm text-gray-400">View and manage your 3D collection</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Recent Models */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Models</h2>
          {models.length > 0 && (
            <Link to="/models" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentModels.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No models yet</h3>
            <p className="text-gray-400 mb-6">Create your first 3D model to get started</p>
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <Wand2 className="w-5 h-5" />
              Generate Model
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentModels.map((model) => (
              <Link
                key={model.id}
                to={`/editor/${model.id}`}
                className="group bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all"
              >
                <div className="h-40 bg-gray-800/50">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  }>
                    <ModelPreview
                      geometry={geometryMap[model.category] || 'torus'}
                      color={model.metadata.color}
                      metalness={model.metadata.complexity / 10}
                      roughness={0.3}
                      autoRotate={true}
                      scale={0.8}
                    />
                  </Suspense>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                    {model.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{model.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
