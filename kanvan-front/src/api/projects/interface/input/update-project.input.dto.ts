export enum ProjectStatus {
  PLANNED,
  IN_PROGRESS,
  COMPLETED,
}

export default interface UpdateProjectInputDto {
  name?: string;

  description?: string;

  deadline?: Date;

  pointsBudget?: number;

  status?: ProjectStatus;

  pointsUsed?: number;

  criticalBugs?: number;

  normalBugs?: number;

  lowBugs?: number;

  testCoberage?: number;
}
