export enum RiskScope {
  LOW,
  NORMAL,
  CRITICAL,
}

export default interface UpdateRiskOutputDto {
  id: string;
  projectId: string;
  name: string;
  scope: RiskScope;
}
