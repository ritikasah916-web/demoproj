import React, { useState, Suspense, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useModelStore } from '../store/modelStore';
import EditorScene from '../three/EditorScene';
import { SceneObject } from '../types';
import {
  ArrowLeft,
  Move,
  RotateCcw,
  Maximize2,
  Grid3X3,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Copy,
  Plus,
  Box,
  Palette,
  Layers,
  ChevronDown,
  Save,
  Undo2,
  Redo2,
} from 'lucide-react';

const shapeTypes = ['box', 'sphere', 'cylinder', 'cone', 'torus', 'torusKnot', 'dodecahedron'];

export default function EditorPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const { models, currentModel, updateModel } = useModelStore();

  const model = currentModel?.id === modelId ? currentModel : models.find((m) => m.id === modelId);

  const [objects, setObjects] = useState<SceneObject[]>(() => {
    if (!model) return [];
    const baseObj: SceneObject = {
      id: 'main',
      type: model.category === 'vehicle' ? 'box' : model.category === 'nature' ? 'sphere' : model.category === 'building' ? 'cylinder' : 'box',
      name: model.name,
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [
          model.metadata.dimensions.x,
          model.metadata.dimensions.y,
          model.metadata.dimensions.z,
        ],
      },
      material: {
        color: model.metadata.color,
        roughness: 0.3,
        metalness: 0.5,
        wireframe: false,
        opacity: 1,
      },
      visible: true,
    };
    return [baseObj];
  });

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('main');
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(true);
  const [history, setHistory] = useState<SceneObject[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  const pushHistory = (newObjects: SceneObject[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newObjects);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setObjects(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setObjects(history[historyIndex + 1]);
    }
  };

  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    const newObjects = objects.map((o) =>
      o.id === id ? { ...o, ...updates } : o
    );
    setObjects(newObjects);
    pushHistory(newObjects);
  };

  const addObject = (type: string) => {
    const newObj: SceneObject = {
      id: `obj-${Date.now()}`,
      type,
      name: `${type} ${objects.length + 1}`,
      transform: {
        position: [Math.random() * 2 - 1, 0, Math.random() * 2 - 1],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      material: {
        color: '#6366f1',
        roughness: 0.3,
        metalness: 0.5,
        wireframe: false,
        opacity: 1,
      },
      visible: true,
    };
    const newObjects = [...objects, newObj];
    setObjects(newObjects);
    pushHistory(newObjects);
    setSelectedObjectId(newObj.id);
  };

  const duplicateObject = (id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    const newObj: SceneObject = {
      ...obj,
      id: `obj-${Date.now()}`,
      name: `${obj.name} (copy)`,
      transform: {
        ...obj.transform,
        position: [
          obj.transform.position[0] + 1,
          obj.transform.position[1],
          obj.transform.position[2],
        ],
      },
    };
    const newObjects = [...objects, newObj];
    setObjects(newObjects);
    pushHistory(newObjects);
    setSelectedObjectId(newObj.id);
  };

  const deleteObject = (id: string) => {
    if (objects.length <= 1) return;
    const newObjects = objects.filter((o) => o.id !== id);
    setObjects(newObjects);
    pushHistory(newObjects);
    if (selectedObjectId === id) {
      setSelectedObjectId(newObjects[0]?.id || null);
    }
  };

  const handleExport = (format: string) => {
    // Simulate export
    const data = {
      model: model?.name,
      objects: objects,
      format: format,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model?.name || 'model'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Box className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Model not found</h2>
        <p className="text-gray-400 mb-6">The model you're looking for doesn't exist.</p>
        <Link
          to="/models"
          className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400 hover:bg-indigo-500/30 transition-colors"
        >
          Back to Models
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-4">
      {/* Left Panel - Scene Hierarchy */}
      {showHierarchy && (
        <div className="w-64 flex-shrink-0 bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Scene Hierarchy</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowHierarchy(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {objects.map((obj) => (
              <div
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  selectedObjectId === obj.id
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                }`}
              >
                <Box className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate flex-1">{obj.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateObject(obj.id, { visible: !obj.visible });
                  }}
                  className="p-0.5 hover:text-white"
                >
                  {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>

          {/* Add Object */}
          <div className="p-3 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 mb-2">Add Shape</p>
            <div className="grid grid-cols-4 gap-1">
              {shapeTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => addObject(type)}
                  className="p-2 bg-gray-800/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
                  title={type}
                >
                  <Box className="w-4 h-4 mx-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Center - 3D Viewport */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800/50 rounded-xl px-4 py-2">
          <button
            onClick={() => navigate('/models')}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-800 mx-1" />

          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-800 mx-1" />

          {/* Transform mode */}
          <div className="flex gap-1">
            {[
              { mode: 'translate' as const, icon: Move, label: 'Move' },
              { mode: 'rotate' as const, icon: RotateCcw, label: 'Rotate' },
              { mode: 'scale' as const, icon: Maximize2, label: 'Scale' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setTransformMode(mode)}
                className={`p-2 rounded-lg transition-all ${
                  transformMode === mode
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-800 mx-1" />

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-all ${
              showGrid ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-lg transition-all ${
              wireframeMode ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Wireframe"
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Export */}
          <div className="flex gap-1">
            {['gltf', 'glb', 'obj'].map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-all flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          }>
            <EditorScene
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
              transformMode={transformMode}
              showGrid={showGrid}
              showAxes={showAxes}
              wireframeMode={wireframeMode}
            />
          </Suspense>

          {/* Viewport info */}
          <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700/50">
            <p className="text-xs text-gray-400">
              Objects: {objects.length} | Vertices: {model.metadata.vertices.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      {selectedObject && (
        <div className="w-72 flex-shrink-0 bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-y-auto">
          <div className="p-4 border-b border-gray-800/50">
            <h3 className="font-semibold text-white text-sm">Properties</h3>
            <p className="text-xs text-gray-400 mt-0.5">{selectedObject.name}</p>
          </div>

          <div className="p-4 space-y-5">
            {/* Transform */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transform</h4>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['x', 'y', 'z'] as const).map((axis, i) => (
                    <div key={axis} className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {axis.toUpperCase()}
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedObject.transform.position[i]}
                        onChange={(e) => {
                          const pos = [...selectedObject.transform.position] as [number, number, number];
                          pos[i] = parseFloat(e.target.value) || 0;
                          updateObject(selectedObject.id, {
                            transform: { ...selectedObject.transform, position: pos },
                          });
                        }}
                        className="w-full pl-7 pr-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Rotation</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['x', 'y', 'z'] as const).map((axis, i) => (
                    <div key={axis} className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {axis.toUpperCase()}
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        value={Number((selectedObject.transform.rotation[i] * (180 / Math.PI)).toFixed(1))}
                        onChange={(e) => {
                          const rot = [...selectedObject.transform.rotation] as [number, number, number];
                          rot[i] = (parseFloat(e.target.value) || 0) * (Math.PI / 180);
                          updateObject(selectedObject.id, {
                            transform: { ...selectedObject.transform, rotation: rot },
                          });
                        }}
                        className="w-full pl-7 pr-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Scale</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['x', 'y', 'z'] as const).map((axis, i) => (
                    <div key={axis} className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                        {axis.toUpperCase()}
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={selectedObject.transform.scale[i]}
                        onChange={(e) => {
                          const scale = [...selectedObject.transform.scale] as [number, number, number];
                          scale[i] = parseFloat(e.target.value) || 1;
                          updateObject(selectedObject.id, {
                            transform: { ...selectedObject.transform, scale },
                          });
                        }}
                        className="w-full pl-7 pr-2 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Material */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3 h-3" /> Material
              </h4>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedObject.material.color}
                    onChange={(e) =>
                      updateObject(selectedObject.id, {
                        material: { ...selectedObject.material, color: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-700"
                  />
                  <input
                    type="text"
                    value={selectedObject.material.color}
                    onChange={(e) =>
                      updateObject(selectedObject.id, {
                        material: { ...selectedObject.material, color: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Roughness: {selectedObject.material.roughness.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.material.roughness}
                  onChange={(e) =>
                    updateObject(selectedObject.id, {
                      material: { ...selectedObject.material, roughness: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Metalness: {selectedObject.material.metalness.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.material.metalness}
                  onChange={(e) =>
                    updateObject(selectedObject.id, {
                      material: { ...selectedObject.material, metalness: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-500">Opacity: {selectedObject.material.opacity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedObject.material.opacity}
                  onChange={(e) =>
                    updateObject(selectedObject.id, {
                      material: { ...selectedObject.material, opacity: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500">Wireframe</label>
                <button
                  onClick={() =>
                    updateObject(selectedObject.id, {
                      material: { ...selectedObject.material, wireframe: !selectedObject.material.wireframe },
                    })
                  }
                  className={`w-10 h-5 rounded-full transition-all ${
                    selectedObject.material.wireframe ? 'bg-indigo-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${
                      selectedObject.material.wireframe ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-800/50">
              <button
                onClick={() => duplicateObject(selectedObject.id)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-all"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={() => deleteObject(selectedObject.id)}
                disabled={objects.length <= 1}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
