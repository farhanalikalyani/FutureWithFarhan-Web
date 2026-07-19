import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Switch } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CITIES = ["Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta", "Faisalabad", "Multan", "Rawalpindi", "Hyderabad", "Sialkot"];
const SECTORS = ["Public", "Private", "Semi-Government"];
const COLORS = ["#1A3C6E", "#EF4444", "#10B981", "#8B5CF6", "#F5A623", "#EC4899", "#14B8A6", "#6366F1", "#0EA5E9", "#F59E0B"];

const emptyForm = {
  name: "", city: "Islamabad", sector: "Public", ranking: "",
  description: "", fee: "", merit: "", deadline: "", website: "",
  hostel: true, admissionOpen: true, color: "#1A3C6E",
  programs: "BS, MS, PhD", faculties: "Sciences, Arts, Engineering",
};

export default function AdminUniversities() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, "universities"), orderBy("ranking")));
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.name || !form.city) { Alert.alert("Error", "Name and city are required"); return; }
    setSaving(true);
    try {
      const data = {
        ...form,
        ranking: parseInt(form.ranking) || 99,
        programs: form.programs.split(",").map(p => p.trim()).filter(Boolean),
        faculties: form.faculties.split(",").map(f => f.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "universities", editingId), data);
        Alert.alert("Success", "University updated!");
      } else {
        await addDoc(collection(db, "universities"), { ...data, createdAt: serverTimestamp() });
        Alert.alert("Success", "University added!");
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) { Alert.alert("Error", "Failed to save"); console.log(e); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete University", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteDoc(doc(db, "universities", id)); load(); } },
    ]);
  }

  function openEdit(item) {
    setForm({
      name: item.name || "",
      city: item.city || "Islamabad",
      sector: item.sector || "Public",
      ranking: item.ranking?.toString() || "",
      description: item.description || "",
      fee: item.fee || "",
      merit: item.merit || "",
      deadline: item.deadline || "",
      website: item.website || "",
      hostel: item.hostel !== false,
      admissionOpen: item.admissionOpen !== false,
      color: item.color || "#1A3C6E",
      programs: Array.isArray(item.programs) ? item.programs.join(", ") : item.programs || "",
      faculties: Array.isArray(item.faculties) ? item.faculties.join(", ") : item.faculties || "",
    });
    setEditingId(item.id);
    setShowModal(true);
  }

  const filtered = items.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Universities ({items.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search universities..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No universities yet. Add your first one!</Text>
            </View>
          ) : filtered.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.colorBar, { backgroundColor: item.color || Colors.primary }]} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemMeta}>{item.city} • {item.sector} • Rank #{item.ranking}</Text>
                <View style={styles.itemBadges}>
                  {item.admissionOpen ? (
                    <Text style={styles.openBadge}>🟢 Open</Text>
                  ) : (
                    <Text style={styles.closedBadge}>🔴 Closed</Text>
                  )}
                </View>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
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
              <Text style={styles.modalTitle}>{editingId ? "Edit University" : "Add University"}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

              <Text style={styles.label}>University Name *</Text>
              <TextInput style={styles.input} placeholder="e.g. NUST" value={form.name} onChangeText={v => setForm(p => ({ ...p, name: v }))} />

              <Text style={styles.label}>National Ranking</Text>
              <TextInput style={styles.input} placeholder="e.g. 1" keyboardType="numeric" value={form.ranking} onChangeText={v => setForm(p => ({ ...p, ranking: v }))} />

              <Text style={styles.label}>City</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CITIES.map(c => (
                  <TouchableOpacity key={c} style={[styles.chip, form.city === c && styles.chipActive]} onPress={() => setForm(p => ({ ...p, city: c }))}>
                    <Text style={[styles.chipText, form.city === c && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Sector</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {SECTORS.map(s => (
                  <TouchableOpacity key={s} style={[styles.chip, form.sector === s && styles.chipActive]} onPress={() => setForm(p => ({ ...p, sector: s }))}>
                    <Text style={[styles.chipText, form.sector === s && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Card Color</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {COLORS.map(c => (
                  <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, form.color === c && styles.colorDotActive]} onPress={() => setForm(p => ({ ...p, color: c }))} />
                ))}
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="About this university..." value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} />

              <Text style={styles.label}>Programs (comma separated)</Text>
              <TextInput style={styles.input} placeholder="BS, MS, PhD, BE" value={form.programs} onChangeText={v => setForm(p => ({ ...p, programs: v }))} />

              <Text style={styles.label}>Faculties (comma separated)</Text>
              <TextInput style={styles.input} placeholder="Engineering, Computer Science, Business" value={form.faculties} onChangeText={v => setForm(p => ({ ...p, faculties: v }))} />

              <Text style={styles.label}>Fee Range</Text>
              <TextInput style={styles.input} placeholder="PKR 50,000 - 150,000/semester" value={form.fee} onChangeText={v => setForm(p => ({ ...p, fee: v }))} />

              <Text style={styles.label}>Merit Criteria</Text>
              <TextInput style={styles.input} placeholder="e.g. MDCAT 65%+ or NET Score 100+" value={form.merit} onChangeText={v => setForm(p => ({ ...p, merit: v }))} />

              <Text style={styles.label}>Admission Deadline</Text>
              <TextInput style={styles.input} placeholder="e.g. Aug 15, 2025" value={form.deadline} onChangeText={v => setForm(p => ({ ...p, deadline: v }))} />

              <Text style={styles.label}>Official Website</Text>
              <TextInput style={styles.input} placeholder="https://..." value={form.website} onChangeText={v => setForm(p => ({ ...p, website: v }))} autoCapitalize="none" />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Hostel Available</Text>
                <Switch value={form.hostel} onValueChange={v => setForm(p => ({ ...p, hostel: v }))} trackColor={{ true: Colors.primary }} />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.label}>Admissions Open</Text>
                <Switch value={form.admissionOpen} onValueChange={v => setForm(p => ({ ...p, admissionOpen: v }))} trackColor={{ true: Colors.success }} />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>{editingId ? "Update University" : "Add University"}</Text>}
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
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, overflow: "hidden" },
  colorBar: { width: 6, alignSelf: "stretch" },
  itemInfo: { flex: 1, padding: 14 },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  itemMeta: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  itemBadges: { flexDirection: "row", gap: 8, marginTop: 4 },
  openBadge: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.success },
  closedBadge: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.error },
  itemActions: { flexDirection: "row", gap: 8, paddingRight: 12 },
  editBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "95%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotActive: { borderWidth: 3, borderColor: Colors.textPrimary },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
