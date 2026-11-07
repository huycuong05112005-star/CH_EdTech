import { useAuthStore } from '../store/authStore';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  joinCode: string;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  status: string;
  createdAt: string;
}

export interface Drawing {
  id: string;
  ownerId: string;
  ownerName: string;
  classroomId?: string | null;
  title: string;
  description?: string;
  dataJson: string;
  thumbnailUrl?: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'CLASSROOM';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DrawingSummary {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  visibility: string;
  version: number;
  updatedAt: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().user?.token;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const body: ApiResponse<T> = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }

  return body.data;
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string) => {
      return request<{
        token: string;
        id: string;
        email: string;
        fullName: string;
        role: 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT';
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  },

  // Classrooms
  classrooms: {
    getTeacherClasses: () => request<Classroom[]>('/api/classrooms/teacher/my-classes'),
    getEnrolledClasses: () => request<Classroom[]>('/api/classrooms/student/enrolled'),
    getClassroom: (id: string) => request<Classroom>(`/api/classrooms/${id}`),
    createClassroom: (data: {
      name: string;
      description?: string;
      subject?: string;
      gradeLevel?: string;
    }) =>
      request<Classroom>('/api/classrooms', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    joinByCode: (joinCode: string) =>
      request<Classroom>('/api/classrooms/join', {
        method: 'POST',
        body: JSON.stringify({ joinCode }),
      }),
    regenerateCode: (id: string) =>
      request<{ joinCode: string }>(`/api/classrooms/${id}/regenerate-code`, {
        method: 'POST',
      }),
  },

  // Drawings
  drawings: {
    getMyDrawings: () => request<DrawingSummary[]>('/api/drawings/my-drawings'),
    getPublicDrawings: () => request<DrawingSummary[]>('/api/drawings/public'),
    getDrawing: (id: string) => request<Drawing>(`/api/drawings/${id}`),
    saveDrawing: (data: {
      title: string;
      description?: string;
      drawingType?: string;
      dataJson: string;
      thumbnailUrl?: string;
      classroomId?: string;
      isPublic?: boolean;
    }) =>
      request<Drawing>('/api/drawings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateDrawing: (
      id: string,
      data: {
        title?: string;
        description?: string;
        dataJson?: string;
        thumbnailUrl?: string;
        isPublic?: boolean;
      }
    ) =>
      request<Drawing>(`/api/drawings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteDrawing: (id: string) =>
      request<void>(`/api/drawings/${id}`, {
        method: 'DELETE',
      }),
  },

  // System Health
  health: {
    check: () => request<any>('/api/health'),
  },
};

