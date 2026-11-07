import { GeometryDocument } from './types';

export const PYRAMID_ABCD_PRESET: GeometryDocument = {
  title: 'Hình chóp tứ giác đều S.ABCD',
  description: 'Mô hình chuẩn SGK: Đáy hình vuông ABCD tâm O, đường cao SO vuông góc với mặt phẳng đáy (ABCD). Cạnh khuất nét đứt.',
  mode: '3D',
  points: [
    { id: 'p_A', name: 'A', coords: [-2, 0, -2], color: '#3b82f6', size: 0.12 },
    { id: 'p_B', name: 'B', coords: [2, 0, -2], color: '#3b82f6', size: 0.12 },
    { id: 'p_C', name: 'C', coords: [2.8, 0, 1.5], color: '#3b82f6', size: 0.12 },
    { id: 'p_D', name: 'D', coords: [-1.2, 0, 1.5], color: '#3b82f6', size: 0.12 },
    { id: 'p_O', name: 'O', coords: [0.4, 0, -0.25], color: '#10b981', size: 0.1 },
    { id: 'p_S', name: 'S', coords: [0.4, 4, -0.25], color: '#ef4444', size: 0.14 },
  ],
  segments: [
    // Base edges: AB, BC, CD (solid), DA (dashed or AB dashed depending on perspective)
    { id: 'seg_AB', startPointId: 'p_A', endPointId: 'p_B', label: 'AB', color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BC', startPointId: 'p_B', endPointId: 'p_C', label: 'BC', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CD', startPointId: 'p_C', endPointId: 'p_D', label: 'CD', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_DA', startPointId: 'p_D', endPointId: 'p_A', label: 'DA', color: '#0284c7', dashed: false, thickness: 2 },
    // Base diagonals: AC and BD
    { id: 'seg_AC', startPointId: 'p_A', endPointId: 'p_C', label: 'AC', color: '#94a3b8', dashed: true, thickness: 1 },
    { id: 'seg_BD', startPointId: 'p_B', endPointId: 'p_D', label: 'BD', color: '#94a3b8', dashed: true, thickness: 1 },
    // Height SO
    { id: 'seg_SO', startPointId: 'p_S', endPointId: 'p_O', label: 'SO', color: '#ef4444', dashed: true, thickness: 2.5 },
    // Lateral edges: SA, SB, SC, SD
    { id: 'seg_SA', startPointId: 'p_S', endPointId: 'p_A', label: 'SA', color: '#f59e0b', dashed: true, thickness: 2 },
    { id: 'seg_SB', startPointId: 'p_S', endPointId: 'p_B', label: 'SB', color: '#f59e0b', dashed: false, thickness: 2 },
    { id: 'seg_SC', startPointId: 'p_S', endPointId: 'p_C', label: 'SC', color: '#f59e0b', dashed: false, thickness: 2 },
    { id: 'seg_SD', startPointId: 'p_S', endPointId: 'p_D', label: 'SD', color: '#f59e0b', dashed: false, thickness: 2 },
  ],
  polygons: [
    { id: 'poly_base', vertexIds: ['p_A', 'p_B', 'p_C', 'p_D'], label: 'Mặt đáy (ABCD)', color: '#38bdf8', opacity: 0.15 },
    { id: 'poly_SCD', vertexIds: ['p_S', 'p_C', 'p_D'], label: 'Mặt bên (SCD)', color: '#fbbf24', opacity: 0.12 },
    { id: 'poly_SBC', vertexIds: ['p_S', 'p_B', 'p_C'], label: 'Mặt bên (SBC)', color: '#f472b6', opacity: 0.12 },
  ],
  solids: [],
  steps: [
    { id: 'step_1', stepNumber: 1, title: 'Bước 1: Dựng đáy hình vuông ABCD', description: 'Vẽ tứ giác biểu diễn hình vuông ABCD trên mặt phẳng đáy với cạnh AB khuất (nét đứt).', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'poly_base'] },
    { id: 'step_2', stepNumber: 2, title: 'Bước 2: Xác định tâm O của đáy', description: 'Dựng hai đường chéo AC và BD cắt nhau tại tâm đối xứng O.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'poly_base', 'seg_AC', 'seg_BD', 'p_O'] },
    { id: 'step_3', stepNumber: 3, title: 'Bước 3: Dựng đường cao SO vuông góc với đáy', description: 'Từ tâm O dựng đoạn thẳng thẳng đứng vuông góc với mặt phẳng đáy, lấy điểm S.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'poly_base', 'seg_AC', 'seg_BD', 'p_O', 'p_S', 'seg_SO'] },
    { id: 'step_4', stepNumber: 4, title: 'Bước 4: Hoàn thiện các cạnh bên SA, SB, SC, SD', description: 'Nối đỉnh S với các đỉnh A, B, C, D của đáy. Cạnh SA nằm phía sau nên vẽ nét đứt.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'poly_base', 'seg_AC', 'seg_BD', 'p_O', 'p_S', 'seg_SO', 'seg_SA', 'seg_SB', 'seg_SC', 'seg_SD', 'poly_SCD', 'poly_SBC'] },
  ],
};

export const TETRAHEDRON_PRESET: GeometryDocument = {
  title: 'Tứ diện S.ABC (Hình chóp tam giác)',
  description: 'Khối tứ diện đều với đáy tam giác ABC, đường cao SH hạ từ đỉnh S xuống trọng tâm H.',
  mode: '3D',
  points: [
    { id: 'p_A', name: 'A', coords: [-2, 0, -1], color: '#3b82f6', size: 0.12 },
    { id: 'p_B', name: 'B', coords: [2.5, 0, -1.5], color: '#3b82f6', size: 0.12 },
    { id: 'p_C', name: 'C', coords: [0.5, 0, 2], color: '#3b82f6', size: 0.12 },
    { id: 'p_H', name: 'H', coords: [0.33, 0, -0.17], color: '#10b981', size: 0.1 },
    { id: 'p_S', name: 'S', coords: [0.33, 3.8, -0.17], color: '#ef4444', size: 0.14 },
  ],
  segments: [
    { id: 'seg_AB', startPointId: 'p_A', endPointId: 'p_B', label: 'AB', color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BC', startPointId: 'p_B', endPointId: 'p_C', label: 'BC', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CA', startPointId: 'p_C', endPointId: 'p_A', label: 'CA', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_SH', startPointId: 'p_S', endPointId: 'p_H', label: 'SH', color: '#ef4444', dashed: true, thickness: 2 },
    { id: 'seg_SA', startPointId: 'p_S', endPointId: 'p_A', label: 'SA', color: '#f59e0b', dashed: false, thickness: 2 },
    { id: 'seg_SB', startPointId: 'p_S', endPointId: 'p_B', label: 'SB', color: '#f59e0b', dashed: false, thickness: 2 },
    { id: 'seg_SC', startPointId: 'p_S', endPointId: 'p_C', label: 'SC', color: '#f59e0b', dashed: false, thickness: 2 },
  ],
  polygons: [
    { id: 'poly_base', vertexIds: ['p_A', 'p_B', 'p_C'], label: 'Mặt đáy (ABC)', color: '#38bdf8', opacity: 0.15 },
    { id: 'poly_SBC', vertexIds: ['p_S', 'p_B', 'p_C'], label: 'Mặt bên (SBC)', color: '#f472b6', opacity: 0.12 },
  ],
  solids: [],
  steps: [
    { id: 'step_1', stepNumber: 1, title: 'Bước 1: Dựng đáy tam giác ABC', description: 'Vẽ tam giác ABC với cạnh AB khuất (nét đứt).', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA', 'poly_base'] },
    { id: 'step_2', stepNumber: 2, title: 'Bước 2: Dựng đường cao SH', description: 'Từ trọng tâm H dựng đường thẳng đứng, lấy đỉnh S.', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA', 'poly_base', 'p_H', 'p_S', 'seg_SH'] },
    { id: 'step_3', stepNumber: 3, title: 'Bước 3: Dựng các cạnh bên SA, SB, SC', description: 'Nối đỉnh S với các đỉnh của đáy để hoàn thành tứ diện.', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA', 'poly_base', 'p_H', 'p_S', 'seg_SH', 'seg_SA', 'seg_SB', 'seg_SC', 'poly_SBC'] },
  ],
};

export const CUBOID_PRESET: GeometryDocument = {
  title: 'Hình hộp chữ nhật ABCD.A\'B\'C\'D\'',
  description: 'Khối hộp chữ nhật với 6 mặt chữ nhật, các cạnh khuất hiển thị nét đứt theo góc nhìn chuẩn 3D.',
  mode: '3D',
  points: [
    { id: 'p_A', name: 'A', coords: [-2, 0, -1.5], color: '#3b82f6', size: 0.12 },
    { id: 'p_B', name: 'B', coords: [2, 0, -1.5], color: '#3b82f6', size: 0.12 },
    { id: 'p_C', name: 'C', coords: [2.5, 0, 1.2], color: '#3b82f6', size: 0.12 },
    { id: 'p_D', name: 'D', coords: [-1.5, 0, 1.2], color: '#3b82f6', size: 0.12 },
    { id: 'p_A1', name: "A'", coords: [-2, 3, -1.5], color: '#ec4899', size: 0.12 },
    { id: 'p_B1', name: "B'", coords: [2, 3, -1.5], color: '#ec4899', size: 0.12 },
    { id: 'p_C1', name: "C'", coords: [2.5, 3, 1.2], color: '#ec4899', size: 0.12 },
    { id: 'p_D1', name: "D'", coords: [-1.5, 3, 1.2], color: '#ec4899', size: 0.12 },
  ],
  segments: [
    // Bottom
    { id: 'seg_AB', startPointId: 'p_A', endPointId: 'p_B', label: 'AB', color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BC', startPointId: 'p_B', endPointId: 'p_C', label: 'BC', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CD', startPointId: 'p_C', endPointId: 'p_D', label: 'CD', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_DA', startPointId: 'p_D', endPointId: 'p_A', label: 'DA', color: '#64748b', dashed: true, thickness: 2 },
    // Vertical
    { id: 'seg_AA1', startPointId: 'p_A', endPointId: 'p_A1', label: "AA'", color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BB1', startPointId: 'p_B', endPointId: 'p_B1', label: "BB'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CC1', startPointId: 'p_C', endPointId: 'p_C1', label: "CC'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_DD1', startPointId: 'p_D', endPointId: 'p_D1', label: "DD'", color: '#0284c7', dashed: false, thickness: 2 },
    // Top
    { id: 'seg_A1B1', startPointId: 'p_A1', endPointId: 'p_B1', label: "A'B'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_B1C1', startPointId: 'p_B1', endPointId: 'p_C1', label: "B'C'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_C1D1', startPointId: 'p_C1', endPointId: 'p_D1', label: "C'D'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_D1A1', startPointId: 'p_D1', endPointId: 'p_A1', label: "D'A'", color: '#0284c7', dashed: false, thickness: 2 },
  ],
  polygons: [
    { id: 'poly_top', vertexIds: ['p_A1', 'p_B1', 'p_C1', 'p_D1'], label: "Mặt trên (A'B'C'D')", color: '#38bdf8', opacity: 0.15 },
    { id: 'poly_front', vertexIds: ['p_D', 'p_C', 'p_C1', 'p_D1'], label: "Mặt trước (DCC'D')", color: '#f472b6', opacity: 0.12 },
  ],
  solids: [],
  steps: [
    { id: 'step_1', stepNumber: 1, title: 'Bước 1: Dựng đáy dưới ABCD', description: 'Vẽ hình bình hành biểu diễn đáy dưới ABCD, các cạnh AB và AD vẽ nét đứt.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA'] },
    { id: 'step_2', stepNumber: 2, title: 'Bước 2: Dựng các cạnh bên vuông góc', description: 'Từ các đỉnh dựng các đoạn thẳng thẳng đứng có độ dài bằng nhau.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'p_A1', 'p_B1', 'p_C1', 'p_D1', 'seg_AA1', 'seg_BB1', 'seg_CC1', 'seg_DD1'] },
    { id: 'step_3', stepNumber: 3, title: 'Bước 3: Nối các đỉnh đáy trên', description: 'Nối các đỉnh đáy trên tạo thành hình hộp chữ nhật hoàn chỉnh.', elementIds: ['p_A', 'p_B', 'p_C', 'p_D', 'seg_AB', 'seg_BC', 'seg_CD', 'seg_DA', 'p_A1', 'p_B1', 'p_C1', 'p_D1', 'seg_AA1', 'seg_BB1', 'seg_CC1', 'seg_DD1', 'seg_A1B1', 'seg_B1C1', 'seg_C1D1', 'seg_D1A1', 'poly_top', 'poly_front'] },
  ],
};

export const PRISM_PRESET: GeometryDocument = {
  title: 'Hình lăng trụ tam giác ABC.A\'B\'C\'',
  description: 'Hình lăng trụ đứng với 2 đáy là tam giác ABC và A\'B\'C\', các mặt bên là các hình chữ nhật.',
  mode: '3D',
  points: [
    { id: 'p_A', name: 'A', coords: [-2, 0, -1], color: '#3b82f6', size: 0.12 },
    { id: 'p_B', name: 'B', coords: [2, 0, -1.2], color: '#3b82f6', size: 0.12 },
    { id: 'p_C', name: 'C', coords: [0.5, 0, 1.8], color: '#3b82f6', size: 0.12 },
    { id: 'p_A1', name: "A'", coords: [-2, 3.5, -1], color: '#a855f7', size: 0.12 },
    { id: 'p_B1', name: "B'", coords: [2, 3.5, -1.2], color: '#a855f7', size: 0.12 },
    { id: 'p_C1', name: "C'", coords: [0.5, 3.5, 1.8], color: '#a855f7', size: 0.12 },
  ],
  segments: [
    { id: 'seg_AB', startPointId: 'p_A', endPointId: 'p_B', label: 'AB', color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BC', startPointId: 'p_B', endPointId: 'p_C', label: 'BC', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CA', startPointId: 'p_C', endPointId: 'p_A', label: 'CA', color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_AA1', startPointId: 'p_A', endPointId: 'p_A1', label: "AA'", color: '#64748b', dashed: true, thickness: 2 },
    { id: 'seg_BB1', startPointId: 'p_B', endPointId: 'p_B1', label: "BB'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_CC1', startPointId: 'p_C', endPointId: 'p_C1', label: "CC'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_A1B1', startPointId: 'p_A1', endPointId: 'p_B1', label: "A'B'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_B1C1', startPointId: 'p_B1', endPointId: 'p_C1', label: "B'C'", color: '#0284c7', dashed: false, thickness: 2 },
    { id: 'seg_C1A1', startPointId: 'p_C1', endPointId: 'p_A1', label: "C'A'", color: '#0284c7', dashed: false, thickness: 2 },
  ],
  polygons: [
    { id: 'poly_top', vertexIds: ['p_A1', 'p_B1', 'p_C1'], label: "Mặt đáy trên (A'B'C')", color: '#a855f7', opacity: 0.18 },
    { id: 'poly_front', vertexIds: ['p_A', 'p_C', 'p_C1', 'p_A1'], label: "Mặt bên (ACC'A')", color: '#38bdf8', opacity: 0.12 },
  ],
  solids: [],
  steps: [
    { id: 'step_1', stepNumber: 1, title: 'Bước 1: Dựng đáy tam giác ABC', description: 'Vẽ tam giác ABC với cạnh AB khuất (nét đứt).', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA'] },
    { id: 'step_2', stepNumber: 2, title: 'Bước 2: Dựng các cạnh bên song song và bằng nhau', description: 'Dựng AA\', BB\', CC\' song song và có cùng độ dài.', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA', 'p_A1', 'p_B1', 'p_C1', 'seg_AA1', 'seg_BB1', 'seg_CC1'] },
    { id: 'step_3', stepNumber: 3, title: 'Bước 3: Nối đáy trên A\'B\'C\'', description: 'Nối các đỉnh A\', B\', C\' tạo mặt phẳng đáy trên song song với đáy dưới.', elementIds: ['p_A', 'p_B', 'p_C', 'seg_AB', 'seg_BC', 'seg_CA', 'p_A1', 'p_B1', 'p_C1', 'seg_AA1', 'seg_BB1', 'seg_CC1', 'seg_A1B1', 'seg_B1C1', 'seg_C1A1', 'poly_top', 'poly_front'] },
  ],
};

export const PRESETS: Record<string, GeometryDocument> = {
  pyramid: PYRAMID_ABCD_PRESET,
  tetrahedron: TETRAHEDRON_PRESET,
  cuboid: CUBOID_PRESET,
  prism: PRISM_PRESET,
};

