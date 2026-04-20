import * as Linking from "expo-linking";

/** Abre WhatsApp com texto de lembrete de agendamento (sem API oficial). */
export async function openWhatsAppReminder(params: {
  telefoneE164: string;
  petNome: string;
  dataHoraLabel: string;
  servico: string;
}): Promise<void> {
  const digits = params.telefoneE164.replace(/\D/g, "");
  const body = encodeURIComponent(
    `Olá! Lembrete FurCare Hub: ${params.servico} para ${params.petNome} em ${params.dataHoraLabel}.`
  );
  const url = `https://wa.me/${digits}?text=${body}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error("Não foi possível abrir o WhatsApp neste dispositivo.");
  }
  await Linking.openURL(url);
}
