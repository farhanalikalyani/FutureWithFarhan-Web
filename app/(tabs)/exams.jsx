import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { Fonts } from "../../constants/fonts";

const exams = [
  { name: "MDCAT", icon: "medical-outline", color: "#EF4444", desc: "Medical & Dental College Admission Test — national-level entrance exam for admission to medical and dental colleges across Pakistan.", hours: "3.5 Hours", subjects: "4 subjects" },
  { name: "ECAT", icon: "construct-outline", color: "#3B82F6", desc: "Entrance exam for engineering universities in Pakistan, especially UET Lahore.", hours: "2 Hours", subjects: "4 subjects" },
  { name: "NTS", icon: "document-text-outline", color: "#10B981", desc: "Standardized testing service for university admissions, scholarships, and recruitment.", hours: "2 Hours", subjects: "4 subjects" },
  { name: "PPSC", icon: "briefcase-outline", color: "#8B5CF6", desc: "Provincial commission conducting exams for government jobs in Punjab.", hours: "3 Hours", subjects: "5 subjects" },
  { name: "FPSC", icon: "shield-outline", color: "#F5A623", desc: "Federal agency responsible for recruiting civil servants for the Government of Pakistan.", hours: "3 Hours", subjects: "5 subjects" },
  { name: "CSS", icon: "ribbon-outline", color: "#EC4899", desc: "The most prestigious competitive exam in Pakistan for civil service recruitment.", hours: "3 Hours per paper", subjects: "6 subjects" },
  { name: "ISSB", icon: "star-outline", color: "#14B8A6", desc: "Selection process for Pakistan Armed Forces officer cadets.", hours: "4-5 Days", subjects: "5 subjects" },
  { name: "Army Tests", icon: "fitness-outline", color: "#6366F1", desc: "Various tests for joining Pakistan Army in different capacities.", hours: "2-3 Hours", subjects: "5 subjects" },
  { name: "Police Tests", icon: "car-outline", color: "#0EA5E9", desc: "Recruitment tests for provincial police services.", hours: "2 Hours", subjects: "3 subjects" },
  { name: "University Entry", icon: "school-outline", color: "#F59E0B", desc: "General admission tests used by public and private universities.", hours: "2 Hours", subjects: "4 subjects" },
];

export default function ExamsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const styles = getStyles(colors);

  const filtered = useMemo(
    () => exams.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Competitive Exams</Text>
        <Text style={styles.headerSubtitle}>Prepare for Pakistan's top exams</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exams..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.list}>
        {filtered.map((exam) => (
          <TouchableOpacity
            key={exam.name}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: "/exam-detail", params: { name: exam.name } })}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: exam.color + "20" }]}>
                <Ionicons name={exam.icon} size={26} color={exam.color} />
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
            <Text style={styles.examName}>{exam.name}</Text>
            <Text style={styles.examDesc}>{exam.desc}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.badgeText}>{exam.hours}</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="layers-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.badgeText}>{exam.subjects}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No exams match "{query}"</Text>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.surface, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.textPrimary, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: colors.textSecondary, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, marginHorizontal: 16, marginTop: 16, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, color: colors.textPrimary, fontFamily: Fonts.regular, fontSize: Fonts.sizes.sm },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  iconBox: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  examName: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: colors.textPrimary, marginBottom: 4 },
  examDesc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: colors.textSecondary, lineHeight: 17, marginBottom: 12 },
  badgeRow: { flexDirection: "row", gap: 8 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.surfaceAlt, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontFamily: Fonts.medium, color: colors.textSecondary },
  emptyText: { textAlign: "center", color: colors.textMuted, fontFamily: Fonts.regular, marginTop: 20 },
});
