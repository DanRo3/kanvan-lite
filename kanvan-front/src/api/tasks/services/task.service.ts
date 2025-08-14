import api from "@/api/common/utils/base.axios";
import CreateTaskInputDto from "../interface/input/create-task.input.dto";
import UpdateTaskInputDto from "../interface/input/update-task.input.dto";
import UpdateTaskStatusInputDto from "../interface/input/update-task-status.input.dto";
import CreateTaskOutputDto from "../interface/output/create-task.output.dto";
import UpdateTaskOutputDto from "../interface/output/update-task.output.dto";
import UpdateTaskStatusOutputDto from "../interface/output/update-task-status.output.dto";

const BASE_PATH = "/api/tasks";

export const getAllTasks = async (): Promise<CreateTaskOutputDto[]> => {
  try {
    const response = await api.get<CreateTaskOutputDto[]>(BASE_PATH);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTasksByProjectId = async (
  projectId: string
): Promise<CreateTaskOutputDto[]> => {
  try {
    const response = await api.get<CreateTaskOutputDto[]>(
      `${BASE_PATH}/project/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTaskById = async (id: string): Promise<CreateTaskOutputDto> => {
  try {
    const response = await api.get<CreateTaskOutputDto>(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (
  taskData: CreateTaskInputDto
): Promise<CreateTaskOutputDto> => {
  try {
    const response = await api.post<CreateTaskOutputDto>(BASE_PATH, taskData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (
  id: string,
  taskData: UpdateTaskInputDto
): Promise<UpdateTaskOutputDto> => {
  try {
    const response = await api.patch<UpdateTaskOutputDto>(
      `${BASE_PATH}/${id}`,
      taskData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTaskStatus = async (
  id: string,
  statusData: UpdateTaskStatusInputDto
): Promise<UpdateTaskStatusOutputDto> => {
  try {
    const response = await api.patch<UpdateTaskStatusOutputDto>(
      `${BASE_PATH}/${id}/status`,
      statusData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  console.log(`ENTRADA AL DELETE`);
  try {
    await api.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw error;
  }
};
