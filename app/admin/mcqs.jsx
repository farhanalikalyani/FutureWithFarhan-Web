import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllMCQs, addMCQAdmin, deleteMCQAdmin } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FPSC", "General"];
const SUBJECTS = ["Biology", "Chemistry", "Physics", "Mathematics", "English", "General Knowledge"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const emptyForm = { question: "", options: ["", "", "", ""], correctAnswer: 0, category: "MDCAT", subject: "Biology", difficulty: "Medium", explanation: "" };

export default function AdminMCQs() {
  const router = useRouter();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  useEffect(() => { loadMCQs(); }, []);

  async function loadMCQs() {
    setLoading(true);
    try { const data = await getAllMCQs(); setMcqs(data); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.question || form.options.some(o => !o)) { Alert.alert("Error", "Fill all fields"); return; }
    setSaving(true);
    try {
      await addMCQAdmin(form);
      Alert.alert("Success", "MCQ added!");
      setShowModal(false);
      setForm(emptyForm);
      loadMCQs();
    } catch (e) { Alert.alert("Error", "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete MCQ", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteMCQAdmin(id); loadMCQs(); } },
    ]);
  }

  const filtered = mcqs.filter(m => m.question?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MCQ Management</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search MCQs..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="help-circle-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No MCQs yet. Add your first MCQ!</Text>
            </View>
          ) : filtered.map((mcq, i) => (
            <View key={mcq.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Text style={styles.itemNum}>{i + 1}</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{mcq.question}</Text>
                  <Text style={styles.itemMeta}>{mcq.subject} • {mcq.category} • {mcq.difficulty}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(mcq.id)}>
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
              <Text style={styles.modalTitle}>Add MCQ</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Question *</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Enter question..." value={form.question} onChangeText={v => setForm(p => ({ ...p, question: v }))} />

              <Text style={styles.label}>Options * (tap radio = correct answer)</Text>
              {form.options.map((opt, i) => (
                <View key={i} style={styles.optionRow}>
                  <TouchableOpacity style={[styles.radio, form.correctAnswer === i && styles.radioActive]} onPress={() => setForm(p => ({ ...p, correctAnswer: i }))}>
                    {form.correctAnswer === i && <View style={styles.radioDot} />}
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChangeText={v => { const opts = [...form.options]; opts[i] = v; setForm(p => ({ ...p, options: opts })); }}
                  />
                </View>
              ))}

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

              <Text style={styles.label}>Difficulty</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {DIFFICULTIES.map(d => (
                  <TouchableOpacity key={d} style={[styles.chip, form.difficulty === d && styles.chipActive]} onPress={() => setForm(p => ({ ...p, difficulty: d }))}>
                    <Text style={[styles.chipText, form.difficulty === d && styles.chipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Explanation (optional)</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline placeholder="Explain the answer..." value={form.explanation} onChangeText={v => setForm(p => ({ ...p, explanation: v }))} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Add MCQ</Text>}
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
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  itemLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  itemIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
  itemNum: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  itemMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "92%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: Colors.success },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
