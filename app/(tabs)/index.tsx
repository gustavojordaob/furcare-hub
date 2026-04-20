import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AddItemModal } from "../../src/components/AddItemModal";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

type Proximo = {
  id: string;
  pet: string;
  servico: string;
  quando: string;
  atendente: string;
};

const INITIAL: Proximo[] = [
  {
    id: "1",
    pet: "Thor",
    servico: "Banho + tosa",
    quando: "Hoje · 14:00",
    atendente: "Ana",
  },
  {
    id: "2",
    pet: "Luna",
    servico: "Banho",
    quando: "Amanhã · 09:30",
    atendente: "Bruno",
  },
  {
    id: "3",
    pet: "Fred",
    servico: "Tosa higiênica",
    quando: "Sex · 16:00",
    atendente: "Ana",
  },
];

export default function HomeTab() {
  const { user, signOutUser } = useAuth();
  const [proximos, setProximos] = useState<Proximo[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [pet, setPet] = useState("");
  const [servico, setServico] = useState("");
  const [quando, setQuando] = useState("");
  const [atendente, setAtendente] = useState("");

  const inputStyle = tw`rounded-xl px-4 py-3 text-white border border-zinc-700 mb-3`;

  function resetForm() {
    setPet("");
    setServico("");
    setQuando("");
    setAtendente("");
  }

  function onSalvar() {
    if (!pet.trim() || !quando.trim()) return;
    setProximos((prev) => [
      {
        id: `h-${Date.now()}`,
        pet: pet.trim(),
        servico: servico.trim() || "Serviço",
        quando: quando.trim(),
        atendente: atendente.trim() || "—",
      },
      ...prev,
    ]);
    resetForm();
    setModalOpen(false);
  }

  const canSave = pet.trim().length > 0 && quando.trim().length > 0;

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Início"
        subtitle={user?.email ?? "Dashboard"}
        onAdd={() => setModalOpen(true)}
        addAccessibilityLabel="Adicionar agendamento rápido"
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
          <Text style={tw`text-white font-semibold text-lg`}>
            Próximos agendamentos
          </Text>
          <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
            Toque em + para incluir um horário na lista rápida.
          </Text>
        </View>

        {proximos.map((a) => (
          <View
            key={a.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              {
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              },
            ]}
          >
            <Text style={tw`text-white font-semibold`}>{a.pet}</Text>
            <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
              {a.servico}
            </Text>
            <View style={tw`flex-row justify-between mt-3`}>
              <Text style={{ color: COLORS.primary }}>{a.quando}</Text>
              <Text style={{ color: COLORS.textMuted }}>{a.atendente}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <AddItemModal
        visible={modalOpen}
        title="Agendamento rápido"
        onClose={() => {
          resetForm();
          setModalOpen(false);
        }}
        onSubmit={onSalvar}
        submitDisabled={!canSave}
      >
        <TextInput
          placeholder="Pet"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={pet}
          onChangeText={setPet}
        />
        <TextInput
          placeholder="Serviço"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={servico}
          onChangeText={setServico}
        />
        <TextInput
          placeholder="Quando (ex.: Hoje · 15:00)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={quando}
          onChangeText={setQuando}
        />
        <TextInput
          placeholder="Atendente"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={atendente}
          onChangeText={setAtendente}
        />
      </AddItemModal>
    </View>
  );
}
