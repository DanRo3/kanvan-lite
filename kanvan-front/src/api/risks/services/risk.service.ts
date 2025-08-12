import api from "@/api/common/utils/base.axios";
import CreateRiskInputDto from "../interface/input/create-risk.input.dto";
import UpdateRiskInputDto from "../interface/input/update-risk.input.dto";
import CreateRiskOutputDto from "../interface/output/create-risk.output.dto";
import UpdateRiskOutputDto from "../interface/output/update-risk.output.dto";

const BASE_PATH = "/risks";

export const getAllRisks = async (): Promise<CreateRiskOutputDto[]> => {
  try {
    const response = await api.get<CreateRiskOutputDto[]>(BASE_PATH);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRiskById = async (id: string): Promise<CreateRiskOutputDto> => {
  try {
    const response = await api.get<CreateRiskOutputDto>(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRisk = async (
  riskData: CreateRiskInputDto
): Promise<CreateRiskOutputDto> => {
  try {
    const response = await api.post<CreateRiskOutputDto>(BASE_PATH, riskData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRisk = async (
  id: string,
  riskData: UpdateRiskInputDto
): Promise<UpdateRiskOutputDto> => {
  try {
    const response = await api.put<UpdateRiskOutputDto>(
      `${BASE_PATH}/${id}`,
      riskData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRisk = async (id: string): Promise<void> => {
  try {
    await api.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw error;
  }
};
