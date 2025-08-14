import CreateProjectOutputDto from "@/api/projects/interface/output/create-project.output.dto";
import CreateTaskOutputDto from "@/api/tasks/interface/output/create-task.output.dto";

export enum UserRole {
  OWNER,
  DEVELOPER,
}

export default interface UpdateUserOutputDto {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  projects?: CreateProjectOutputDto[];
  developingProjects?: CreateProjectOutputDto[];
  tasks?: CreateTaskOutputDto[];
}
