import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { Fonts } from "../constants/fonts";

const examDetails = {
  MDCAT: {
    icon: "medical-outline",
    tagline: "Medical & Dental College Admission Test",
    desc: "National-level entrance exam for admission to medical and dental colleges across Pakistan.",
    gradient: ["#EF4444", "#EC4899"],
    hours: "3.5 Hours",
    marks: "210 marks",
    subjectsCount: "4 subjects",
    subjects: ["Biology", "Chemistry", "Physics", "English"],
    resources: [
      { label: "Notes", value: "450" },
      { label: "MCQs", value: "12,000" },
      { label: "Past Papers", value: "15" },
      { label: "Mock Tests", value: "25" },
    ],
    tips: [
      "Focus on NCERT-level Biology concepts",
      "Practice at least 100 MCQs daily",
      "Revise past papers from 2017-2024",
      "Time management is crucial - practice under timed conditions",
    ],
  },
};

const fallback = (name, color = "#3B82F6") => ({
  icon: "book-outline",
  tagline: name,
  desc: `Preparation hub for ${name}. Detailed subject breakdowns, notes, and mock tests are being added soon.`,
  gradient: [color, color],
  hours: "—",
  marks: "—",
  subjectsCount: "—",
  subjects: [],
  resources: [
    { label: "Notes", value: "—" },
    { label: "MCQs", value: "—" },
    { label: "Past Papers", value: "—" },
    { label: "Mock Tests", value: "—" },
  ],
  tips: ["Content for this exam is coming soon. Check back shortly!"],
});

export default function ExamDetailScreen() {
  const { name } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const styles = getStyles(colors);
  const data = examDetails[name] || fallback(name || "Exam");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          <Text style={styles.backText}>Back to Exams</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={data.gradient} style={styles.hero}>
        <Ionicons name={data.icon} size={30} color="#fff" />
        <Text style={styles.heroTitle}>{name}</Text>
        <Text style={styles.heroTagline}>{data.tagline}</Text>
        <Text style={styles.heroDesc}>{data.desc}</Text>
        <View style={styles.heroBadges}>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>⏱ {data.hours}</Text></View>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>📝 {data.marks}</Text></View>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>📚 {data.subjectsCount}</Text></View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {data.subjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Subjects</Text>
            {data.subjects.map((s) => (
              <View key={s} style={styles.subjectRow}>
                <Ionicons name="book-outline" size={16} color={colors.accents?.blue || "#3B82F6"} />
                <Text style={styles.subjectText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Available Resources</Text>
          <View style={styles.resourceGrid}>
            {data.resources.map((r) => (
              <View key={r.label} style={styles.resourceCard}>
                <Text style={styles.resourceValue}>{r.value}</Text>
                <Text style={styles.resourceLabel}>{r.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Preparation Tips</Text>
          {data.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>🚀 Start Preparing</Text>
        <View style={styles.startGrid}>
          <TouchableOpacity style={[styles.startCard, { backgroundColor: "#3B82F6" }]} activeOpacity={0.85}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.startTitle}>Study Notes</Text>
            <Text style={styles.startDesc}>Comprehensive notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startCard, { backgroundColor: "#10B981" }]} activeOpacity={0.85}>
            <Ionicons name="help-circle-outline" size={22} color="#fff" />
            <Text style={styles.startTitle}>Practice MCQs</Text>
            <Text style={styles.startDesc}>Thousands of questions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startCard, { backgroundColor: "#8B5CF6" }]} activeOpacity={0.85} onPress={() => router.push("/mock-tests")}>
            <Ionicons name="play-outline" size={22} color="#fff" />
            <Text style={styles.startTitle}>Mock Tests</Text>
            <Text style={styles.startDesc}>Full-length timed tests</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: colors.textPrimary, fontFamily: Fonts.medium, fontSize: Fonts.sizes.sm },
  hero: { marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroTitle: { color: "#fff", fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold, marginTop: 8 },
  heroTagline: { color: "rgba(255,255,255,0.85)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, marginTop: 2 },
  heroDesc: { color: "rgba(255,255,255,0.75)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 8, lineHeight: 17 },
  heroBadges: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  heroBadge: { backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  heroBadgeText: { color: "#fff", fontSize: 11, fontFamily: Fonts.semiBold },
  body: { paddingHorizontal: 16, paddingBottom: 30 },
  section: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: colors.textPrimary, marginBottom: 12 },
  subjectRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 8 },
  subjectText: { color: colors.textPrimary, fontFamily: Fonts.medium, fontSize: Fonts.sizes.sm },
  resourceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  resourceCard: { width: "47%", backgroundColor: colors.surfaceAlt, borderRadius: 12, padding: 14, alignItems: "center" },
  resourceValue: { color: "#F5A623", fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  resourceLabel: { color: colors.textSecondary, fontSize: 11, fontFamily: Fonts.regular, marginTop: 2 },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 10 },
  tipText: { flex: 1, color: colors.textSecondary, fontFamily: Fonts.regular, fontSize: Fonts.sizes.sm, lineHeight: 18 },
  startGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  startCard: { flex: 1, minWidth: "30%", borderRadius: 14, padding: 14, gap: 4 },
  startTitle: { color: "#fff", fontFamily: Fonts.bold, fontSize: Fonts.sizes.sm, marginTop: 6 },
  startDesc: { color: "rgba(255,255,255,0.85)", fontFamily: Fonts.regular, fontSize: 10 },
});
