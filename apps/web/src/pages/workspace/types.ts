export type WorkspaceTool =
  | 'orbit'
  | 'select'
  | 'point'
  | 'segment'
  | 'polygon'
  | 'solid'
  | 'pen'
  | 'eraser';

export interface GeometryPoint {
  id: string;
  name: string;
  coords: [number, number, number];
  color?: string;
  size?: number;
  fixed?: boolean;
}

export interface GeometrySegment {
  id: string;
  startPointId: string;
  endPointId: string;
  label?: string;
  color?: string;
  dashed?: boolean;
  thickness?: number;
}

export interface GeometryPolygon {
  id: string;
  vertexIds: string[];
  label?: string;
  color?: string;
  opacity?: number;
}

export interface GeometrySolid {
  id: string;
  type: 'pyramid' | 'cuboid' | 'prism' | 'cylinder' | 'cone' | 'sphere';
  name: string;
  color?: string;
  opacity?: number;
  wireframe?: boolean;
  params: {
    baseSize?: number;
    height?: number;
    radius?: number;
    width?: number;
    depth?: number;
    position?: [number, number, number];
  };
}

export interface ConstructionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  elementIds: string[];
}

export interface GeometryDocument {
  id?: string;
  title: string;
  description?: string;
  mode: '3D' | '2D';
  points: GeometryPoint[];
  segments: GeometrySegment[];
  polygons: GeometryPolygon[];
  solids: GeometrySolid[];
  steps: ConstructionStep[];
}

export interface FreehandStroke {
  id: string;
  color: string;
  size: number;
  points: { x: number; y: number }[];
}

