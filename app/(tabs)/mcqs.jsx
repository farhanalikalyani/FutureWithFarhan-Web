import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["All", "MDCAT", "ECAT", "NTS", "CSS", "PPSC", "General"];

export default function MCQsScreen() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});

  useEffect(() => { loadMCQs(); }, [category]);

  async function loadMCQs() {
    setLoading(true);
    setSelected({});
    setRevealed({});
    try {
      let q;
      if (category === "All") {
        q = query(collection(db, "mcqs"), orderBy("createdAt", "desc"));
      } else {
        q = query(collection(db, "mcqs"), where("category", "==", category));
      }
      const snapshot = await getDocs(q);
      setMcqs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("MCQs error:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(id, i) {
    if (revealed[id]) return;
    setSelected(p => ({ ...p, [id]: i }));
    setRevealed(p => ({ ...p, [id]: true }));
  }

  const filtered = mcqs.filter(m =>
    m.question?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const score = Object.keys(revealed).filter(id => {
    const m = mcqs.find(x => x.id === id);
    return m && selected[id] === m.correctAnswer;
  }).length;

  const total = Object.keys(revealed).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Practice MCQs 🎯</Text>
        <Text style={styles.headerSubtitle}>Test your knowledge</Text>
        {total > 0 && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>Score: {score}/{total} correct</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search MCQs..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

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
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="help-circle-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No MCQs Yet</Text>
            <Text style={styles.emptySubtitle}>Admin will add MCQs soon</Text>
          </View>
        ) : (
          filtered.map((mcq, index) => (
            <View key={mcq.id} style={styles.mcqCard}>
              <View style={styles.mcqTop}>
                <View style={styles.qNumBadge}>
                  <Text style={styles.qNum}>Q{index + 1}</Text>
                </View>
                <View style={styles.mcqMeta}>
                  <Text style={styles.mcqMetaText}>{mcq.subject} • {mcq.category}</Text>
                  {mcq.difficulty && (
                    <Text style={[styles.diffText, {
                      color: mcq.difficulty === "Easy" ? Colors.success :
                             mcq.difficulty === "Hard" ? Colors.error : Colors.warning
                    }]}>{mcq.difficulty}</Text>
                  )}
                </View>
              </View>

              <Text style={styles.question}>{mcq.question}</Text>

              {mcq.options?.map((opt, i) => {
                const isSelected = selected[mcq.id] === i;
                const isCorrect = mcq.correctAnswer === i;
                const isRevealed = revealed[mcq.id];
                let bg = Colors.background;
                let border = Colors.border;
                let color = Colors.textPrimary;

                if (isRevealed) {
                  if (isCorrect) { bg = Colors.success + "15"; border = Colors.success; color = Colors.success; }
                  else if (isSelected) { bg = Colors.error + "15"; border = Colors.error; color = Colors.error; }
                } else if (isSelected) {
                  bg = Colors.primary + "15"; border = Colors.primary; color = Colors.primary;
                }

                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => handleAnswer(mcq.id, i)}
                    disabled={!!revealed[mcq.id]}
                  >
                    <View style={[styles.optLetter, { borderColor: border, backgroundColor: (isSelected || (isRevealed && isCorrect)) ? border : "transparent" }]}>
                      <Text style={[styles.optLetterText, { color: (isSelected || (isRevealed && isCorrect)) ? Colors.white : color }]}>
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                    <Text style={[styles.optText, { color }]}>{opt}</Text>
                    {isRevealed && isCorrect && <Ionicons name="checkmark-circle" size={18} color={Colors.success} />}
                    {isRevealed && isSelected && !isCorrect && <Ionicons name="close-circle" size={18} color={Colors.error} />}
                  </TouchableOpacity>
                );
              })}

              {revealed[mcq.id] && mcq.explanation ? (
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>💡 Explanation</Text>
                  <Text style={styles.explanationText}>{mcq.explanation}</Text>
                </View>
              ) : null}
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
  scoreBox: { marginTop: 12, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, alignSelf: "flex-start" },
  scoreText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  body: { padding: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 48, marginBottom: 14, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 8, textAlign: "center" },
  mcqCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  mcqTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  qNumBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 10 },
  qNum: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  mcqMeta: { flex: 1, flexDirection: "row", justifyContent: "space-between" },
  mcqMetaText: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  diffText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  question: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 14, lineHeight: 22 },
  option: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1.5, gap: 10, marginBottom: 8 },
  optLetter: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  optLetterText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  optText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular },
  explanationBox: { marginTop: 12, backgroundColor: Colors.info + "10", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.info + "30" },
  explanationTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.info, marginBottom: 4 },
  explanationText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary, lineHeight: 20 },
});
