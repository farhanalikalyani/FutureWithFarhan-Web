import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Linking } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const DOC_TYPES = [
  { id: "certificate", label: "Certificate", icon: "ribbon-outline", color: "#F5A623" },
  { id: "result", label: "Result Card", icon: "document-text-outline", color: "#10B981" },
  { id: "cv", label: "CV/Resume", icon: "person-outline", color: "#3B82F6" },
  { id: "cnic", label: "CNIC", icon: "card-outline", color: "#EF4444" },
  { id: "fee", label: "Fee Challan", icon: "receipt-outline", color: "#8B5CF6" },
  { id: "other", label: "Other", icon: "folder-outline", color: "#14B8A6" },
];

const emptyForm = { title: "", type: "certificate", url: "", description: "", date: "" };

export default function LockerScreen() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [activeType, setActiveType] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { if (user) loadDocs(); }, [user]);

  async function loadDocs() {
    setLoading(true);
    try {
      const q = query(collection(db, "locker"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setDocs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function saveDoc() {
    if (!form.title || !form.url) { Alert.alert("Error", "Title and URL are required"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "locker"), {
        ...form, userId: user.uid, createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setForm(emptyForm);
      loadDocs();
      Alert.alert("Success", "Document saved to locker!");
    } catch (e) { Alert.alert("Error", "Failed to save"); }
    finally { setSaving(false); }
  }

  async function deleteDocument(id) {
    Alert.alert("Delete Document", "Remove from locker?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteDoc(doc(db, "locker", id)); loadDocs(); } },
    ]);
  }

  const filtered = docs.filter(d => {
    const matchType = activeType === "all" || d.type === activeType;
    const matchSearch = d.title?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const getDocType = (type) => DOC_TYPES.find(t => t.id === type) || DOC_TYPES[5];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Locker 🔐</Text>
        <Text style={styles.headerSubtitle}>Securely store your important documents</Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{docs.length}</Text>
            <Text style={styles.statLabel}>Documents</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{DOC_TYPES.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>🔒</Text>
            <Text style={styles.statLabel}>Secure</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
            <TextInput style={styles.searchInput} placeholder="Search documents..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setShowModal(true); }}>
            <Ionicons name="add" size={20} color={Colors.white} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
          <TouchableOpacity style={[styles.typeChip, activeType === "all" && styles.typeChipActive]} onPress={() => setActiveType("all")}>
            <Text style={[styles.typeChipText, activeType === "all" && styles.typeChipTextActive]}>All</Text>
          </TouchableOpacity>
          {DOC_TYPES.map(t => (
            <TouchableOpacity key={t.id} style={[styles.typeChip, activeType === t.id && styles.typeChipActive]} onPress={() => setActiveType(t.id)}>
              <Ionicons name={t.icon} size={14} color={activeType === t.id ? Colors.white : t.color} />
              <Text style={[styles.typeChipText, activeType === t.id && styles.typeChipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.categoriesGrid}>
          {DOC_TYPES.map(type => {
            const count = docs.filter(d => d.type === type.id).length;
            return (
              <TouchableOpacity key={type.id} style={[styles.categoryCard, activeType === type.id && styles.categoryCardActive]} onPress={() => setActiveType(activeType === type.id ? "all" : type.id)}>
                <View style={[styles.categoryIcon, { backgroundColor: type.color + "18" }]}>
                  <Ionicons name={type.icon} size={22} color={type.color} />
                </View>
                <Text style={styles.categoryLabel}>{type.label}</Text>
                <Text style={styles.categoryCount}>{count}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Your Documents ({filtered.length})</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="lock-open-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Documents Yet</Text>
              <Text style={styles.emptySubtitle}>Add your certificates, results, CV and more to keep them safe!</Text>
              <TouchableOpacity style={styles.addFirstBtn} onPress={() => setShowModal(true)}>
                <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
                <Text style={styles.addFirstBtnText}>Add First Document</Text>
              </TouchableOpacity>
            </View>
          ) : filtered.map(document => {
            const docType = getDocType(document.type);
            return (
              <View key={document.id} style={styles.docCard}>
                <View style={[styles.docIcon, { backgroundColor: docType.color + "18" }]}>
                  <Ionicons name={docType.icon} size={24} color={docType.color} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docTitle}>{document.title}</Text>
                  <View style={[styles.docTypeBadge, { backgroundColor: docType.color + "15" }]}>
                    <Text style={[styles.docTypeText, { color: docType.color }]}>{docType.label}</Text>
                  </View>
                  {document.description ? <Text style={styles.docDesc} numberOfLines={1}>{document.description}</Text> : null}
                  {document.date ? <Text style={styles.docDate}>{document.date}</Text> : null}
                </View>
                <View style={styles.docActions}>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => Linking.openURL(document.url)}>
                    <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteDocument(document.id)}>
                    <Ionicons name="trash-outline" size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Document</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Document Title *</Text>
              <TextInput style={styles.input} placeholder="e.g. MDCAT Certificate 2024" value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} placeholderTextColor={Colors.textMuted} />

              <Text style={styles.label}>Document Type</Text>
              <View style={styles.typeGrid}>
                {DOC_TYPES.map(t => (
                  <TouchableOpacity key={t.id} style={[styles.typeOption, form.type === t.id && { backgroundColor: t.color, borderColor: t.color }]} onPress={() => setForm(p => ({ ...p, type: t.id }))}>
                    <Ionicons name={t.icon} size={18} color={form.type === t.id ? Colors.white : t.color} />
                    <Text style={[styles.typeOptionText, form.type === t.id && { color: Colors.white }]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Document URL * (Google Drive Link)</Text>
              <TextInput style={styles.input} placeholder="https://drive.google.com/..." value={form.url} onChangeText={v => setForm(p => ({ ...p, url: v }))} autoCapitalize="none" placeholderTextColor={Colors.textMuted} />

              <View style={styles.hintBox}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.info} />
                <Text style={styles.hintText}>Upload to Google Drive → Share → Anyone with link → Copy link</Text>
              </View>

              <Text style={styles.label}>Date (optional)</Text>
              <TextInput style={styles.input} placeholder="e.g. June 2024" value={form.date} onChangeText={v => setForm(p => ({ ...p, date: v }))} placeholderTextColor={Colors.textMuted} />

              <Text style={styles.label}>Description (optional)</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline placeholder="Brief description..." value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} placeholderTextColor={Colors.textMuted} />

              <TouchableOpacity style={styles.saveBtn} onPress={saveDoc} disabled={saving}>
                {saving ? null : (
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <Ionicons name="lock-closed-outline" size={18} color={Colors.white} />
                    <Text style={styles.saveBtnText}>Save to Locker</Text>
                  </View>
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
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  headerStats: { flexDirection: "row", alignItems: "center", marginTop: 16, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.xs, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.3)" },
  body: { flex: 1, padding: 16 },
  topRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  searchRow: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 14, height: 44 },
  addBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  typeScroll: { marginBottom: 14 },
  typeChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.white },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  categoryCard: { width: "30%", backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  categoryCardActive: { borderWidth: 2, borderColor: Colors.primary },
  categoryIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  categoryLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textPrimary, textAlign: "center" },
  categoryCount: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.primary, marginTop: 2 },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 14 },
  emptyBox: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 8, textAlign: "center", lineHeight: 20 },
  addFirstBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  addFirstBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  docCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  docIcon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  docInfo: { flex: 1 },
  docTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  docTypeBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  docTypeText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  docDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 3 },
  docDate: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  docActions: { flexDirection: "row", gap: 8 },
  viewBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center" },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "92%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  typeOption: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  typeOptionText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  hintBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: Colors.info + "10", borderRadius: 10, padding: 10, marginBottom: 14 },
  hintText: { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.info, lineHeight: 18 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
