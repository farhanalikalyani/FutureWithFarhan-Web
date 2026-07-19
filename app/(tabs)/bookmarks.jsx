import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getUserBookmarks, removeBookmark } from "../../firebase/bookmarks";
import { useAuth } from "../../context/AuthContext";
import { RefreshableScrollView } from "../../components/ui/PullToRefresh";
import { EmptyState } from "../../components/ui/EmptyState";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const TYPE_CONFIG = {
  note: { icon: "document-text-outline", color: "#10B981", label: "Note" },
  mcq: { icon: "help-circle-outline", color: "#8B5CF6", label: "MCQ" },
  paper: { icon: "archive-outline", color: "#F59E0B", label: "Past Paper" },
  video: { icon: "play-circle-outline", color: "#EF4444", label: "Video" },
  scholarship: { icon: "ribbon-outline", color: "#EC4899", label: "Scholarship" },
};

export default function BookmarksScreen() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    try {
      const data = await getUserBookmarks(user.uid);
      setBookmarks(data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); setRefreshing(false); }
  }

  async function handleRemove(itemId) {
    await removeBookmark(user.uid, itemId);
    setBookmarks(prev => prev.filter(b => b.itemId !== itemId));
  }

  const TYPES = ["all", "note", "paper", "mcq", "video", "scholarship"];
  const filtered = filter === "all" ? bookmarks : bookmarks.filter(b => b.type === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks 🔖</Text>
        <Text style={styles.headerSubtitle}>Your saved content</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <RefreshableScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 44 }}
        >
          {TYPES.map(t => (
            <TouchableOpacity key={t} style={[styles.filterChip, filter === t && styles.filterChipActive]} onPress={() => setFilter(t)}>
              <Text style={[styles.filterText, filter === t && styles.filterTextActive]}>
                {t === "all" ? "All" : TYPE_CONFIG[t]?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </RefreshableScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <RefreshableScrollView
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          contentContainerStyle={{ padding: 16 }}
        >
          {filtered.length === 0 ? (
            <EmptyState
              icon="bookmark-outline"
              title="No Bookmarks Yet"
              subtitle="Save notes, MCQs, papers and videos by tapping the bookmark icon."
            />
          ) : filtered.map(item => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.note;
            return (
              <View key={item.id} style={styles.bookmarkCard}>
                <View style={[styles.bookmarkIcon, { backgroundColor: config.color + "18" }]}>
                  <Ionicons name={config.icon} size={22} color={config.color} />
                </View>
                <View style={styles.bookmarkInfo}>
                  <Text style={styles.bookmarkTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.bookmarkMeta}>
                    <Text style={[styles.bookmarkType, { color: config.color }]}>{config.label}</Text>
                    {item.category ? <Text style={styles.bookmarkCat}>• {item.category}</Text> : null}
                  </View>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.itemId)}>
                  <Ionicons name="bookmark" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            );
          })}
        </RefreshableScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, marginTop: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  bookmarkCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  bookmarkIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  bookmarkInfo: { flex: 1 },
  bookmarkTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  bookmarkMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  bookmarkType: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  bookmarkCat: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  removeBtn: { padding: 6 },
});
