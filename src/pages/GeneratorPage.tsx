import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModelStore } from '../store/modelStore';
import { useAuthStore } from '../store/authStore';
import { GenerationRequest, ModelCategory } from '../types';
import ModelPreview from '../three/ModelPreview';
import {
  Wand2,
  Loader2,
  Download,
  Settings2,
  Box,
  Palette,
  Layers,
  Zap,
  ChevronDown,
  Check,
  RotateCcw,
} from 'lucide-react';

const categories: { value: ModelCategory; label: string }[] = [
  { value: 'character', label: 'Character' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'building', label: 'Building' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'nature', label: 'Nature' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'weapon', label: 'Weapon' },
  { value: 'prop', label: 'Prop' },
];

const materials = ['Standard', 'Metallic', 'Glass', 'Matte', 'Glossy', 'Rough'];
const styles = ['Realistic', 'Low-Poly', 'Stylized', 'Cartoon', 'Minimalist', 'Detailed'];
const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#ffffff', '#6b7280', '#1f2937'];

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

export default function GeneratorPage() {
  const navigate = useNavigate();
  const { generateModel, isGenerating, generationProgress } = useModelStore();
  const { user } = useAuthStore();

  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<ModelCategory>('abstract');
  const [color, setColor] = useState('#6366f1');
  const [material, setMaterial] = useState('Standard');
  const [style, setStyle] = useState('Stylized');
  const [complexity, setComplexity] = useState(5);
  const [dimensions, setDimensions] = useState({ x: 1, y: 1, z: 1 });

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;

    const request: GenerationRequest = {
      prompt,
      category,
      dimensions,
      color,
      material,
      style,
      complexity,
    };

    const model = await generateModel(request, user.id);
    navigate(`/editor/${model.id}`);
  };

  const handleReset = () => {
    setPrompt('');
    setCategory('abstract');
    setColor('#6366f1');
    setMaterial('Standard');
    setStyle('Stylized');
    setComplexity(5);
    setDimensions({ x: 1, y: 1, z: 1 });
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Controls */}
      <div className="lg:w-96 flex-shrink-0 overflow-y-auto space-y-4 pr-2">
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Generation Settings</h3>
              <p className="text-xs text-gray-400">Configure your 3D model</p>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none h-24"
              placeholder="Describe the 3D model you want to create..."
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Box className="w-4 h-4" /> Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-gray-700 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Material
            </label>
            <div className="grid grid-cols-3 gap-2">
              {materials.map((m) => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    material === m
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    style === s
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Complexity: {complexity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase">{axis}</label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={dimensions[axis]}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, [axis]: parseFloat(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - 3D Preview */}
      <div className="flex-1 relative bg-gray-900/50 border border-gray-800/50 rounded-2xl overflow-hidden">
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Generating Model...</h3>
            <p className="text-gray-400 mb-4">Processing your request</p>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-sm text-indigo-400 mt-2">{generationProgress}%</p>
          </div>
        )}

        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        }>
          <ModelPreview
            geometry={geometryMap[category] || 'torus'}
            color={color}
            roughness={material === 'Rough' || material === 'Matte' ? 0.8 : material === 'Glossy' || material === 'Glass' ? 0.1 : 0.3}
            metalness={material === 'Metallic' ? 0.9 : material === 'Glass' ? 0.1 : 0.5}
            wireframe={style === 'Low-Poly'}
            autoRotate={!isGenerating}
            scale={1}
          />
        </Suspense>

        {/* Preview overlay info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-700/50">
            <p className="text-xs text-gray-400">
              <span className="text-white font-medium">{style}</span> • {material} • Complexity {complexity}
            </p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-700/50">
            <p className="text-xs text-gray-400">
              Orbit: Drag • Zoom: Scroll • Pan: Right-click
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
