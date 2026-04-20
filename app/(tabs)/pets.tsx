import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import tw from "twrnc";
import { AddItemModal } from "../../src/components/AddItemModal";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

type Pet = {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  dono: string;
  telefone: string;
};

const INITIAL: Pet[] = [
  {
    id: "p1",
    nome: "Thor",
    especie: "Cão",
    raca: "Shih-tzu",
    dono: "Marina Costa",
    telefone: "+5511999990001",
  },
  {
    id: "p2",
    nome: "Luna",
    especie: "Gato",
    raca: "SRD",
    dono: "Pedro Lima",
    telefone: "+5511988880002",
  },
];

export default function PetsTab() {
  const { signOutUser } = useAuth();
  const [pets, setPets] = useState<Pet[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [dono, setDono] = useState("");
  const [telefone, setTelefone] = useState("");

  const inputStyle = tw`rounded-xl px-4 py-3 text-white border border-zinc-700 mb-3`;

  function resetForm() {
    setNome("");
    setEspecie("");
    setRaca("");
    setDono("");
    setTelefone("");
  }

  function onSalvar() {
    if (!nome.trim() || !dono.trim()) return;
    setPets((prev) => [
      {
        id: `p-${Date.now()}`,
        nome: nome.trim(),
        especie: especie.trim() || "—",
        raca: raca.trim() || "—",
        dono: dono.trim(),
        telefone: telefone.trim() || "—",
      },
      ...prev,
    ]);
    resetForm();
    setModalOpen(false);
  }

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Pets"
        subtitle="Cada pet possui um dono cadastrado"
        onAdd={() => setModalOpen(true)}
        addAccessibilityLabel="Adicionar pet"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {pets.map((p) => (
          <View
            key={p.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              {
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              },
            ]}
          >
            <Text style={tw`text-white text-lg font-semibold`}>{p.nome}</Text>
            <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
              {p.especie} · {p.raca}
            </Text>
            <View style={tw`mt-3 pt-3 border-t border-zinc-800`}>
              <Text style={tw`text-white`}>Dono: {p.dono}</Text>
              <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
                {p.telefone}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <AddItemModal
        visible={modalOpen}
        title="Novo pet"
        onClose={() => {
          resetForm();
          setModalOpen(false);
        }}
        onSubmit={onSalvar}
        submitDisabled={!nome.trim() || !dono.trim()}
      >
        <TextInput
          placeholder="Nome do pet"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Espécie (ex.: Cão)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={especie}
          onChangeText={setEspecie}
        />
        <TextInput
          placeholder="Raça"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={raca}
          onChangeText={setRaca}
        />
        <TextInput
          placeholder="Nome do dono"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={dono}
          onChangeText={setDono}
        />
        <TextInput
          placeholder="Telefone (WhatsApp)"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
          style={inputStyle}
          value={telefone}
          onChangeText={setTelefone}
        />
      </AddItemModal>
    </View>
  );
}
