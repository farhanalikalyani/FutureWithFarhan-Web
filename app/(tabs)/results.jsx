import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { RefreshableScrollView } from "../../components/ui/PullToRefresh";
import { EmptyState } from "../../components/ui/EmptyState";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function ResultsScreen() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { if (user) loadResults(); }, [user]);

  async function loadResults() {
    try {
      const q = query(
        collection(db, "testResults"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(30)
      );
      const snap = await getDocs(q);
      setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Results error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  const bestScore = results.length > 0
    ? Math.max(...results.map(r => r.score))
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Results 📈</Text>
        <Text style={styles.headerSubtitle}>Track your exam performance</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <RefreshableScrollView
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadResults(); }}
          contentContainerStyle={{ padding: 16 }}
        >
          {/* Summary Cards */}
          {results.length > 0 && (
            <View style={styles.summaryRow}>
              {[
                { label: "Tests Taken", value: results.length, icon: "clipboard-outline", color: Colors.primary },
                { label: "Average Score", value: `${avgScore}%`, icon: "stats-chart-outline", color: Colors.info },
                { label: "Best Score", value: `${bestScore}%`, icon: "trophy-outline", color: Colors.gold },
              ].map((stat, i) => (
                <View key={i} style={styles.summaryCard}>
                  <View style={[styles.summaryIcon, { backgroundColor: stat.color + "18" }]}>
                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={[styles.summaryValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.summaryLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}

          {results.length === 0 ? (
            <EmptyState
              icon="clipboard-outline"
              title="No Tests Yet"
              subtitle="Take your first mock test to see your results here!"
            />
          ) : (
            results.map((result, i) => {
              const scoreColor = result.score >= 70 ? Colors.success
                : result.score >= 50 ? Colors.warning : Colors.error;
              return (
                <View key={result.id} style={styles.resultCard}>
                  <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
                    <Text style={[styles.scoreNum, { color: scoreColor }]}>{result.score}%</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultExam}>{result.examName}</Text>
                    <Text style={styles.resultDate}>{result.date}</Text>
                    <View style={styles.resultStats}>
                      <Text style={[styles.resultStat, { color: Colors.success }]}>
                        ✓ {result.correct} correct
                      </Text>
                      <Text style={[styles.resultStat, { color: Colors.error }]}>
                        ✗ {result.wrong} wrong
                      </Text>
                      <Text style={[styles.resultStat, { color: Colors.warning }]}>
                        — {result.skipped} skipped
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.resultBadge, { backgroundColor: scoreColor + "15" }]}>
                    <Text style={[styles.resultBadgeText, { color: scoreColor }]}>
                      {result.score >= 70 ? "Excellent" : result.score >= 50 ? "Good" : "Practice"}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </RefreshableScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20,
  },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, marginTop: 4 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 14,
    padding: 12, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  summaryIcon: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: "center", justifyContent: "center", marginBottom: 6,
  },
  summaryValue: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  summaryLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2, textAlign: "center" },
  resultCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  scoreCircle: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 3, alignItems: "center",
    justifyContent: "center", marginRight: 14,
  },
  scoreNum: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  resultInfo: { flex: 1 },
  resultExam: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  resultDate: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  resultStats: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
  resultStat: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium },
  resultBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  resultBadgeText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
});
