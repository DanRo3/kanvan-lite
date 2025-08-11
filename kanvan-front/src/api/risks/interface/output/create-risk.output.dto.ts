export enum RiskScope {
  LOW,
  NORMAL,
  CRITICAL,
}

export default interface CreateRiskOutputDto {
  id: string;
  projectId: string;
  name: string;
  scope: RiskScope;
}
