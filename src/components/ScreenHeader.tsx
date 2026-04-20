import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export function ScreenHeader(props: {
  title: string;
  subtitle?: string;
  onLogout?: () => void | Promise<void>;
  onAdd?: () => void;
  addAccessibilityLabel?: string;
}) {
  return (
    <View style={tw`px-4 pt-12 pb-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-2xl font-bold text-white`}>{props.title}</Text>
          {props.subtitle ? (
            <Text style={[tw`text-sm mt-1`, { color: COLORS.textMuted }]}>
              {props.subtitle}
            </Text>
          ) : null}
        </View>
        <View style={tw`flex-row items-center`}>
          {props.onAdd ? (
            <TouchableOpacity
              onPress={props.onAdd}
              style={tw`p-2 rounded-full bg-zinc-800 mr-2`}
              accessibilityRole="button"
              accessibilityLabel={props.addAccessibilityLabel ?? "Adicionar"}
            >
              <Ionicons name="add" size={26} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null}
          {props.onLogout ? (
            <TouchableOpacity
              onPress={() => void props.onLogout?.()}
              style={tw`p-2 rounded-full bg-zinc-800`}
              accessibilityRole="button"
              accessibilityLabel="Sair"
            >
              <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
