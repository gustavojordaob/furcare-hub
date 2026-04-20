import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

const MOCK_PETS = [
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

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Pets"
        subtitle="Cada pet possui um dono cadastrado"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {MOCK_PETS.map((p) => (
          <View
            key={p.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
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
    </View>
  );
}
