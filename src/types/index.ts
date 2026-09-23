export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Model3D {
  id: string;
  userId: string;
  name: string;
  prompt: string;
  description: string;
  category: ModelCategory;
  format: string;
  metadata: ModelMetadata;
  generationStatus: GenerationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ModelMetadata {
  dimensions: { x: number; y: number; z: number };
  color: string;
  material: string;
  style: string;
  complexity: number;
  vertices: number;
  faces: number;
}

export type ModelCategory = 
  | 'character'
  | 'vehicle'
  | 'building'
  | 'furniture'
  | 'nature'
  | 'abstract'
  | 'weapon'
  | 'prop';

export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface GenerationRequest {
  prompt: string;
  category: ModelCategory;
  dimensions: { x: number; y: number; z: number };
  color: string;
  material: string;
  style: string;
  complexity: number;
}

export interface TransformState {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface MaterialState {
  color: string;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  opacity: number;
}

export interface SceneObject {
  id: string;
  type: string;
  name: string;
  transform: TransformState;
  material: MaterialState;
  visible: boolean;
}
