import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllScholarships, addScholarship, deleteScholarship, updateScholarship } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const TYPES = ["Need Based", "Merit Based", "International", "Government", "Private"];
const emptyForm = { name: "", organization: "", description: "", eligibility: "", deadline: "", applyLink: "", amount: "", type: "Merit Based" };

export default function AdminScholarships() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await getAllScholarships()); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.name) { Alert.alert("Error", "Name is required"); return; }
    setSaving(true);
    try {
      if (editingId) { await updateScholarship(editingId, form); Alert.alert("Success", "Updated!"); }
      else { await addScholarship(form); Alert.alert("Success", "Added!"); }
      setShowModal(false); setForm(emptyForm); setEditingId(null); load();
    } catch (e) { Alert.alert("Error", "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteScholarship(id); load(); } },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scholarships</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
        <ScrollView style={styles.list} contentContainerStyle={{ padding: 16 }}>
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="school-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No scholarships yet</Text>
            </View>
          ) : items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemMeta}>{item.organization} • {item.type}</Text>
                <Text style={styles.itemDeadline}>Deadline: {item.deadline}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => { setForm({ name: item.name || "", organization: item.organization || "", description: item.description || "", eligibility: item.eligibility || "", deadline: item.deadline || "", applyLink: item.applyLink || "", amount: item.amount || "", type: item.type || "Merit Based" }); setEditingId(item.id); setShowModal(true); }}>
                  <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? "Edit Scholarship" : "Add Scholarship"}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { key: "name", label: "Scholarship Name *", placeholder: "e.g. HEC Scholarship" },
                { key: "organization", label: "Organization", placeholder: "e.g. HEC Pakistan" },
                { key: "amount", label: "Amount", placeholder: "e.g. Full Tuition / PKR 50,000" },
                { key: "deadline", label: "Deadline", placeholder: "e.g. June 30, 2025" },
                { key: "applyLink", label: "Apply Link", placeholder: "https://..." },
                { key: "eligibility", label: "Eligibility", placeholder: "Who can apply..." },
                { key: "description", label: "Description", placeholder: "About this scholarship..." },
              ].map(f => (
                <View key={f.key}>
                  <Text style={styles.label}>{f.label}</Text>
                  <TextInput style={[styles.input, (f.key === "description" || f.key === "eligibility") && { height: 70 }]} multiline={f.key === "description" || f.key === "eligibility"} placeholder={f.placeholder} value={form[f.key]} onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))} autoCapitalize={f.key === "applyLink" ? "none" : "sentences"} />
                </View>
              ))}

              <Text style={styles.label}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {TYPES.map(t => (
                  <TouchableOpacity key={t} style={[styles.chip, form.type === t && styles.chipActive]} onPress={() => setForm(p => ({ ...p, type: t }))}>
                    <Text style={[styles.chipText, form.type === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>{editingId ? "Update" : "Add Scholarship"}</Text>}
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
  list: { flex: 1 },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: 12 },
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  itemMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  itemDeadline: { fontSize: Fonts.sizes.xs, color: Colors.error, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "92%" },
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
