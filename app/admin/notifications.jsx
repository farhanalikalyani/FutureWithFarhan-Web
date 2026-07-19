import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllNotifications, addNotification, deleteNotification } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const PRIORITIES = ["Normal", "Important", "Urgent"];
const emptyForm = { title: "", description: "", priority: "Normal", category: "General" };

export default function AdminNotifications() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setItems(await getAllNotifications()); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.title) { Alert.alert("Error", "Title required"); return; }
    setSaving(true);
    try {
      await addNotification(form);
      Alert.alert("Success", "Notification sent!");
      setShowModal(false); setForm(emptyForm); load();
    } catch (e) { Alert.alert("Error", "Failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteNotification(id); load(); } },
    ]);
  }

  const priorityColor = { Normal: Colors.info, Important: Colors.warning, Urgent: Colors.error };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setForm(emptyForm); setShowModal(true); }}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
        <ScrollView style={styles.list} contentContainerStyle={{ padding: 16 }}>
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="notifications-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.priorityBar, { backgroundColor: priorityColor[item.priority] || Colors.info }]} />
              <View style={styles.itemInfo}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={[styles.priorityBadge, { color: priorityColor[item.priority] || Colors.info }]}>{item.priority}</Text>
                </View>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
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
              <Text style={styles.modalTitle}>Send Notification</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Title *</Text>
              <TextInput style={styles.input} placeholder="Notification title..." value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} />

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Notification details..." value={form.description} onChangeText={v => setForm(p => ({ ...p, description: v }))} />

              <Text style={styles.label}>Priority</Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {PRIORITIES.map(p => (
                  <TouchableOpacity key={p} style={[styles.chip, form.priority === p && styles.chipActive]} onPress={() => setForm(prev => ({ ...prev, priority: p }))}>
                    <Text style={[styles.chipText, form.priority === p && styles.chipTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="send-outline" size={18} color={Colors.white} />
                    <Text style={styles.saveBtnText}>Send Notification</Text>
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
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, flex: 1, textAlign: "center" },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  list: { flex: 1 },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm, marginTop: 12 },
  itemCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, overflow: "hidden" },
  priorityBar: { width: 4, height: "100%", position: "absolute", left: 0, top: 0, bottom: 0 },
  itemInfo: { flex: 1, paddingLeft: 8 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary, flex: 1 },
  priorityBadge: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  itemDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 4 },
  deleteBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: Colors.error + "15", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
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
