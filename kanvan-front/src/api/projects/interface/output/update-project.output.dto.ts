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

export enum ProjectStatus {
  PLANNED,
  IN_PROGRESS,
  COMPLETED,
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface TaskDto {
  id: string;
  title: string;
  status: TaskStatus;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface RiskDto {
  id: string;
  name?: string;
  scope?: RiskScope;
  projectId?: string;
}

export default interface UpdateProjectOutputDto {
  id: string;
  publicId?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  pointsBudget?: number;
  pointsUsed?: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  criticalBugs?: number;
  normalBugs?: number;
  lowBugs?: number;
  testsCoberage?: number;
  owner: UserDto;
  developers: UserDto[];
  tasks: TaskDto[];
  risks: RiskDto[];
}
