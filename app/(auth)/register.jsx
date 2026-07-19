import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { registerUser } from "../../firebase/auth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Logo from "../../components/ui/Logo";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    if (confirm !== password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(email.trim(), password, name.trim());
      router.replace("/(tabs)");
    } catch (error) {
      const msg =
        error.code === "auth/email-already-in-use" ? "Email already registered." :
        error.code === "auth/weak-password" ? "Password is too weak." :
        "Registration failed. Try again.";
      Alert.alert("Sign Up Failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <LinearGradient colors={Colors.gradientBlue} style={styles.header}>
        <Logo size={48} floating style={{ marginBottom: 10 }} />
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join thousands of students building their future</Text>
      </LinearGradient>
      <View style={styles.form}>
        <Text style={styles.title}>Let's Get Started 🚀</Text>
        <Text style={styles.subtitle}>Fill in your details to create your account</Text>
        <Input label="Full Name" placeholder="Your full name" value={name} onChangeText={setName} error={errors.name} />
        <Input label="Email Address" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
        <Input label="Password" placeholder="Create a password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
        <Input label="Confirm Password" placeholder="Repeat your password" value={confirm} onChangeText={setConfirm} secureTextEntry error={errors.confirm} />
        <Button title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />
        <View style={styles.row}>
          <Text style={styles.rowText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.rowLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flexGrow: 1 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, alignItems: "center" },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 6, textAlign: "center" },
  form: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  title: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginBottom: 28 },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24 },
  rowText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular },
  rowLink: { color: Colors.primary, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
});
