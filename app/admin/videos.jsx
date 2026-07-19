import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllVideos, addVideoAdmin, deleteVideoAdmin } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FPSC", "General"];
const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "English", "General Knowledge"];
const emptyForm = { title: "", url: "", category: "MDCAT", subject: "Biology", duration: "", instructor: "", description: "" };

export default function AdminVideos() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await getAllVideos()); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.title || !form.url) {
      Alert.alert("Error", "Title and URL are required");
      return;
    }
    setSaving(true);
    try {
      await addVideoAdmin(form);
      Alert.alert("Success", "Video added!");
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (e) {
      Alert.alert("Error", "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteVideoAdmin(id); load(); } },
    ]);
  }

  const filtered = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Lectures</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search videos..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="play-circle-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No videos yet</Text>
            </View>
          ) : filtered.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.thumbnail}>
                <Ionicons name="play-circle" size={28} color={Colors.white} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemMeta}>{item.subject} • {item.category}</Text>
                {item.instructor ? <Text style={styles.itemInstructor}>👨‍🏫 {item.instructor}</Text> : null}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Video Lecture</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.hint}>💡 Paste YouTube or Google Drive video link</Text>

              <Text style={styles.label}>Title *</Text>
              <TextInput style={styles.input} placeholder="Video title..." value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} />

              <Text style={styles.label}>Video URL *</Text>
              <TextInput style={styles.input} placeholder="https://youtube.com/watch?v=..." value={form.url} onChangeText={v => setForm(p => ({ ...p, url: v }))} autoCapitalize="none" />

              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat} style={[styles.chip, form.category === cat && styles.chipActive]} onPress={() => setForm(p => ({ ...p, category: cat }))}>
                    <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Subject</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {SUBJECTS.map(sub => (
                  <TouchableOpacity key={sub} style={[styles.chip, form.subject === sub && styles.chipActive]} onPress={() => setForm(p => ({ ...p, subject: sub }))}>
                    <Text style={[styles.chipText, form.subject === sub && styles.chipTextActive]}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Duration</Text>
              <TextInput style={styles.input} placeholder="e.g. 45 minutes" value={form.duration} onChangeText={v => setForm(p => ({ ...p, duration: v }))} />

              <Text style={styles.label}>Instructor Name</Text>
              <TextInput style={styles.input} placeholder="Teacher name..." value={form.instructor} onChangeText={v => setForm(p => ({ ...p, instructor: v }))} />

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline placeholder="What this video covers..." value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Add Video</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, flex: 1, textAlign: "center" },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, margin: 16, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  list: { flex: 1, paddingHorizontal: 16 },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: 12, textAlign: "center" },
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, overflow: "hidden", marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  thumbnail: { width: 70, height: 60, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1, padding: 12 },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  itemMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  itemInstructor: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  deleteBtn: { width: 44, height: 60, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontStyle: "italic", marginBottom: 14 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "92%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
