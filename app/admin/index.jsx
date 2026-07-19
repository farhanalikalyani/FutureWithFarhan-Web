import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const MENU_ITEMS = [
  { label: "Users", icon: "people-outline", route: "/admin/users", color: "#3B82F6", desc: "Manage student accounts" },
  { label: "Universities", icon: "business-outline", route: "/admin/universities", color: "#6366F1", desc: "Add/edit university profiles" },
  { label: "Notes", icon: "document-text-outline", route: "/admin/notes", color: "#10B981", desc: "Upload study notes" },
  { label: "Past Papers", icon: "archive-outline", route: "/admin/papers", color: "#F59E0B", desc: "Add exam past papers" },
  { label: "MCQs & Mock Tests", icon: "help-circle-outline", route: "/admin/mocktests", color: "#8B5CF6", desc: "Add MCQs for practice & tests" },
  { label: "Video Lectures", icon: "play-circle-outline", route: "/admin/videos", color: "#EF4444", desc: "Add video lecture links" },
  { label: "Scholarships", icon: "ribbon-outline", route: "/admin/scholarships", color: "#EC4899", desc: "Post scholarship opportunities" },
  { label: "Notifications", icon: "notifications-outline", route: "/admin/notifications", color: "#14B8A6", desc: "Send alerts to all students" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const collections = ["users", "notes", "pastPapers", "mcqs", "videos", "scholarships", "notifications", "universities", "community", "testResults"];
      const results = await Promise.all(collections.map(c => getDocs(collection(db, c)).catch(() => ({ size: 0 }))));
      const stats = {};
      collections.forEach((c, i) => { stats[c] = results[i].size; });
      setStats(stats);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  const STAT_CARDS = [
    { label: "Students", value: stats.users || 0, icon: "people-outline", color: "#3B82F6" },
    { label: "Notes", value: stats.notes || 0, icon: "document-text-outline", color: "#10B981" },
    { label: "Past Papers", value: stats.pastPapers || 0, icon: "archive-outline", color: "#F59E0B" },
    { label: "MCQs", value: stats.mcqs || 0, icon: "help-circle-outline", color: "#8B5CF6" },
    { label: "Videos", value: stats.videos || 0, icon: "play-circle-outline", color: "#EF4444" },
    { label: "Scholarships", value: stats.scholarships || 0, icon: "ribbon-outline", color: "#EC4899" },
    { label: "Universities", value: stats.universities || 0, icon: "business-outline", color: "#6366F1" },
    { label: "Tests Done", value: stats.testResults || 0, icon: "clipboard-outline", color: "#14B8A6" },
    { label: "Community", value: stats.community || 0, icon: "chatbubbles-outline", color: "#F59E0B" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark-outline" size={28} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>Welcome, {user?.displayName || "Admin"}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadStats}>
          <Ionicons name="refresh-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>📊 Platform Overview</Text>
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            {STAT_CARDS.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + "18" }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>⚡ Manage Content</Text>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuCard}
            onPress={() => router.push(item.route)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(tabs)")}>
          <Ionicons name="arrow-back-outline" size={18} color={Colors.primary} />
          <Text style={styles.backBtnText}>Back to App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  headerIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.sm, marginTop: 2 },
  refreshBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  body: { padding: 16 },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 14, marginTop: 8 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  statCard: { width: "30%", backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  statValue: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2, textAlign: "center" },
  menuCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  menuIcon: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 14 },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  menuDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  backBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.primary + "40", backgroundColor: Colors.primary + "08", marginTop: 8, marginBottom: 20 },
  backBtnText: { color: Colors.primary, fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold },
});
