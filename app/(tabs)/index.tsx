import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

const MOCK_PROXIMOS = [
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

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Início"
        subtitle={user?.email ?? "Dashboard"}
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
          ]}
        >
          <Text style={tw`text-white font-semibold text-lg`}>
            Próximos agendamentos
          </Text>
          <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
            Visão rápida do salão — sincronize com Firestore depois.
          </Text>
        </View>

        {MOCK_PROXIMOS.map((a) => (
          <View
            key={a.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
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
    </View>
  );
}
