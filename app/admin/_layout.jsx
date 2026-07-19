import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { isUserAdmin } from "../../firebase/admin-check";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      // Wait for auth to finish loading
      if (authLoading) return;

      // Not logged in — go to login
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      // Check admin status from Firestore
      try {
        const adminStatus = await isUserAdmin(user.uid);
        if (adminStatus) {
          setIsAdmin(true);
          setChecking(false);
        } else {
          // Not admin — show denied then redirect
          setDenied(true);
          setChecking(false);
          setTimeout(() => router.replace("/(tabs)"), 2000);
        }
      } catch (e) {
        console.log("Admin check error:", e);
        router.replace("/(tabs)");
      }
    }

    checkAccess();
  }, [user, authLoading]);

  // Show loading while checking
  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.checkingText}>Verifying access...</Text>
      </View>
    );
  }

  // Access denied screen
  if (denied) {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedIcon}>🚫</Text>
        <Text style={styles.deniedTitle}>Access Denied</Text>
        <Text style={styles.deniedText}>
          You don't have admin permissions.{"\n"}Redirecting you back...
        </Text>
      </View>
    );
  }

  // Admin confirmed — render admin screens
  if (isAdmin) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    padding: 20,
  },
  checkingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  deniedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  deniedTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.error,
    marginBottom: 8,
  },
  deniedText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
