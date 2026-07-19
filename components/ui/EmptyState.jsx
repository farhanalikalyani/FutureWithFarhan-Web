import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name={icon || "cube-outline"} size={48} color={Colors.textMuted} />
      </View>
      <Text style={styles.title}>{title || "Nothing here yet"}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 32 },
  iconBox: {
    width: 90, height: 90, borderRadius: 24,
    backgroundColor: Colors.border + "60",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  title: {
    fontSize: 18, fontFamily: Fonts.bold,
    color: Colors.textPrimary, marginBottom: 8, textAlign: "center",
  },
  subtitle: {
    fontSize: 14, fontFamily: Fonts.regular,
    color: Colors.textSecondary, textAlign: "center",
    lineHeight: 22, marginBottom: 20,
  },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  btnText: { color: Colors.white, fontSize: 14, fontFamily: Fonts.semiBold },
});
