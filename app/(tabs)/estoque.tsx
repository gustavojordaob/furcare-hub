import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

const MOCK_PROD = [
  { id: "pr1", nome: "Shampoo neutro", qtd: 4, min: 6, unidade: "un" },
  { id: "pr2", nome: "Condicionador", qtd: 12, min: 4, unidade: "un" },
  { id: "pr3", nome: "Luvas descartáveis", qtd: 80, min: 100, unidade: "cx" },
];

export default function EstoqueTab() {
  const { signOutUser } = useAuth();
  const baixos = MOCK_PROD.filter((p) => p.qtd <= p.min);

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Estoque"
        subtitle="Alerta quando abaixo do mínimo"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {baixos.length ? (
          <View
            style={[
              tw`rounded-2xl p-4 mb-4`,
              { borderWidth: 1, borderColor: COLORS.danger, backgroundColor: "#2a1212" },
            ]}
          >
            <Text style={{ color: COLORS.danger }}>Estoque baixo</Text>
            {baixos.map((p) => (
              <Text key={p.id} style={[tw`text-sm mt-2`, { color: COLORS.text }]}>
                {p.nome}: {p.qtd} {p.unidade} (mín. {p.min})
              </Text>
            ))}
          </View>
        ) : null}

        {MOCK_PROD.map((p) => {
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
    </View>
  );
}
