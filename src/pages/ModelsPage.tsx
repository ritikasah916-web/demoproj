import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useModelStore } from '../store/modelStore';
import ModelPreview from '../three/ModelPreview';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Trash2,
  Edit3,
  MoreVertical,
  Box,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { ModelCategory } from '../types';

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'character', label: 'Character' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'building', label: 'Building' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'nature', label: 'Nature' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'prop', label: 'Prop' },
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

export default function ModelsPage() {
  const {
    models,
    deleteModel,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    getFilteredModels,
  } = useModelStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredModels = getFilteredModels();

  const handleDelete = (id: string) => {
    deleteModel(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Models</h1>
          <p className="text-gray-400 text-sm mt-1">{models.length} models in your collection</p>
        </div>
        <Link
          to="/generator"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Box className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-gray-800/50 rounded-xl px-4 py-2.5 border border-gray-700/50">
          <Search className="w-4 h-4 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-2 ${
              showFilters || filterCategory !== 'all'
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-gray-300 px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-900/50 border border-gray-800/50 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterCategory === cat.value
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Models Grid/List */}
      {filteredModels.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {models.length === 0 ? 'No models yet' : 'No models found'}
          </h3>
          <p className="text-gray-400">
            {models.length === 0
              ? 'Generate your first 3D model to see it here'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="group bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all"
            >
              <div className="h-44 bg-gray-800/50 relative">
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
                    scale={0.7}
                  />
                </Suspense>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/editor/${model.id}`}
                    className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white border border-gray-700/50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(model.id)}
                    className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-red-400 border border-gray-700/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <Link to={`/editor/${model.id}`} className="p-4 block">
                <h3 className="font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                  {model.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-md text-gray-400 capitalize">
                    {model.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(model.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800/50 rounded-xl hover:border-indigo-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <Box className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/editor/${model.id}`} className="font-medium text-white hover:text-indigo-400 transition-colors truncate block">
                  {model.name}
                </Link>
                <p className="text-xs text-gray-400 truncate">{model.prompt}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-800 rounded-md text-gray-400 capitalize hidden md:block">
                {model.category}
              </span>
              <span className="text-xs text-gray-500 hidden md:block">
                {new Date(model.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-1">
                <Link
                  to={`/editor/${model.id}`}
                  className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteConfirm(model.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Delete Model?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This action cannot be undone. The model will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
