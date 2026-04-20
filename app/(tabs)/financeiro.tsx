import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AddItemModal } from "../../src/components/AddItemModal";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

const MES_REF = "2026-04";
const RECEITA_BASE = 42890.5;

type Despesa = { id: string; descricao: string; valor: number };

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FinanceiroTab() {
  const { signOutUser } = useAuth();
  const [despesas, setDespesas] = useState<Despesa[]>([
    { id: "d0", descricao: "Ração e insumos (mock)", valor: 24110.0 },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valorStr, setValorStr] = useState("");

  const custoTotal = useMemo(
    () => despesas.reduce((s, d) => s + d.valor, 0),
    [despesas]
  );
  const lucro = RECEITA_BASE - custoTotal;

  const inputStyle = tw`rounded-xl px-4 py-3 text-white border border-zinc-700 mb-3`;

  function resetForm() {
    setDescricao("");
    setValorStr("");
  }

  function onSalvar() {
    const normalized = valorStr.replace(",", ".").trim();
    const valor = Number.parseFloat(normalized);
    if (!descricao.trim() || Number.isNaN(valor) || valor <= 0) return;
    setDespesas((prev) => [
      {
        id: `d-${Date.now()}`,
        descricao: descricao.trim(),
        valor,
      },
      ...prev,
    ]);
    resetForm();
    setModalOpen(false);
  }

  const valorValido =
    descricao.trim().length > 0 &&
    !Number.isNaN(Number.parseFloat(valorStr.replace(",", "."))) &&
    Number.parseFloat(valorStr.replace(",", ".")) > 0;

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Financeiro"
        subtitle={`Resumo mensal · ${MES_REF}`}
        onAdd={() => setModalOpen(true)}
        addAccessibilityLabel="Registrar despesa"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            {
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>Receita</Text>
          <Text
            style={[tw`text-2xl font-bold mt-1`, { color: COLORS.success }]}
          >
            {fmt(RECEITA_BASE)}
          </Text>
        </View>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            {
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>Custo</Text>
          <Text style={[tw`text-2xl font-bold mt-1`, { color: COLORS.text }]}>
            {fmt(custoTotal)}
          </Text>
        </View>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            {
              backgroundColor: COLORS.surface,
              borderWidth: 1,
              borderColor: COLORS.border,
            },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>
            Lucro líquido
          </Text>
          <Text
            style={[tw`text-2xl font-bold mt-1`, { color: COLORS.primary }]}
          >
            {fmt(lucro)}
          </Text>
          <Text style={[tw`text-xs mt-2`, { color: COLORS.textMuted }]}>
            Despesas somadas abaixo; sincronize com movimentos_financeiros no
            Firestore depois.
          </Text>
        </View>

        <Text style={[tw`text-sm mb-2`, { color: COLORS.textMuted }]}>
          Despesas do mês
        </Text>
        {despesas.map((d) => (
          <View
            key={d.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              {
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              },
            ]}
          >
            <Text style={tw`text-white font-semibold`}>{d.descricao}</Text>
            <Text style={[tw`text-sm mt-1`, { color: COLORS.danger }]}>
              {fmt(d.valor)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <AddItemModal
        visible={modalOpen}
        title="Nova despesa"
        onClose={() => {
          resetForm();
          setModalOpen(false);
        }}
        onSubmit={onSalvar}
        submitDisabled={!valorValido}
      >
        <TextInput
          placeholder="Descrição (ex.: Ração, energia)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          placeholder="Valor (ex.: 150,50)"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="decimal-pad"
          style={inputStyle}
          value={valorStr}
          onChangeText={setValorStr}
        />
      </AddItemModal>
    </View>
  );
}
