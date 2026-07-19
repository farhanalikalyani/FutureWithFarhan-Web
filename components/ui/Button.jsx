import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function Button({ title, onPress, loading, variant = "primary", style }) {
  const isPrimary = variant === "primary";
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.outline, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? Colors.white : Colors.primary} />
      ) : (
        <Text style={[styles.text, !isPrimary && styles.outlineText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  primary: { backgroundColor: Colors.primary },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: Colors.primary },
  text: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold },
  outlineText: { color: Colors.primary },
});
