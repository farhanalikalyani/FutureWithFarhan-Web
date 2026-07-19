import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const QUICK_ACCESS = [
  { label: "Notes", icon: "document-text-outline", color: "#10B981", route: "/notes" },
  { label: "MCQs", icon: "help-circle-outline", color: "#8B5CF6", route: "/mcqs" },
  { label: "Mock Tests", icon: "clipboard-outline", color: "#EF4444", route: "/mocktests" },
  { label: "Papers", icon: "archive-outline", color: "#F59E0B", route: "/papers" },
  { label: "Universities", icon: "business-outline", color: "#3B82F6", route: "/universities" },
  { label: "Scholarships", icon: "ribbon-outline", color: "#EC4899", route: "/scholarships" },
  { label: "Merit Calc", icon: "calculator-outline", color: "#14B8A6", route: "/merit" },
  { label: "AI Mentor", icon: "sparkles-outline", color: "#6366F1", route: "/mentor" },
  { label: "Career Hub", icon: "briefcase-outline", color: "#F59E0B", route: "/career" },
  { label: "Community", icon: "people-outline", color: "#10B981", route: "/community" },
  { label: "Planner", icon: "calendar-outline", color: "#8B5CF6", route: "/planner" },
  { label: "Locker", icon: "lock-closed-outline", color: "#EF4444", route: "/locker" },
];

const MOTIVATIONS = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Believe you can and you're halfway there.",
  "Your future is created by what you do today, not tomorrow.",
  "Dream big, work hard, stay focused.",
  "Education is the passport to the future.",
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const motivation = MOTIVATIONS[new Date().getDay()];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.displayName || "Student"}!</Text>
            <Text style={styles.headerSub}>Ready to take another step toward your dreams?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "XP Points", value: "0", icon: "star-outline" },
            { label: "Day Streak", value: "0", icon: "flame-outline" },
            { label: "Tests Done", value: "0", icon: "clipboard-outline" },
          ].map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons name={stat.icon} size={18} color={Colors.gold} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        {/* Motivation */}
        <View style={styles.motivationCard}>
          <View style={styles.motivationHeader}>
            <Ionicons name="bulb-outline" size={18} color={Colors.gold} />
            <Text style={styles.motivationTitle}>Daily Motivation</Text>
          </View>
          <Text style={styles.motivationText}>"{motivation}"</Text>
        </View>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACCESS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickCard}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: item.color + "18" }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Latest Updates */}
        <Text style={styles.sectionTitle}>Latest Updates 📢</Text>
        <View style={styles.updateCard}>
          <Ionicons name="megaphone-outline" size={20} color={Colors.primary} />
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>Welcome to FWF! 🎉</Text>
            <Text style={styles.updateDesc}>
              Pakistan's #1 student success platform. Start exploring notes, MCQs, and scholarships!
            </Text>
          </View>
        </View>

        <View style={styles.updateCard}>
          <Ionicons name="school-outline" size={20} color={Colors.success} />
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>MDCAT 2025 Preparation</Text>
            <Text style={styles.updateDesc}>
              Check our MDCAT notes, MCQs and mock tests to ace your exam!
            </Text>
          </View>
        </View>

        {/* Banner */}
        <TouchableOpacity
          style={styles.banner}
          onPress={() => router.push("/universities")}
          activeOpacity={0.8}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>🎓 University Hub</Text>
            <Text style={styles.bannerDesc}>
              Explore top universities, calculate merit & find your perfect program
            </Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Explore Now</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
            </View>
          </View>
          <Text style={styles.bannerEmoji}>🏛️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 20,
  },
  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular,
  },
  userName: {
    color: Colors.white,
    fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold,
  },
  headerSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 4,
  },
  headerActions: { flexDirection: "row", gap: 10 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row", backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16, padding: 14, gap: 0,
  },
  statBox: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.xs },
  body: { padding: 16 },
  motivationCard: {
    backgroundColor: Colors.gold + "15",
    borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.gold + "30",
  },
  motivationHeader: {
    flexDirection: "row", alignItems: "center",
    gap: 6, marginBottom: 8,
  },
  motivationTitle: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.gold,
  },
  motivationText: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular,
    color: Colors.textPrimary, lineHeight: 22, fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold,
    color: Colors.textPrimary, marginBottom: 14,
  },
  quickGrid: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 10, marginBottom: 24,
  },
  quickCard: {
    width: "22%", backgroundColor: Colors.white,
    borderRadius: 14, padding: 12, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  quickIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  quickLabel: {
    fontSize: 9, fontFamily: Fonts.medium,
    color: Colors.textPrimary, textAlign: "center",
  },
  updateCard: {
    flexDirection: "row", backgroundColor: Colors.white,
    borderRadius: 14, padding: 14, marginBottom: 10,
    gap: 12, alignItems: "flex-start",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  updateInfo: { flex: 1 },
  updateTitle: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary,
  },
  updateDesc: {
    fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular,
    color: Colors.textSecondary, marginTop: 3, lineHeight: 18,
  },
  banner: {
    backgroundColor: Colors.primary + "10",
    borderRadius: 18, padding: 18, marginBottom: 20,
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: Colors.primary + "30",
  },
  bannerLeft: { flex: 1 },
  bannerTitle: {
    fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary,
  },
  bannerDesc: {
    fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular,
    color: Colors.textSecondary, marginTop: 6, lineHeight: 18,
  },
  bannerBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    marginTop: 10,
  },
  bannerBtnText: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.primary,
  },
  bannerEmoji: { fontSize: 48, marginLeft: 10 },
});
