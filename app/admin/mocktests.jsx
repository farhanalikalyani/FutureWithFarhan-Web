import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Switch } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const EXAM_CATEGORIES = ["MDCAT", "ECAT", "NTS", "CSS", "PPSC", "FAST", "NUST", "General"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const emptyMCQ = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  category: "MDCAT",
  subject: "Biology",
  difficulty: "Medium",
  explanation: "",
};

export default function AdminMockTests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("mcqs");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMCQ);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  useEffect(() => { loadMCQs(); }, []);

  async function loadMCQs() {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, "mcqs"), orderBy("createdAt", "desc")));
      setMcqs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.question.trim() || form.options.some(o => !o.trim())) {
      Alert.alert("Error", "Fill question and all 4 options");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "mcqs", editingId), { ...form, updatedAt: serverTimestamp() });
        Alert.alert("Success", "MCQ updated!");
      } else {
        await addDoc(collection(db, "mcqs"), { ...form, createdAt: serverTimestamp() });
        Alert.alert("Success", "MCQ added!");
      }
      setShowModal(false);
      setForm(emptyMCQ);
      setEditingId(null);
      loadMCQs();
    } catch (e) { Alert.alert("Error", "Failed to save MCQ"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete MCQ", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteDoc(doc(db, "mcqs", id)); loadMCQs(); } },
    ]);
  }

  function openEdit(mcq) {
    setForm({
      question: mcq.question || "",
      options: mcq.options || ["", "", "", ""],
      correctAnswer: mcq.correctAnswer || 0,
      category: mcq.category || "MDCAT",
      subject: mcq.subject || "Biology",
      difficulty: mcq.difficulty || "Medium",
      explanation: mcq.explanation || "",
    });
    setEditingId(mcq.id);
    setShowModal(true);
  }

  const filtered = mcqs.filter(m => {
    const matchSearch = m.question?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || m.category === filterCat;
    return matchSearch && matchCat;
  });

  const catCounts = EXAM_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = mcqs.filter(m => m.category === cat).length;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mock Tests & MCQs ({mcqs.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyMCQ); setEditingId(null); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <TouchableOpacity style={[styles.statChip, filterCat === "All" && styles.statChipActive]} onPress={() => setFilterCat("All")}>
          <Text style={[styles.statChipText, filterCat === "All" && styles.statChipTextActive]}>All ({mcqs.length})</Text>
        </TouchableOpacity>
        {EXAM_CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.statChip, filterCat === cat && styles.statChipActive]} onPress={() => setFilterCat(cat)}>
            <Text style={[styles.statChipText, filterCat === cat && styles.statChipTextActive]}>{cat} ({catCounts[cat] || 0})</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search MCQs..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="help-circle-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No MCQs yet. Add your first one!</Text>
            </View>
          ) : filtered.map((mcq, i) => (
            <View key={mcq.id} style={styles.mcqCard}>
              <View style={styles.mcqHeader}>
                <View style={styles.mcqBadgeRow}>
                  <View style={styles.qNumBadge}><Text style={styles.qNumText}>Q{i + 1}</Text></View>
                  <Text style={styles.mcqCat}>{mcq.category}</Text>
                  <Text style={styles.mcqDiff}>{mcq.difficulty}</Text>
                </View>
                <View style={styles.mcqActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(mcq)}>
                    <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(mcq.id)}>
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.mcqQuestion} numberOfLines={2}>{mcq.question}</Text>
              <View style={styles.optionsPreview}>
                {mcq.options?.map((opt, idx) => (
                  <Text key={idx} style={[styles.optPreview, idx === mcq.correctAnswer && styles.optPreviewCorrect]}>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add/Edit MCQ Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? "Edit MCQ" : "Add MCQ"}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Question *</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                multiline
                placeholder="Enter the question..."
                value={form.question}
                onChangeText={v => setForm(p => ({ ...p, question: v }))}
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.label}>Options * (tap ● to mark correct answer)</Text>
              {form.options.map((opt, i) => (
                <View key={i} style={styles.optionRow}>
                  <TouchableOpacity
                    style={[styles.radioBtn, form.correctAnswer === i && styles.radioBtnActive]}
                    onPress={() => setForm(p => ({ ...p, correctAnswer: i }))}
                  >
                    {form.correctAnswer === i && <View style={styles.radioDot} />}
                  </TouchableOpacity>
                  <View style={[styles.optionLabel, form.correctAnswer === i && { backgroundColor: Colors.success }]}>
                    <Text style={[styles.optionLabelText, form.correctAnswer === i && { color: Colors.white }]}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChangeText={v => {
                      const opts = [...form.options];
                      opts[i] = v;
                      setForm(p => ({ ...p, options: opts }));
                    }}
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              ))}

              <Text style={styles.label}>Exam Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {EXAM_CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat} style={[styles.chip, form.category === cat && styles.chipActive]} onPress={() => setForm(p => ({ ...p, category: cat }))}>
                    <Text style={[styles.chipText, form.category === cat && styles.chipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Biology, Physics, Math"
                value={form.subject}
                onChangeText={v => setForm(p => ({ ...p, subject: v }))}
                placeholderTextColor={Colors.textMuted}
              />

              <Text style={styles.label}>Difficulty</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {DIFFICULTIES.map(d => (
                  <TouchableOpacity key={d} style={[styles.chip, form.difficulty === d && styles.chipActive]} onPress={() => setForm(p => ({ ...p, difficulty: d }))}>
                    <Text style={[styles.chipText, form.difficulty === d && styles.chipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Explanation (optional)</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                multiline
                placeholder="Explain why this is the correct answer..."
                value={form.explanation}
                onChangeText={v => setForm(p => ({ ...p, explanation: v }))}
                placeholderTextColor={Colors.textMuted}
              />

              <View style={styles.correctAnswerPreview}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.correctAnswerText}>
                  Correct Answer: Option {String.fromCharCode(65 + form.correctAnswer)}
                  {form.options[form.correctAnswer] ? ` — ${form.options[form.correctAnswer]}` : ""}
                </Text>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : (
                  <Text style={styles.saveBtnText}>{editingId ? "Update MCQ" : "Add MCQ"}</Text>
                )}
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
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, flex: 1, textAlign: "center" },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  statsScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 56 },
  statChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  statChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  statChipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  statChipTextActive: { color: Colors.white },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, margin: 16, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  list: { flex: 1, paddingHorizontal: 16 },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: 12 },
  mcqCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  mcqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  mcqBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qNumBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  qNumText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  mcqCat: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.primary, backgroundColor: Colors.primary + "15", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  mcqDiff: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.warning, backgroundColor: Colors.warning + "15", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  mcqActions: { flexDirection: "row", gap: 8 },
  editBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  mcqQuestion: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 8 },
  optionsPreview: { gap: 3 },
  optPreview: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  optPreviewCorrect: { color: Colors.success, fontFamily: Fonts.semiBold },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "95%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  radioBtn: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  radioBtnActive: { borderColor: Colors.success },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  optionLabel: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border },
  optionLabelText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  correctAnswerPreview: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.success + "10", borderRadius: 10, padding: 12, marginBottom: 14 },
  correctAnswerText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.success },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
