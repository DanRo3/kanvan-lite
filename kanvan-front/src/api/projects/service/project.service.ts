import api from "@/api/common/utils/base.axios";
import CreateProjectInputDto from "../interface/input/create-project.input.dto";
import UpdateProjectInputDto from "../interface/input/update-project.input.dto";
import CreateProjectOutputDto from "../interface/output/create-project.output.dto";
import UpdateProjectOutputDto from "../interface/output/update-project.output.dto";

const BASE_PATH = "/api/projects";

export const getAllProjects = async (): Promise<CreateProjectOutputDto[]> => {
  try {
    const response = await api.get<CreateProjectOutputDto[]>(BASE_PATH);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (
  id: string
): Promise<CreateProjectOutputDto> => {
  try {
    const response = await api.get<CreateProjectOutputDto>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectByPublicId = async (
  id: string
): Promise<CreateProjectOutputDto> => {
  try {
    const response = await api.get<CreateProjectOutputDto>(
      `${BASE_PATH}/publicId/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (
  projectData: CreateProjectInputDto
): Promise<CreateProjectOutputDto> => {
  try {
    const response = await api.post<CreateProjectOutputDto>(
      BASE_PATH,
      projectData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (
  id: string,
  projectData: UpdateProjectInputDto
): Promise<UpdateProjectOutputDto> => {
  try {
    const response = await api.patch<UpdateProjectOutputDto>(
      `${BASE_PATH}/${id}`,
      projectData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw error;
  }
};
