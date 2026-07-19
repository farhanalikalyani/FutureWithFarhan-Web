import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

const mockTests = [
  { name: "MDCAT Full Length Test 1", subject: "Biology, Chemistry, Physics", questions: 200, duration: "150 min", difficulty: "Hard", color: "#EF4444" },
  { name: "ECAT Full Length Test 1", subject: "Math, Physics, Chemistry", questions: 100, duration: "100 min", difficulty: "Hard", color: "#3B82F6" },
  { name: "NTS GAT General", subject: "Verbal, Analytical, Quantitative", questions: 100, duration: "120 min", difficulty: "Medium", color: "#10B981" },
  { name: "CSS Current Affairs Quiz", subject: "Current Affairs", questions: 50, duration: "40 min", difficulty: "Medium", color: "#8B5CF6" },
  { name: "ISSB Intelligence Test", subject: "Verbal & Non-Verbal Reasoning", questions: 80, duration: "60 min", difficulty: "Medium", color: "#6366F1" },
  { name: "English Grammar Basics", subject: "English", questions: 40, duration: "30 min", difficulty: "Easy", color: "#14B8A6" },
];

const difficultyColors = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };

export default function MockTestsScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mock Tests</Text>
        <Text style={styles.headerSubtitle}>Practice under real exam conditions</Text>
      </View>
      <View style={styles.body}>
        {mockTests.map((t, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.name}>{t.name}</Text>
              <View style={[styles.diffBadge, { backgroundColor: (difficultyColors[t.difficulty]) + "18" }]}>
                <Text style={[styles.diffText, { color: difficultyColors[t.difficulty] }]}>{t.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.subject}>{t.subject}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="help-circle-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{t.questions} Questions</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{t.duration}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: t.color }]} activeOpacity={0.85}>
              <Ionicons name="play" size={16} color={Colors.white} />
              <Text style={styles.startText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  body: { padding: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  name: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  diffText: { fontSize: 10, fontFamily: Fonts.semiBold },
  subject: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginBottom: 12 },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 14 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textMuted },
  startBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, paddingVertical: 11 },
  startText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
});
