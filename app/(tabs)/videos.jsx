import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CATEGORIES = ["All", "MDCAT", "ECAT", "NTS", "CSS", "General"];

export default function VideosScreen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => { loadVideos(); }, [category]);

  async function loadVideos() {
    setLoading(true);
    try {
      let q;
      if (category === "All") {
        q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
      } else {
        q = query(collection(db, "videos"), where("category", "==", category));
      }
      const snapshot = await getDocs(q);
      setVideos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Videos error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Lectures 🎬</Text>
        <Text style={styles.headerSubtitle}>Learn from expert video lessons</Text>
      </View>

      <View style={styles.body}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, category === cat && styles.catChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : videos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="play-circle-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Videos Yet</Text>
            <Text style={styles.emptySubtitle}>Admin will add video lectures soon</Text>
          </View>
        ) : (
          videos.map(video => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => video.url && Linking.openURL(video.url)}
              activeOpacity={0.8}
            >
              <View style={styles.thumbnail}>
                <Ionicons name="play-circle" size={36} color={Colors.white} />
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoMeta}>{video.subject} • {video.category}</Text>
                {video.instructor ? <Text style={styles.videoInstructor}>👨‍🏫 {video.instructor}</Text> : null}
                {video.duration ? <Text style={styles.videoDuration}>⏱ {video.duration}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  body: { padding: 16 },
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginTop: 16 },
  emptySubtitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 8, textAlign: "center" },
  videoCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, overflow: "hidden", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  thumbnail: { width: 90, height: 80, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  videoInfo: { flex: 1, padding: 12 },
  videoTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  videoMeta: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 3 },
  videoInstructor: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted, marginTop: 2 },
  videoDuration: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted, marginTop: 2 },
});
