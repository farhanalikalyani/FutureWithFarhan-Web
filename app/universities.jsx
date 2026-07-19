import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

const universities = [
  { name: "LUMS", city: "Lahore", type: "Private", programs: "Business, CS, Engineering", color: "#3B82F6" },
  { name: "NUST", city: "Islamabad", type: "Public", programs: "Engineering, CS, Business", color: "#10B981" },
  { name: "FAST-NUCES", city: "Multiple Campuses", type: "Private", programs: "CS, Software Engineering", color: "#8B5CF6" },
  { name: "Punjab University (PU)", city: "Lahore", type: "Public", programs: "Arts, Sciences, Law, Medicine", color: "#F5A623" },
  { name: "Aga Khan University", city: "Karachi", type: "Private", programs: "Medicine, Nursing", color: "#EF4444" },
  { name: "King Edward Medical University", city: "Lahore", type: "Public", programs: "MBBS, BDS", color: "#EC4899" },
  { name: "UET Lahore", city: "Lahore", type: "Public", programs: "Engineering, Architecture", color: "#14B8A6" },
  { name: "IBA Karachi", city: "Karachi", type: "Public", programs: "Business, Economics, CS", color: "#6366F1" },
  { name: "GIKI", city: "Topi, KPK", type: "Private", programs: "Engineering, CS", color: "#0EA5E9" },
  { name: "COMSATS University", city: "Multiple Campuses", type: "Public", programs: "CS, Engineering, Business", color: "#F59E0B" },
];

const typeColors = { Public: "#10B981", Private: "#3B82F6" };

export default function UniversitiesScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Universities</Text>
        <Text style={styles.headerSubtitle}>Explore top options across Pakistan</Text>
      </View>
      <View style={styles.body}>
        {universities.map((u, i) => (
          <TouchableOpacity key={i} style={styles.card} activeOpacity={0.8}>
            <View style={[styles.iconBox, { backgroundColor: u.color + "18" }]}>
              <Ionicons name="business-outline" size={26} color={u.color} />
            </View>
            <View style={styles.info}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{u.name}</Text>
                <View style={[styles.typeBadge, { backgroundColor: (typeColors[u.type] || Colors.primary) + "18" }]}>
                  <Text style={[styles.typeText, { color: typeColors[u.type] || Colors.primary }]}>{u.type}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{u.city}</Text>
              </View>
              <Text style={styles.programs}>{u.programs}</Text>
            </View>
          </TouchableOpacity>
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
  card: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  info: { flex: 1 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  name: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, flex: 1, marginRight: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  typeText: { fontSize: 10, fontFamily: Fonts.semiBold },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  metaText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginLeft: 4 },
  programs: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted, lineHeight: 16 },
});
