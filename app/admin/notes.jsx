import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllNotes, addNote, deleteNote, updateNote } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FPSC", "General"];
const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "English", "General Knowledge", "Current Affairs", "Pakistan Studies", "Urdu"];

const emptyForm = { title: "", fileURL: "", category: "MDCAT", subject: "Biology", description: "", pages: "", fileSize: "" };

export default function AdminNotes() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    setLoading(true);
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.title || !form.fileURL) { Alert.alert("Error", "Title and URL are required"); return; }
    setSaving(true);
    try {
      if (editingId) {
        await updateNote(editingId, form);
        Alert.alert("Success", "Note updated!");
      } else {
        await addNote(form);
        Alert.alert("Success", "Note added!");
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      loadNotes();
    } catch (e) { Alert.alert("Error", "Failed to save note"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete Note", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try { await deleteNote(id); loadNotes(); }
        catch (e) { Alert.alert("Error", "Failed to delete"); }
      }},
    ]);
  }

  function openEdit(note) {
    setForm({ title: note.title || "", fileURL: note.fileURL || "", category: note.category || "MDCAT", subject: note.subject || "Biology", description: note.description || "", pages: note.pages || "", fileSize: note.fileSize || "" });
    setEditingId(note.id);
    setShowModal(true);
  }

  const filtered = notes.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search notes..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="document-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No notes yet. Add your first note!</Text>
            </View>
          ) : filtered.map((note) => (
            <View key={note.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{note.title}</Text>
                  <Text style={styles.itemMeta}>{note.subject} • {note.category}</Text>
                </View>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(note)}>
                  <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(note.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? "Edit Note" : "Add Note"}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Title *</Text>
              <TextInput style={styles.input} placeholder="Note title" value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} />

              <Text style={styles.label}>PDF/Drive URL *</Text>
              <TextInput style={styles.input} placeholder="https://drive.google.com/..." value={form.fileURL} onChangeText={v => setForm(p => ({ ...p, fileURL: v }))} autoCapitalize="none" />

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

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline placeholder="Brief description..." value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Pages</Text>
                  <TextInput style={styles.input} placeholder="e.g. 45" keyboardType="numeric" value={form.pages} onChangeText={v => setForm(p => ({ ...p, pages: v }))} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>File Size</Text>
                  <TextInput style={styles.input} placeholder="e.g. 2MB" value={form.fileSize} onChangeText={v => setForm(p => ({ ...p, fileSize: v }))} />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>{editingId ? "Update Note" : "Add Note"}</Text>}
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
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
  list: { flex: 1, paddingHorizontal: 16 },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 12, textAlign: "center" },
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  itemLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  itemIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center", marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  itemMeta: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  itemActions: { flexDirection: "row", gap: 8 },
  editBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
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
