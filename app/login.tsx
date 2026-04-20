import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import tw from "twrnc";
import { useAuth } from "../src/context/AuthContext";
import { COLORS } from "../src/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, register, ensureDemoUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    try {
      if (mode === "register") {
        if (!nome.trim()) {
          Alert.alert("Validação", "Informe seu nome.");
          return;
        }
        await register(nome, email, password);
      } else {
        await signIn(email, password);
      }
      router.replace("/(tabs)");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Falha na autenticação";
      Alert.alert("Erro", msg);
    } finally {
      setBusy(false);
    }
  }

  async function onDemo() {
    setBusy(true);
    try {
      await ensureDemoUser();
      router.replace("/(tabs)");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Configure o Firebase";
      Alert.alert("Demo", msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[tw`flex-1`, { backgroundColor: COLORS.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow px-5 pt-16 pb-10`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-3xl font-bold text-white`}>FurCare Hub</Text>
        <Text style={[tw`mt-2 text-base`, { color: COLORS.textMuted }]}>
          Gestão de petshop: pets, agenda, estoque e financeiro.
        </Text>

        <View style={tw`mt-10 gap-3`}>
          {mode === "register" ? (
            <TextInput
              placeholder="Nome completo"
              placeholderTextColor={COLORS.textMuted}
              style={tw`rounded-xl px-4 py-3 text-white border border-zinc-700`}
              value={nome}
              onChangeText={setNome}
            />
          ) : null}
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={tw`rounded-xl px-4 py-3 text-white border border-zinc-700`}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            style={tw`rounded-xl px-4 py-3 text-white border border-zinc-700`}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={busy}
          style={[
            tw`mt-6 rounded-xl py-4 items-center`,
            { backgroundColor: COLORS.primary },
            busy && tw`opacity-60`,
          ]}
        >
          <Text style={tw`text-white font-semibold text-base`}>
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDemo}
          disabled={busy}
          style={tw`mt-3 rounded-xl py-4 items-center border border-zinc-700`}
        >
          <Text style={tw`text-white`}>Entrar com conta demo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode(mode === "login" ? "register" : "login")}
          style={tw`mt-6`}
        >
          <Text style={[tw`text-center`, { color: COLORS.textMuted }]}>
            {mode === "login"
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Entrar"}
          </Text>
        </TouchableOpacity>

        <Link href="/" style={tw`mt-8`}>
          <Text style={{ color: COLORS.primary }}>Voltar ao início</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
