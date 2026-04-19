import { ScrollView, Text, View } from "react-native";
import tw from "twrnc";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";

const MES_REF = "2026-04";
const RECEITA = 42890.5;
const CUSTO = 24110.0;
const LUCRO = RECEITA - CUSTO;

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FinanceiroTab() {
  const { signOutUser } = useAuth();

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Financeiro"
        subtitle={`Resumo mensal · ${MES_REF}`}
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>Receita</Text>
          <Text style={[tw`text-2xl font-bold mt-1`, { color: COLORS.success }]}>
            {fmt(RECEITA)}
          </Text>
        </View>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>Custo</Text>
          <Text style={[tw`text-2xl font-bold mt-1`, { color: COLORS.text }]}>
            {fmt(CUSTO)}
          </Text>
        </View>
        <View
          style={[
            tw`rounded-2xl p-4 mb-4`,
            { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
          ]}
        >
          <Text style={[tw`text-sm`, { color: COLORS.textMuted }]}>
            Lucro líquido
          </Text>
          <Text style={[tw`text-2xl font-bold mt-1`, { color: COLORS.primary }]}>
            {fmt(LUCRO)}
          </Text>
          <Text style={[tw`text-xs mt-2`, { color: COLORS.textMuted }]}>
            Alimentado por movimentos em `movimentos_financeiros` no Firestore.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
