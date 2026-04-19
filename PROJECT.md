# PROJECT.md — FurCare Hub

## 1. Visao geral
- **Nome:** FurCare Hub
- **Descricao:** App de gestão de petshop com cadastro de pets e donos, agendamento de banho e tosa, controle de estoque de produtos e relatório financeiro mensal
- **Publico-alvo:** Donos de petshop pequenos e médios
- **Stack:** React Native + Expo Router + Firebase + twrnc

## 2. Paleta de cores
```typescript
const COLORS = {
  primary:    '#7C3AED',
  background: '#000000',
  surface:    '#1a1a1a',
  border:     '#333333',
  text:       '#FFFFFF',
  textMuted:  '#9e9e9e',
};
```

## 3. Telas
| Tela | Rota | Descrição |
|---|---|---|
| Home | /(tabs)/index | Dashboard com próximos agendamentos |
| Pets | /(tabs)/pets | Lista de pets cadastrados |
| Agenda | /(tabs)/agenda | Agendamentos de banho e tosa |
| Estoque | /(tabs)/estoque | Produtos e insumos |
| Financeiro | /(tabs)/financeiro | Receitas e relatório |

## 4. Schema Firestore
```
usuarios/{uid}
  - nome: string
  - email: string
  - criadoEm: Timestamp
```

## 5. Regras de negocio
Cada pet tem dono. Agendamento não pode conflitar por atendente. Estoque baixo gera alerta. Relatório mostra receita, custo e lucro líquido.

## 6. Integracoes
WhatsApp via Linking para lembrete de agendamento
