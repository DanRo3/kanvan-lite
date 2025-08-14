import api from "@/api/common/utils/base.axios";

import CreateUserInputDto from "../interface/input/create-user.input.dto";
import UpdateUserInputDto from "../interface/input/update-user.input.dto";
import CreateUserOutputDto from "../interface/output/create-user.output.dto";
import UpdateUserOutputDto from "../interface/output/update-user.output.dto";

const BASE_PATH = "/api/users";

/**
 * Obtener todos los usuarios (solo desarrolladores según backend)
 */
export const getAllDevelopers = async (): Promise<CreateUserOutputDto[]> => {
  try {
    const response = await api.get<CreateUserOutputDto[]>(BASE_PATH);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener todos los usuarios (desarrolladores) que trabajan en un proyecto dado su ID
 */
export const getDevelopersByProjectId = async (
  projectId: string
): Promise<CreateUserOutputDto[]> => {
  try {
    const response = await api.get<CreateUserOutputDto[]>(
      `${BASE_PATH}/project/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (id: string): Promise<CreateUserOutputDto> => {
  try {
    const response = await api.get<CreateUserOutputDto>(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo usuario (será con rol DEVELOPER siempre según backend)
 */
export const createUser = async (
  userData: CreateUserInputDto
): Promise<CreateUserOutputDto> => {
  try {
    const response = await api.post<CreateUserOutputDto>(BASE_PATH, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar usuario por ID
 */
export const updateUser = async (
  id: string,
  userData: UpdateUserInputDto
): Promise<UpdateUserOutputDto> => {
  try {
    const response = await api.patch<UpdateUserOutputDto>(
      `${BASE_PATH}/${id}`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar usuario por ID (retorna el usuario eliminado, según backend)
 */
export const deleteUser = async (id: string): Promise<CreateUserOutputDto> => {
  try {
    const response = await api.delete<CreateUserOutputDto>(
      `${BASE_PATH}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
