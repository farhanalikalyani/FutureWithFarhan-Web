import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAllUsers, updateUserRole, deleteUserDoc } from "../../firebase/admin";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setUsers(await getAllUsers()); }
    catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function toggleAdmin(user) {
    Alert.alert(
      user.isAdmin ? "Remove Admin" : "Make Admin",
      `${user.isAdmin ? "Remove admin from" : "Make"} ${user.name}?`,
      [
        { text: "Cancel" },
        { text: "Confirm", onPress: async () => { await updateUserRole(user.id, !user.isAdmin); load(); } },
      ]
    );
  }

  async function handleDelete(user) {
    Alert.alert("Delete User", `Delete ${user.name}?`, [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteUserDoc(user.id); load(); } },
    ]);
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Users ({users.length})</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput style={styles.searchInput} placeholder="Search users..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
      </View>

      {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || "U"}</Text>
              </View>
              <View style={styles.userInfo}>
                <View style={styles.userRow}>
                  <Text style={styles.userName}>{user.name || "Unknown"}</Text>
                  {user.isAdmin && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userJoined}>Joined: {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</Text>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: user.isAdmin ? Colors.warning + "15" : Colors.success + "15" }]} onPress={() => toggleAdmin(user)}>
                  <Ionicons name={user.isAdmin ? "shield-outline" : "shield-checkmark-outline"} size={16} color={user.isAdmin ? Colors.warning : Colors.success} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.error + "15" }]} onPress={() => handleDelete(user)}>
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, flex: 1, textAlign: "center" },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, margin: 16, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  list: { flex: 1, paddingHorizontal: 16 },
  userCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  userInfo: { flex: 1 },
  userRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  userName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  adminBadge: { backgroundColor: Colors.gold + "20", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  adminBadgeText: { color: Colors.gold, fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  userEmail: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  userJoined: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 1 },
  userActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
