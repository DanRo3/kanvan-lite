export enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  DEPLOYED,
}

export enum RiskScope {
  LOW,
  NORMAL,
  CRITICAL,
}

export interface UserBriefDto {
  id: string;
  name: string;
  email: string;
}

export interface TaskBriefDto {
  id: string;
  title: string;
  status: TaskStatus;
  points: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RiskDto {
  id: string;
  name?: string;
  scope?: RiskScope;
  projectId?: string;
}

export default interface CreateProjectOutputDto {
  id: string;
  publicId?: string;
  name: string;
  description?: string;
  status?: string;
  pointsBudget?: number;
  pointsUsed?: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  criticalBugs?: number;
  normalBugs?: number;
  lowBugs?: number;
  testsCoberage?: number;
  owner: UserBriefDto;
  developers: UserBriefDto[];
  tasks: TaskBriefDto[];
  risks: RiskDto[];
}
