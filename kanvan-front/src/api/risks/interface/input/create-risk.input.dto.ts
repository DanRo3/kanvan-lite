export enum RiskScope {
  LOW,
  NORMAL,
  CRITICAL,
}

export default interface CreateRiskInputDto {
  projectId: string;
  name: string;
  scope: RiskScope;
}
