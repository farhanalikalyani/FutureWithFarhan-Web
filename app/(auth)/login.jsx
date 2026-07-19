import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { loginUser, resendVerificationEmail } from "../../firebase/auth";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);

  function validate() {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!email.trim()) { setEmailError("Email is required"); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Enter a valid email"); valid = false; }
    if (!password) { setPasswordError("Password is required"); valid = false; }
    else if (password.length < 6) { setPasswordError("Password must be at least 6 characters"); valid = false; }
    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await loginUser(email.trim(), password);
      const user = result.user;
      if (!user.emailVerified) {
        setShowVerifyBanner(true);
        setLoading(false);
        return;
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    try {
      await resendVerificationEmail();
      Alert.alert("Email Sent!", "Please check your inbox and verify your email, then log in again.");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>FWF</Text>
          </View>
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Log in to continue your journey</Text>
        </View>

        {/* Verify email banner */}
        {showVerifyBanner && (
          <View style={styles.verifyBanner}>
            <Ionicons name="mail-outline" size={20} color={Colors.warning} />
            <View style={styles.verifyBannerText}>
              <Text style={styles.verifyBannerTitle}>Email Not Verified</Text>
              <Text style={styles.verifyBannerDesc}>
                Please verify your email before logging in.
              </Text>
            </View>
            <TouchableOpacity onPress={handleResendVerification}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputRow, emailError && styles.inputRowError]}>
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
            <View style={styles.textInputWrapper}>
              <Text
                style={styles.fakeInput}
                onPress={() => {}}
              />
              <TouchableOpacity
                style={styles.inputTouch}
                onPress={() => {}}
                activeOpacity={1}
              >
                <TextInput
                  value={email}
                  onChangeText={v => { setEmail(v); setEmailError(""); }}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.textInput}
                />
              </TouchableOpacity>
            </View>
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputRow, passwordError && styles.inputRowError]}>
            <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
            <View style={styles.textInputWrapper}>
              <TextInput
                value={password}
                onChangeText={v => { setPassword(v); setPasswordError(""); }}
                placeholder="••••••••"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnLoading]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.white} size="small" />
                <Text style={styles.loginBtnText}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.loginBtnText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Need to import these at top
import { TextInput, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: 24 },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 32 },
  logoBox: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center", marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  logoText: { color: Colors.white, fontSize: 24, fontFamily: Fonts.bold },
  title: { fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary },
  verifyBanner: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.warning + "15",
    borderRadius: 12, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.warning + "40",
    gap: 10,
  },
  verifyBannerText: { flex: 1 },
  verifyBannerTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.warning },
  verifyBannerDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  resendText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.primary },
  form: { flex: 1 },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 8 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 4,
    marginBottom: 6, gap: 10, height: 54,
  },
  inputRowError: { borderColor: Colors.error },
  textInputWrapper: { flex: 1 },
  textInput: {
    flex: 1, fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular, color: Colors.textPrimary,
    height: 44,
  },
  fakeInput: { display: "none" },
  inputTouch: { flex: 1 },
  errorText: { fontSize: Fonts.sizes.xs, color: Colors.error, marginBottom: 10, marginLeft: 4 },
  forgotRow: { alignItems: "flex-end", marginBottom: 24 },
  forgotText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.primary },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    height: 54, alignItems: "center", justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  loginBtnLoading: { opacity: 0.8 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  loginBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  signupRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  signupText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  signupLink: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.primary },
});
