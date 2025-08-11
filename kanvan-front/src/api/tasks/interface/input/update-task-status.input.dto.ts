export enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  DEPLOYED,
}

export default interface UpdateTaskStatusInputDto {
  status: TaskStatus;
}
