import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

const quotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Your limitation is only your imagination.", author: "Unknown" },
];

const tips = [
  { title: "Beat Exam Anxiety", icon: "heart-outline", color: "#EF4444", desc: "Breathe deeply, prepare a realistic schedule, and remember one test doesn't define you." },
  { title: "Stay Consistent", icon: "trending-up-outline", color: "#10B981", desc: "Small daily study sessions beat last-minute cramming every time." },
  { title: "Rest is Productive", icon: "moon-outline", color: "#8B5CF6", desc: "Sleep well before exams — your brain consolidates learning while you rest." },
  { title: "Track Small Wins", icon: "checkmark-done-outline", color: "#3B82F6", desc: "Celebrate finishing a chapter or a mock test. Progress compounds." },
];

export default function MotivationScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={Colors.gradientBlue} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Motivation</Text>
        <Text style={styles.headerSubtitle}>Stay inspired, stay on track</Text>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>💬 Daily Quotes</Text>
        {quotes.map((q, i) => (
          <View key={i} style={styles.quoteCard}>
            <Ionicons name="quote" size={18} color={Colors.gold} />
            <Text style={styles.quoteText}>{q.text}</Text>
            <Text style={styles.quoteAuthor}>— {q.author}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>🌱 Tips for Students</Text>
        {tips.map((t, i) => (
          <View key={i} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={22} color={t.color} />
            </View>
            <View style={styles.tipText}>
              <Text style={styles.tipTitle}>{t.title}</Text>
              <Text style={styles.tipDesc}>{t.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  body: { padding: 16 },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 12, marginTop: 6 },
  quoteCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  quoteText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary, lineHeight: 20, fontStyle: "italic" },
  quoteAuthor: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.textSecondary, textAlign: "right" },
  tipCard: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  tipIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  tipText: { flex: 1 },
  tipTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 3 },
  tipDesc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 16 },
});
