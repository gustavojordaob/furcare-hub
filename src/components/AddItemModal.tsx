import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";
import { COLORS } from "../constants/theme";

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitDisabled?: boolean;
};

export function AddItemModal(props: Props) {
  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      transparent
      onRequestClose={props.onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 justify-end bg-black/60`}>
          <Pressable style={tw`flex-1`} onPress={props.onClose} />
          <View
            style={[
              tw`rounded-t-3xl p-5 pb-8 max-h-[85%]`,
              {
                backgroundColor: COLORS.surface,
                borderTopWidth: 1,
                borderColor: COLORS.border,
              },
            ]}
          >
            <Text style={tw`text-white text-lg font-semibold mb-4`}>
              {props.title}
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {props.children}
            </ScrollView>
            <View style={tw`flex-row mt-4 gap-3`}>
              <TouchableOpacity
                onPress={props.onClose}
                style={[
                  tw`flex-1 rounded-xl py-3 items-center border`,
                  { borderColor: COLORS.border },
                ]}
              >
                <Text style={{ color: COLORS.textMuted }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={props.onSubmit}
                disabled={props.submitDisabled}
                style={[
                  tw`flex-1 rounded-xl py-3 items-center`,
                  { backgroundColor: COLORS.primary },
                  props.submitDisabled ? tw`opacity-50` : null,
                ]}
              >
                <Text style={tw`text-white font-semibold`}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
