import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["All", "MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FPSC", "General"];

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { loadNotes(); }, [category]);

  async function loadNotes() {
    setLoading(true);
    try {
      let q;
      if (category === "All") {
        q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      } else {
        q = query(collection(db, "notes"), where("category", "==", category));
      }
      const snapshot = await getDocs(q);
      setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Notes error:", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = notes.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Notes 📚</Text>
        <Text style={styles.headerSubtitle}>Download notes for all exams</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
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
            <Ionicons name="document-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notes Yet</Text>
            <Text style={styles.emptySubtitle}>Check back soon or try a different category</Text>
          </View>
        ) : (
          filtered.map(note => (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => note.fileURL && Linking.openURL(note.fileURL)}
              activeOpacity={0.8}
            >
              <View style={styles.noteLeft}>
                <View style={styles.noteIcon}>
                  <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
                </View>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <Text style={styles.noteMeta}>{note.subject} • {note.category}</Text>
                  {note.description ? <Text style={styles.noteDesc} numberOfLines={2}>{note.description}</Text> : null}
                  <View style={styles.noteTags}>
                    {note.pages ? <Text style={styles.noteTag}>📄 {note.pages} pages</Text> : null}
                    {note.fileSize ? <Text style={styles.noteTag}>💾 {note.fileSize}</Text> : null}
                  </View>
                </View>
              </View>
              <View style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={20} color={Colors.white} />
              </View>
            </TouchableOpacity>
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
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 48, marginBottom: 14, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 8, textAlign: "center" },
  noteCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  noteLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start" },
  noteIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.primary + "18", alignItems: "center", justifyContent: "center", marginRight: 12 },
  noteInfo: { flex: 1 },
  noteTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  noteMeta: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  noteDesc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 4, lineHeight: 16 },
  noteTags: { flexDirection: "row", gap: 8, marginTop: 6 },
  noteTag: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted },
  downloadBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginLeft: 8 },
});
