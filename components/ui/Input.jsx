import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, error }) {
  const [visible, setVisible] = useState(false);
  const isPassword = secureTextEntry;
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !visible}
          keyboardType={keyboardType || "default"}
          autoCapitalize="none"
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeBtn}>
            <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, height: 52 },
  inputError: { borderColor: Colors.error },
  input: { flex: 1, fontSize: Fonts.sizes.md, fontFamily: Fonts.regular, color: Colors.textPrimary },
  eyeBtn: { padding: 4 },
  errorText: { color: Colors.error, fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 4 },
});
