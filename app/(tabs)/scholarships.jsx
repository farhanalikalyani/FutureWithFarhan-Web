import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const scholarships = [
  { name: "HEC Need Based Scholarship", type: "Need Based", deadline: "June 30, 2025", amount: "Full Tuition", color: "#10B981" },
  { name: "Prime Minister Laptop Scheme", type: "Merit Based", deadline: "July 15, 2025", amount: "Free Laptop", color: "#3B82F6" },
  { name: "Ehsaas Undergraduate Scholarship", type: "Need Based", deadline: "August 1, 2025", amount: "PKR 10,000/month", color: "#8B5CF6" },
  { name: "Chevening Scholarship UK", type: "International", deadline: "November 5, 2025", amount: "Fully Funded", color: "#F5A623" },
  { name: "Commonwealth Scholarship", type: "International", deadline: "October 2025", amount: "Fully Funded", color: "#EC4899" },
  { name: "DAAD Germany Scholarship", type: "International", deadline: "October 15, 2025", amount: "Fully Funded", color: "#EF4444" },
];

const typeColors = { "Need Based": "#10B981", "Merit Based": "#3B82F6", "International": "#F5A623" };

export default function ScholarshipsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scholarship Hub</Text>
        <Text style={styles.headerSubtitle}>Find your path to funded education</Text>
      </View>
      <View style={styles.body}>
        {scholarships.map((s, i) => (
          <TouchableOpacity key={i} style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardTop}>
              <View style={[styles.typeBadge, { backgroundColor: (typeColors[s.type] || Colors.primary) + "18" }]}>
                <Text style={[styles.typeText, { color: typeColors[s.type] || Colors.primary }]}>{s.type}</Text>
              </View>
              <Text style={styles.amount}>{s.amount}</Text>
            </View>
            <Text style={styles.name}>{s.name}</Text>
            <View style={styles.cardBottom}>
              <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.deadline}> Deadline: {s.deadline}</Text>
            </View>
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: s.color }]}>
              <Text style={styles.applyText}>View Details</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
  body: { padding: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  amount: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  name: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 8 },
  cardBottom: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  deadline: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  applyBtn: { borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  applyText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
});
