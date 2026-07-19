import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["All", "MDCAT", "ECAT", "CSS", "Scholarships", "University", "Career", "General"];
const TAGS_COLOR = { MDCAT: "#EF4444", ECAT: "#3B82F6", CSS: "#10B981", Scholarships: "#F5A623", University: "#8B5CF6", Career: "#EC4899", General: "#14B8A6" };

export default function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [showPost, setShowPost] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "General" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, "community"), orderBy("createdAt", "desc")));
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  }

  async function submitPost() {
    if (!form.title || !form.content) { Alert.alert("Error", "Title and content required"); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, "community"), {
        ...form,
        authorName: user?.displayName || "Anonymous",
        authorId: user?.uid,
        createdAt: serverTimestamp(),
        likes: 0,
        replies: 0,
      });
      setShowPost(false);
      setForm({ title: "", content: "", category: "General" });
      loadPosts();
    } catch (e) { Alert.alert("Error", "Failed to post"); }
    finally { setSaving(false); }
  }

  async function likePost(id) {
    try {
      await updateDoc(doc(db, "community", id), { likes: increment(1) });
      setPosts(posts.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    } catch (e) { console.log(e); }
  }

  const filtered = posts.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.content?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function timeAgo(timestamp) {
    if (!timestamp?.seconds) return "Just now";
    const diff = Date.now() - timestamp.seconds * 1000;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community 👥</Text>
        <Text style={styles.headerSubtitle}>Ask questions, share resources, help each other</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
            <TextInput style={styles.searchInput} placeholder="Search discussions..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
          </View>
          <TouchableOpacity style={styles.postBtn} onPress={() => setShowPost(true)}>
            <Ionicons name="add" size={20} color={Colors.white} />
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catChip, category === cat && styles.catChipActive]} onPress={() => setCategory(cat)}>
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="chatbubbles-outline" size={56} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No Discussions Yet</Text>
                <Text style={styles.emptySubtitle}>Be the first to start a discussion!</Text>
                <TouchableOpacity style={styles.startBtn} onPress={() => setShowPost(true)}>
                  <Text style={styles.startBtnText}>Start Discussion</Text>
                </TouchableOpacity>
              </View>
            ) : filtered.map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.authorAvatarText}>{post.authorName?.[0]?.toUpperCase() || "A"}</Text>
                  </View>
                  <View style={styles.postMeta}>
                    <Text style={styles.authorName}>{post.authorName}</Text>
                    <Text style={styles.postTime}>{timeAgo(post.createdAt)}</Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: (TAGS_COLOR[post.category] || Colors.primary) + "18" }]}>
                    <Text style={[styles.categoryText, { color: TAGS_COLOR[post.category] || Colors.primary }]}>{post.category}</Text>
                  </View>
                </View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
                <View style={styles.postFooter}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => likePost(post.id)}>
                    <Ionicons name="heart-outline" size={16} color={Colors.error} />
                    <Text style={styles.actionText}>{post.likes || 0}</Text>
                  </TouchableOpacity>
                  <View style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
                    <Text style={styles.actionText}>{post.replies || 0} replies</Text>
                  </View>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="share-outline" size={16} color={Colors.textMuted} />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <Modal visible={showPost} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Discussion</Text>
              <TouchableOpacity onPress={() => setShowPost(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Title *</Text>
              <TextInput style={styles.input} placeholder="What's your question?" value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} placeholderTextColor={Colors.textMuted} />
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CATEGORIES.slice(1).map(cat => (
                  <TouchableOpacity key={cat} style={[styles.catChip, form.category === cat && styles.catChipActive]} onPress={() => setForm(p => ({ ...p, category: cat }))}>
                    <Text style={[styles.catText, form.category === cat && styles.catTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Content *</Text>
              <TextInput style={[styles.input, { height: 120 }]} multiline placeholder="Describe your question or topic..." value={form.content} onChangeText={v => setForm(p => ({ ...p, content: v }))} placeholderTextColor={Colors.textMuted} />
              <TouchableOpacity style={styles.submitBtn} onPress={submitPost} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : (
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <Ionicons name="send-outline" size={18} color={Colors.white} />
                    <Text style={styles.submitBtnText}>Post Discussion</Text>
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
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  body: { flex: 1, padding: 16 },
  topRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  searchRow: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  postBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 14, height: 44 },
  postBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  catScroll: { marginBottom: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 8, textAlign: "center" },
  startBtn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  startBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  postCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  authorAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 10 },
  authorAvatarText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  postMeta: { flex: 1 },
  authorName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  postTime: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  postTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  postContent: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  postFooter: { flexDirection: "row", gap: 16, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  label: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  submitBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
