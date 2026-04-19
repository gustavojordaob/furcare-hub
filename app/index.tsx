import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import tw from "twrnc";
import { useAuth } from "../src/context/AuthContext";
import { COLORS } from "../src/constants/theme";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
