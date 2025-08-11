export default interface CreateProjectInputDto {
  name: string;
  description?: string;
  deadline: Date;
  pointsBudget: number;
}
