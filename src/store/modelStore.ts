import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Model3D, GenerationRequest, GenerationStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ModelState {
  models: Model3D[];
  currentModel: Model3D | null;
  isGenerating: boolean;
  generationProgress: number;
  searchQuery: string;
  filterCategory: string;
  sortBy: string;

  // Actions
  generateModel: (request: GenerationRequest, userId: string) => Promise<Model3D>;
  setCurrentModel: (model: Model3D | null) => void;
  deleteModel: (id: string) => void;
  updateModel: (id: string, data: Partial<Model3D>) => void;
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  getFilteredModels: () => Model3D[];
}

const generateRandomMetadata = (request: GenerationRequest) => {
  const baseVertices = request.complexity * 500 + Math.floor(Math.random() * 2000);
  return {
    dimensions: request.dimensions,
    color: request.color,
    material: request.material,
    style: request.style,
    complexity: request.complexity,
    vertices: baseVertices,
    faces: Math.floor(baseVertices / 2),
  };
};

const sampleModels: Model3D[] = [
  {
    id: 'sample-1',
    userId: '1',
    name: 'Crystal Dragon',
    prompt: 'A majestic crystal dragon with glowing wings',
    description: 'A stylized character model',
    category: 'character',
    format: 'glb',
    metadata: { dimensions: { x: 2, y: 3, z: 1.5 }, color: '#8b5cf6', material: 'Glass', style: 'Stylized', complexity: 8, vertices: 4500, faces: 2250 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sample-2',
    userId: '1',
    name: 'Futuristic Car',
    prompt: 'A sleek futuristic sports car',
    description: 'A realistic vehicle model',
    category: 'vehicle',
    format: 'glb',
    metadata: { dimensions: { x: 4, y: 1.5, z: 2 }, color: '#ef4444', material: 'Metallic', style: 'Realistic', complexity: 9, vertices: 8200, faces: 4100 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'sample-3',
    userId: '1',
    name: 'Ancient Temple',
    prompt: 'A mysterious ancient temple with pillars',
    description: 'A detailed building model',
    category: 'building',
    format: 'glb',
    metadata: { dimensions: { x: 5, y: 4, z: 5 }, color: '#f97316', material: 'Rough', style: 'Detailed', complexity: 7, vertices: 6300, faces: 3150 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'sample-4',
    userId: '1',
    name: 'Abstract Sculpture',
    prompt: 'A flowing abstract art sculpture',
    description: 'An abstract art piece',
    category: 'abstract',
    format: 'glb',
    metadata: { dimensions: { x: 2, y: 3, z: 2 }, color: '#06b6d4', material: 'Glossy', style: 'Minimalist', complexity: 6, vertices: 3200, faces: 1600 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'sample-5',
    userId: '1',
    name: 'Enchanted Tree',
    prompt: 'A magical tree with glowing leaves',
    description: 'A nature model with mystical elements',
    category: 'nature',
    format: 'glb',
    metadata: { dimensions: { x: 3, y: 5, z: 3 }, color: '#22c55e', material: 'Standard', style: 'Stylized', complexity: 7, vertices: 5100, faces: 2550 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'sample-6',
    userId: '1',
    name: 'Medieval Sword',
    prompt: 'An ornate medieval sword with gem encrusted handle',
    description: 'A detailed weapon model',
    category: 'weapon',
    format: 'glb',
    metadata: { dimensions: { x: 0.3, y: 3, z: 0.3 }, color: '#eab308', material: 'Metallic', style: 'Detailed', complexity: 6, vertices: 2800, faces: 1400 },
    generationStatus: 'completed',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
];

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      models: sampleModels,
      currentModel: null,
      isGenerating: false,
      generationProgress: 0,
      searchQuery: '',
      filterCategory: 'all',
      sortBy: 'newest',

      generateModel: async (request: GenerationRequest, userId: string) => {
        set({ isGenerating: true, generationProgress: 0 });

        // Simulate generation progress
        for (let i = 0; i <= 100; i += 5) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          set({ generationProgress: i });
        }

        const newModel: Model3D = {
          id: uuidv4(),
          userId,
          name: request.prompt.slice(0, 40) || 'Generated Model',
          prompt: request.prompt,
          description: `A ${request.style} ${request.category} model`,
          category: request.category,
          format: 'glb',
          metadata: generateRandomMetadata(request),
          generationStatus: 'completed' as GenerationStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          models: [newModel, ...state.models],
          isGenerating: false,
          generationProgress: 0,
          currentModel: newModel,
        }));

        return newModel;
      },

      setCurrentModel: (model) => set({ currentModel: model }),

      deleteModel: (id) =>
        set((state) => ({
          models: state.models.filter((m) => m.id !== id),
          currentModel: state.currentModel?.id === id ? null : state.currentModel,
        })),

      updateModel: (id, data) =>
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
          ),
          currentModel:
            state.currentModel?.id === id
              ? { ...state.currentModel, ...data }
              : state.currentModel,
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setSortBy: (sort) => set({ sortBy: sort }),

      getFilteredModels: () => {
        const { models, searchQuery, filterCategory, sortBy } = get();
        let filtered = [...models];

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.prompt.toLowerCase().includes(q) ||
              m.category.toLowerCase().includes(q)
          );
        }

        if (filterCategory !== 'all') {
          filtered = filtered.filter((m) => m.category === filterCategory);
        }

        switch (sortBy) {
          case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }

        return filtered;
      },
    }),
    {
      name: 'model-storage',
    }
  )
);
