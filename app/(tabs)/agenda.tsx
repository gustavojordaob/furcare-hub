import { useMemo } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useAuth } from "../../src/context/AuthContext";
import { COLORS } from "../../src/constants/theme";
import { openWhatsAppReminder } from "../../src/lib/whatsapp";

type AgRow = {
  id: string;
  pet: string;
  servico: string;
  inicio: string;
  atendenteId: string;
  atendente: string;
  telefoneDono: string;
};

const MOCK: AgRow[] = [
  {
    id: "a1",
    pet: "Thor",
    servico: "Banho + tosa",
    inicio: "2026-04-19T14:00:00",
    atendenteId: "att1",
    atendente: "Ana",
    telefoneDono: "5511999990001",
  },
  {
    id: "a2",
    pet: "Bob",
    servico: "Banho",
    inicio: "2026-04-19T14:30:00",
    atendenteId: "att1",
    atendente: "Ana",
    telefoneDono: "5511977770003",
  },
  {
    id: "a3",
    pet: "Luna",
    servico: "Tosa",
    inicio: "2026-04-19T15:00:00",
    atendenteId: "att2",
    atendente: "Bruno",
    telefoneDono: "5511988880002",
  },
];

function formatLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function AgendaTab() {
  const { signOutUser } = useAuth();

  const conflitos = useMemo(() => {
    const map = new Map<string, AgRow[]>();
    for (const row of MOCK) {
      const list = map.get(row.atendenteId) ?? [];
      list.push(row);
      map.set(row.atendenteId, list);
    }
    const msgs: string[] = [];
    for (const [, rows] of map) {
      const sorted = [...rows].sort(
        (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
      );
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]!;
        const cur = sorted[i]!;
        const diff =
          new Date(cur.inicio).getTime() - new Date(prev.inicio).getTime();
        if (diff < 45 * 60 * 1000) {
          msgs.push(
            `Possível conflito para ${prev.atendente}: ${prev.pet} e ${cur.pet} muito próximos.`
          );
        }
      }
    }
    return msgs;
  }, []);

  return (
    <View style={tw`flex-1`}>
      <ScreenHeader
        title="Agenda"
        subtitle="Banho e tosa — sem sobreposição por atendente"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {conflitos.length ? (
          <View
            style={[
              tw`rounded-2xl p-4 mb-4`,
              { borderWidth: 1, borderColor: COLORS.warning, backgroundColor: "#2a1f0f" },
            ]}
          >
            <Text style={{ color: COLORS.warning }}>Atenção</Text>
            {conflitos.map((c, i) => (
              <Text key={i} style={[tw`text-sm mt-2`, { color: COLORS.text }]}>
                {c}
              </Text>
            ))}
          </View>
        ) : null}

        {MOCK.map((row) => (
          <View
            key={row.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
            ]}
          >
            <Text style={tw`text-white font-semibold`}>{row.pet}</Text>
            <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
              {row.servico}
            </Text>
            <Text style={[tw`text-sm mt-2`, { color: COLORS.primary }]}>
              {formatLabel(row.inicio)}
            </Text>
            <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
              Atendente: {row.atendente}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await openWhatsAppReminder({
                    telefoneE164: row.telefoneDono,
                    petNome: row.pet,
                    dataHoraLabel: formatLabel(row.inicio),
                    servico: row.servico,
                  });
                } catch (e: unknown) {
                  Alert.alert(
                    "WhatsApp",
                    e instanceof Error ? e.message : "Não foi possível abrir"
                  );
                }
              }}
              style={[
                tw`mt-4 rounded-xl py-3 items-center`,
                { backgroundColor: "#128C7E" },
              ]}
            >
              <Text style={tw`text-white font-semibold`}>
                Lembrete via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
