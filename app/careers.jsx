import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

const careers = [
  { name: "Medicine", icon: "medical-outline", color: "#EF4444", desc: "MBBS, BDS and allied health sciences leading to careers as doctors, dentists, and specialists.", path: "MDCAT → MBBS/BDS → House Job → Specialization" },
  { name: "Engineering", icon: "construct-outline", color: "#3B82F6", desc: "Civil, Electrical, Mechanical, Software and more — building the infrastructure of tomorrow.", path: "ECAT → BSc Engineering → PEC Registration" },
  { name: "Computer Science", icon: "laptop-outline", color: "#8B5CF6", desc: "Software development, AI, data science and cybersecurity in Pakistan's fastest growing sector.", path: "Entry Test → BS CS/SE → Internship → Industry" },
  { name: "Business & Finance", icon: "briefcase-outline", color: "#F5A623", desc: "Business administration, finance, accounting and entrepreneurship.", path: "Entry Test → BBA/BS → ACCA/CFA (optional)" },
  { name: "Civil Services", icon: "shield-checkmark-outline", color: "#10B981", desc: "CSS and PMS exams for administrative, police and foreign service positions.", path: "Bachelor's Degree → CSS/PMS Exam → Training Academy" },
  { name: "Armed Forces", icon: "fitness-outline", color: "#6366F1", desc: "Pakistan Army, Navy and Air Force commissioned officer careers.", path: "ISSB → Cadet College/Academy → Commission" },
  { name: "Law", icon: "hammer-outline", color: "#EC4899", desc: "LLB leading to legal practice, judiciary or corporate law.", path: "LAT → LLB (5 years) → Bar Council License" },
  { name: "Design & Media", icon: "color-palette-outline", color: "#14B8A6", desc: "Graphic design, architecture, media and creative industries.", path: "Portfolio/Entry Test → BS Design/Architecture" },
];

export default function CareersScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Paths</Text>
        <Text style={styles.headerSubtitle}>Plan your journey, one step at a time</Text>
      </View>
      <View style={styles.body}>
        {careers.map((c, i) => {
          const isOpen = expanded === i;
          return (
            <TouchableOpacity key={i} style={styles.card} activeOpacity={0.85} onPress={() => setExpanded(isOpen ? null : i)}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: c.color + "18" }]}>
                  <Ionicons name={c.icon} size={26} color={c.color} />
                </View>
                <View style={styles.titleWrap}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.desc} numberOfLines={isOpen ? undefined : 2}>{c.desc}</Text>
                </View>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={Colors.textMuted} />
              </View>
              {isOpen && (
                <View style={styles.pathBox}>
                  <Ionicons name="trail-sign-outline" size={16} color={c.color} />
                  <Text style={[styles.pathText, { color: c.color }]}>{c.path}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  titleWrap: { flex: 1 },
  name: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 3 },
  desc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 16 },
  pathBox: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 10, padding: 10, marginTop: 12, gap: 8 },
  pathText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, flex: 1, lineHeight: 16 },
});
