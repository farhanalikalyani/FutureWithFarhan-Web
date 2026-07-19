import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["All", "MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FPSC"];

export default function PastPapersScreen() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => { loadPapers(); }, [category]);

  async function loadPapers() {
    setLoading(true);
    try {
      let q;
      if (category === "All") {
        q = query(collection(db, "pastPapers"), orderBy("createdAt", "desc"));
      } else {
        q = query(collection(db, "pastPapers"), where("category", "==", category));
      }
      const snapshot = await getDocs(q);
      setPapers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Papers error:", e);
    } finally {
      setLoading(false);
    }
  }

  const grouped = papers.reduce((acc, paper) => {
    const key = paper.year || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(paper);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Past Papers 📋</Text>
        <Text style={styles.headerSubtitle}>Practice with previous exam papers</Text>
      </View>

      <View style={styles.body}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : papers.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="archive-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Past Papers Yet</Text>
            <Text style={styles.emptySubtitle}>Admin will upload papers soon</Text>
          </View>
        ) : (
          Object.keys(grouped).sort((a, b) => b - a).map(year => (
            <View key={year} style={styles.yearSection}>
              <View style={styles.yearHeader}>
                <Text style={styles.yearTitle}>{year}</Text>
                <Text style={styles.yearCount}>{grouped[year].length} papers</Text>
              </View>
              {grouped[year].map(paper => (
                <TouchableOpacity
                  key={paper.id}
                  style={styles.paperCard}
                  onPress={() => paper.fileURL && Linking.openURL(paper.fileURL)}
                  activeOpacity={0.8}
                >
                  <View style={styles.paperIcon}>
                    <Ionicons name="document-text-outline" size={22} color={Colors.error} />
                  </View>
                  <View style={styles.paperInfo}>
                    <Text style={styles.paperTitle}>{paper.title}</Text>
                    <Text style={styles.paperMeta}>{paper.category} • {paper.year}</Text>
                    {paper.description ? <Text style={styles.paperDesc}>{paper.description}</Text> : null}
                  </View>
                  <View style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={18} color={Colors.white} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
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
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 8, textAlign: "center" },
  yearSection: { marginBottom: 20 },
  yearHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  yearTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  yearCount: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted },
  paperCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  paperIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center", marginRight: 12 },
  paperInfo: { flex: 1 },
  paperTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  paperMeta: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  paperDesc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted, marginTop: 2 },
  downloadBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
});
