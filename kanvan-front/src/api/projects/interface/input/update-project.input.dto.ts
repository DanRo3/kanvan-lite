export enum ProjectStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export default interface UpdateProjectInputDto {
  name?: string;

  description?: string;

  deadline?: string;

  pointsBudget?: number;

  status?: ProjectStatus;

  pointsUsed?: number;

  criticalBugs?: number;

  normalBugs?: number;

  lowBugs?: number;

  testsCoberage?: number;

  developersIds?: string[];
}
