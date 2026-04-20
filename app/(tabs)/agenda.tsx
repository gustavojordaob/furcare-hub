import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { AddItemModal } from "../../src/components/AddItemModal";
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

const INITIAL: AgRow[] = [
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
  if (Number.isNaN(d.getTime())) return iso;
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
  const [rows, setRows] = useState<AgRow[]>(INITIAL);
  const [modalOpen, setModalOpen] = useState(false);
  const [pet, setPet] = useState("");
  const [servico, setServico] = useState("");
  const [inicio, setInicio] = useState("");
  const [atendente, setAtendente] = useState("");
  const [atendenteId, setAtendenteId] = useState("att1");
  const [telefoneDono, setTelefoneDono] = useState("");

  const inputStyle = tw`rounded-xl px-4 py-3 text-white border border-zinc-700 mb-3`;

  const conflitos = useMemo(() => {
    const map = new Map<string, AgRow[]>();
    for (const row of rows) {
      const list = map.get(row.atendenteId) ?? [];
      list.push(row);
      map.set(row.atendenteId, list);
    }
    const msgs: string[] = [];
    for (const [, list] of map) {
      const sorted = [...list].sort(
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
  }, [rows]);

  function resetForm() {
    setPet("");
    setServico("");
    setInicio("");
    setAtendente("");
    setAtendenteId("att1");
    setTelefoneDono("");
  }

  function onSalvar() {
    if (!pet.trim() || !servico.trim() || !inicio.trim() || !atendente.trim()) {
      return;
    }
    let iso = inicio.trim();
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
      iso = new Date().toISOString();
    }
    const tel = telefoneDono.replace(/\D/g, "");
    setRows((prev) => [
      {
        id: `a-${Date.now()}`,
        pet: pet.trim(),
        servico: servico.trim(),
        inicio: iso,
        atendenteId: atendenteId.trim() || "att1",
        atendente: atendente.trim(),
        telefoneDono: tel || "5511999990000",
      },
      ...prev,
    ]);
    resetForm();
    setModalOpen(false);
  }

  const canSave =
    pet.trim() && servico.trim() && inicio.trim() && atendente.trim();

  return (
    <View style={[tw`flex-1`, { backgroundColor: COLORS.background }]}>
      <ScreenHeader
        title="Agenda"
        subtitle="Banho e tosa — sem sobreposição por atendente"
        onAdd={() => setModalOpen(true)}
        addAccessibilityLabel="Novo agendamento"
        onLogout={signOutUser}
      />
      <ScrollView contentContainerStyle={tw`px-4 pb-10`}>
        {conflitos.length ? (
          <View
            style={[
              tw`rounded-2xl p-4 mb-4`,
              {
                borderWidth: 1,
                borderColor: COLORS.warning,
                backgroundColor: "#2a1f0f",
              },
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

        {rows.map((row) => (
          <View
            key={row.id}
            style={[
              tw`rounded-2xl p-4 mb-3`,
              {
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              },
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

      <AddItemModal
        visible={modalOpen}
        title="Novo agendamento"
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
          placeholder="Serviço (ex.: Banho + tosa)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={servico}
          onChangeText={setServico}
        />
        <TextInput
          placeholder="Início (ISO ou data/hora)"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={inicio}
          onChangeText={setInicio}
        />
        <TextInput
          placeholder="Atendente"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={atendente}
          onChangeText={setAtendente}
        />
        <TextInput
          placeholder="ID atendente (ex.: att1, att2) — conflitos"
          placeholderTextColor={COLORS.textMuted}
          style={inputStyle}
          value={atendenteId}
          onChangeText={setAtendenteId}
        />
        <TextInput
          placeholder="Telefone do dono (só números, DDI)"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
          style={inputStyle}
          value={telefoneDono}
          onChangeText={setTelefoneDono}
        />
      </AddItemModal>
    </View>
  );
}
