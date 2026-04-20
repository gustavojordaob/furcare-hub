import type { Timestamp } from "firebase/firestore";

export type Usuario = {
  nome: string;
  email: string;
  criadoEm: Timestamp;
};

export type Dono = {
  nome: string;
  telefone: string;
  email?: string;
};

export type Pet = {
  nome: string;
  especie: string;
  raca?: string;
  donoId: string;
  observacoes?: string;
};

export type Atendente = {
  nome: string;
};

export type Agendamento = {
  petId: string;
  atendenteId: string;
  inicio: Timestamp;
  fim: Timestamp;
  servico: string;
  status: "agendado" | "concluido" | "cancelado";
};

export type Produto = {
  nome: string;
  quantidade: number;
  minimo: number;
  unidade: string;
  custoUnitario?: number;
  precoVenda?: number;
};

export type MovimentoFinanceiro = {
  tipo: "receita" | "custo";
  valor: number;
  descricao: string;
  data: Timestamp;
  mesRef: string;
};
