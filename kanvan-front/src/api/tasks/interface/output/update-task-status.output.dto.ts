// Tipos/enums para frontend (strings para compatibilidad)
export type TaskStatus =
  | "PENDING"
  | "COMPLETED"
  | "PLANNED"
  | "DEPLOYED"
  | string;

export interface UserBriefDto {
  id: string;
  name: string;
  email: string;
}

export interface ProjectBriefDto {
  id: string;
  publicId?: string;
  name: string;
  description?: string;
  status?: string;
  pointsBudget?: number;
  pointsUsed?: number;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  criticalBugs?: number;
  normalBugs?: number;
  lowBugs?: number;
  testsCoberage?: number;
}

export default interface UpdateTaskStatusOutputDto {
  id: string;
  title: string;
  status: TaskStatus;
  points: number;
  developmentHours: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  developers: UserBriefDto[];
  project?: ProjectBriefDto;
}
