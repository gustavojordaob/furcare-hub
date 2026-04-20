import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AddItemModal } from "../../src/components/AddItemModal";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

type Prod = {
  id: string;
  nome: string;
  qtd: number;
  min: number;
  unidade: string;
};

const INITIAL: Prod[] = [
  { id: "pr1", nome: "Shampoo neutro", qtd: 4, min: 6, unidade: "un" },
  { id: "pr2", nome: "Condicionador", qtd: 12, min: 4, unidade: "un" },
  { id: "pr3", nome: "Luvas descartáveis", qtd: 80, min: 100, unidade: "cx" },
];

export default function EstoqueTab() {
  const { signOutUser } = useAuth();
  const [produtos, setProdutos] = useState<Prod[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [qtdStr, setQtdStr] = useState("");
  const [minStr, setMinStr] = useState("");
  const [unidade, setUnidade] = useState("un");

  const baixos = produtos.filter((p) => p.qtd <= p.min);

  const inputStyle = tw`rounded-xl px-4 py-3 text-white border border-zinc-700 mb-3`;

  function resetForm() {
    setNome("");
    setQtdStr("");
    setMinStr("");
    setUnidade("un");
  }

  function onSalvar() {
    const qtd = Number.parseInt(qtdStr, 10);
    const min = Number.parseInt(minStr, 10);
    if (!nome.trim() || Number.isNaN(qtd) || Number.isNaN(min)) return;
    setProdutos((prev) => [
      {
        id: `pr-${Date.now()}`,
        nome: nome.trim(),
        qtd,
        min,
        unidade: unidade.trim() || "un",
      },
      ...prev,
    ]);
    resetForm();
    setModalOpen(false);
  }

  const valid =
    nome.trim().length > 0 &&
    !Number.isNaN(Number.parseInt(qtdStr, 10)) &&
    !Number.isNaN(Number.parseInt(minStr, 10));

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Estoque"
        subtitle="Alerta quando abaixo do mínimo"
        onAdd={() => setModalOpen(true)}
        addAccessibilityLabel="Adicionar item ao estoque"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {baixos.length ? (
          <View
            style={[
              tw`rounded-2xl p-4 mb-4`,
              {
                borderWidth: 1,
                borderColor: COLORS.danger,
                backgroundColor: "#2a1212",
              },
            ]}
          >
            <Text style={{ color: COLORS.danger }}>Estoque baixo</Text>
            {baixos.map((p) => (
              <Text
                key={p.id}
                style={[tw`text-sm mt-2`, { color: COLORS.text }]}
              >
                {p.nome}: {p.qtd} {p.unidade} (mín. {p.min})
              </Text>
            ))}
          </View>
        ) : null}

        {produtos.map((p) => {
          const low = p.qtd <= p.min;
          return (
            <View
              key={p.id}
              style={[
                tw`rounded-2xl p-4 mb-3`,
                {
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor: low ? COLORS.danger : COLORS.border,
                },
              ]}
            >
              <Text style={tw`text-white font-semibold`}>{p.nome}</Text>
              <View style={tw`flex-row justify-between mt-3`}>
                <Text style={{ color: COLORS.textMuted }}>
                  Atual: {p.qtd} {p.unidade}
                </Text>
                <Text style={{ color: COLORS.textMuted }}>Mín.: {p.min}</Text>
              </View>
              {low ? (
                <Text style={[tw`text-xs mt-2`, { color: COLORS.danger }]}>
                  Repor o quanto antes
                </Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <AddItemModal
        visible={modalOpen}
        title="Novo item de estoque"
        onClose={() => {
          resetForm();
          setModalOpen(false);
        }}
        onSubmit={onSalvar}
        submitDisabled={!valid}
      >
        <TextInput
          placeholder="Nome do produto"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Quantidade atual"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          style={inputStyle}
          value={qtdStr}
          onChangeText={setQtdStr}
        />
        <TextInput
          placeholder="Estoque mínimo"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          style={inputStyle}
          value={minStr}
          onChangeText={setMinStr}
        />
        <TextInput
          placeholder="Unidade (un, cx, kg)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={unidade}
          onChangeText={setUnidade}
        />
      </AddItemModal>
    </View>
  );
}
