import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export function ScreenHeader(props: {
  title: string;
  subtitle?: string;
  onLogout?: () => void;
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
        {props.onLogout ? (
          <TouchableOpacity
            onPress={props.onLogout}
            style={tw`p-2 rounded-full bg-zinc-800`}
            accessibilityRole="button"
            accessibilityLabel="Sair"
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
