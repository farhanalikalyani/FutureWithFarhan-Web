import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const OPPORTUNITIES = [
  {
    id: 1, type: "Competition", title: "ICPC International Programming Contest", org: "ICPC Foundation",
    deadline: "Sep 2025", desc: "World's oldest and most prestigious programming competition for university students.",
    link: "https://icpc.global", color: "#3B82F6", icon: "trophy-outline",
  },
  {
    id: 2, type: "Hackathon", title: "Google Solution Challenge 2025", org: "Google",
    deadline: "Mar 2026", desc: "Build solutions using Google technologies to solve real-world problems.",
    link: "https://developers.google.com/community/gdsc-solution-challenge", color: "#EF4444", icon: "code-slash-outline",
  },
  {
    id: 3, type: "Conference", title: "Pakistan Software Houses Association Conference", org: "P@SHA",
    deadline: "Oct 2025", desc: "Pakistan's largest tech conference bringing together students and professionals.",
    link: "https://pasha.org.pk", color: "#8B5CF6", icon: "mic-outline",
  },
  {
    id: 4, type: "Workshop", title: "AI & Machine Learning Bootcamp", org: "PIAIC",
    deadline: "Aug 2025", desc: "Free 3-month intensive bootcamp on AI and ML for Pakistani students.",
    link: "https://piaic.org", color: "#10B981", icon: "school-outline",
  },
  {
    id: 5, type: "Volunteer", title: "Teach for Pakistan", org: "TFP",
    deadline: "Rolling", desc: "Volunteer to teach underprivileged children and make a difference.",
    link: "https://teachforpakistan.org", color: "#F59E0B", icon: "heart-outline",
  },
  {
    id: 6, type: "Hackathon", title: "NUST Procom Hackathon", org: "NUST",
    deadline: "Feb 2026", desc: "Pakistan's biggest student hackathon with prizes worth PKR 1,000,000+",
    link: "https://procom.nust.edu.pk", color: "#EC4899", icon: "flash-outline",
  },
  {
    id: 7, type: "Competition", title: "Model United Nations (MUN)", org: "Various Universities",
    deadline: "Monthly", desc: "Simulate UN debates and develop leadership, public speaking and diplomacy skills.",
    link: "https://munpakistan.com", color: "#14B8A6", icon: "earth-outline",
  },
  {
    id: 8, type: "Workshop", title: "National Incubation Center Programs", org: "NIC Pakistan",
    deadline: "Quarterly", desc: "Startup incubation and entrepreneurship programs for Pakistani youth.",
    link: "https://nicpakistan.pk", color: "#6366F1", icon: "rocket-outline",
  },
  {
    id: 9, type: "Competition", title: "Business Plan Competition", org: "IBA Karachi",
    deadline: "Nov 2025", desc: "Present your business idea and win seed funding and mentorship.",
    link: "https://iba.edu.pk", color: "#F5A623", icon: "briefcase-outline",
  },
  {
    id: 10, type: "Volunteer", title: "CARE Foundation Teaching", org: "CARE Foundation",
    deadline: "Rolling", desc: "Teach in government schools and improve education quality in Pakistan.",
    link: "https://carefoundation.org.pk", color: "#0EA5E9", icon: "people-outline",
  },
];

const TYPES = ["All", "Competition", "Hackathon", "Conference", "Workshop", "Volunteer"];
const TYPE_COLORS = { Competition: "#3B82F6", Hackathon: "#EF4444", Conference: "#8B5CF6", Workshop: "#10B981", Volunteer: "#F59E0B" };

export default function OpportunitiesScreen() {
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = OPPORTUNITIES.filter(o => {
    const matchType = activeType === "All" || o.type === activeType;
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.org.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Opportunity Hub 🌟</Text>
        <Text style={styles.headerSubtitle}>Competitions, Hackathons, Workshops & More</Text>
        <View style={styles.statsRow}>
          {[
            { label: "Competitions", value: "50+", icon: "trophy-outline" },
            { label: "Hackathons", value: "20+", icon: "code-slash-outline" },
            { label: "Workshops", value: "30+", icon: "school-outline" },
          ].map((s, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons name={s.icon} size={20} color={Colors.gold} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search opportunities..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          {TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, activeType === type && styles.typeChipActive]}
              onPress={() => setActiveType(type)}
            >
              <Text style={[styles.typeText, activeType === type && styles.typeTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.resultsText}>{filtered.length} opportunities found</Text>

        {filtered.map(opp => (
          <View key={opp.id} style={styles.oppCard}>
            <View style={styles.oppHeader}>
              <View style={[styles.oppIcon, { backgroundColor: opp.color + "18" }]}>
                <Ionicons name={opp.icon} size={24} color={opp.color} />
              </View>
              <View style={styles.oppHeaderInfo}>
                <View style={[styles.typeBadge, { backgroundColor: (TYPE_COLORS[opp.type] || Colors.primary) + "18" }]}>
                  <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[opp.type] || Colors.primary }]}>{opp.type}</Text>
                </View>
                <Text style={styles.orgName}>{opp.org}</Text>
              </View>
              <View style={styles.deadlineBox}>
                <Text style={styles.deadlineLabel}>Deadline</Text>
                <Text style={styles.deadlineValue}>{opp.deadline}</Text>
              </View>
            </View>
            <Text style={styles.oppTitle}>{opp.title}</Text>
            <Text style={styles.oppDesc}>{opp.desc}</Text>
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: opp.color }]} onPress={() => Linking.openURL(opp.link)}>
              <Text style={styles.applyBtnText}>Learn More & Apply</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
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
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 12, alignItems: "center", gap: 4 },
  statValue: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular },
  body: { padding: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 48, marginBottom: 14, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  typeScroll: { marginBottom: 14 },
  typeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  typeTextActive: { color: Colors.white },
  resultsText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: 14 },
  oppCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  oppHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  oppIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 12 },
  oppHeaderInfo: { flex: 1, gap: 4 },
  typeBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  typeBadgeText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  orgName: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  deadlineBox: { alignItems: "flex-end" },
  deadlineLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted },
  deadlineValue: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.error },
  oppTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  oppDesc: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 20, marginBottom: 14 },
  applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, paddingVertical: 12 },
  applyBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
});
