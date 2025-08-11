export enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  DEPLOYED,
}

export default interface UpdateTaskInputDto {
  title: string;
  points: number;
  developmentHours: number;
  status: TaskStatus;
}
