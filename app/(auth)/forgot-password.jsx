import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "../../firebase/auth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (!email.trim()) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e) {
      Alert.alert("Error", "Could not send reset email. Check the address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.iconBox}>
        <Ionicons name="lock-closed-outline" size={48} color={Colors.primary} />
      </View>
      {!sent ? (
        <>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>
          <Input label="Email Address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={error} />
          <Button title="Send Reset Link" onPress={handleReset} loading={loading} />
        </>
      ) : (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successText}>Check your inbox for the reset link.</Text>
          <Button title="Back to Login" onPress={() => router.replace("/(auth)/login")} style={{ marginTop: 24 }} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { marginBottom: 32 },
  iconBox: { width: 90, height: 90, borderRadius: 24, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 22, marginBottom: 32 },
  successBox: { alignItems: "center", paddingTop: 40 },
  successTitle: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16, marginBottom: 10 },
  successText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, textAlign: "center", lineHeight: 22 },
});
