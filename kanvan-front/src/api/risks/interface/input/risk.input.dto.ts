export default interface Risk {
  id?: string;
  descripcion: string;
  impacto: "bajo" | "medio" | "alto";
}
