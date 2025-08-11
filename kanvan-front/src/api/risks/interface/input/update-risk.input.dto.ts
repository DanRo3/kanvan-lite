export enum RiskScope {
  LOW,
  NORMAL,
  CRITICAL,
}

export default interface UpdateRiskInputDto {
  name: string;
  scope: RiskScope;
}
