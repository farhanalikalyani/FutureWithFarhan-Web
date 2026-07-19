import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { RefreshableScrollView } from "../../components/ui/PullToRefresh";
import { EmptyState } from "../../components/ui/EmptyState";
import { timeAgo } from "../../utils/formatting";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const PRIORITY_CONFIG = {
  Urgent: { color: Colors.error, icon: "alert-circle", bg: Colors.error + "15" },
  Important: { color: Colors.warning, icon: "warning", bg: Colors.warning + "15" },
  Normal: { color: Colors.info, icon: "information-circle", bg: Colors.info + "15" },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => { loadNotifications(); }, []);

  async function loadNotifications() {
    try {
      const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50));
      const snap = await getDocs(q);
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.log("Notifications error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function markRead(id) {
    setReadIds(prev => new Set([...prev, id]));
  }

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications 🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} new</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <RefreshableScrollView
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); loadNotifications(); }}
          contentContainerStyle={{ padding: 16 }}
        >
          {notifications.length === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title="No Notifications"
              subtitle="You're all caught up! Check back later for updates."
            />
          ) : (
            notifications.map(notif => {
              const config = PRIORITY_CONFIG[notif.priority] || PRIORITY_CONFIG.Normal;
              const isRead = readIds.has(notif.id);
              return (
                <TouchableOpacity
                  key={notif.id}
                  style={[styles.notifCard, isRead && styles.notifCardRead]}
                  onPress={() => markRead(notif.id)}
                  activeOpacity={0.8}
                >
                  {!isRead && <View style={styles.unreadDot} />}
                  <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                    <Ionicons name={config.icon} size={22} color={config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text style={[styles.notifTitle, isRead && styles.notifTitleRead]}>
                        {notif.title}
                      </Text>
                      <View style={[styles.priorityBadge, { backgroundColor: config.bg }]}>
                        <Text style={[styles.priorityText, { color: config.color }]}>
                          {notif.priority}
                        </Text>
                      </View>
                    </View>
                    {notif.description && (
                      <Text style={styles.notifDesc} numberOfLines={2}>
                        {notif.description}
                      </Text>
                    )}
                    <Text style={styles.notifTime}>{timeAgo(notif.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </RefreshableScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, paddingTop: 56,
    paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  unreadBadge: {
    backgroundColor: Colors.gold, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  unreadText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  notifCard: {
    flexDirection: "row", backgroundColor: Colors.white,
    borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    borderWidth: 1.5, borderColor: Colors.primary + "30",
    position: "relative",
  },
  notifCardRead: { borderColor: Colors.border, shadowOpacity: 0.03 },
  unreadDot: {
    position: "absolute", top: 12, right: 12,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  notifTitle: {
    flex: 1, fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.bold, color: Colors.textPrimary,
  },
  notifTitleRead: { fontFamily: Fonts.medium, color: Colors.textSecondary },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  priorityText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  notifDesc: {
    fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular,
    color: Colors.textSecondary, lineHeight: 18, marginBottom: 6,
  },
  notifTime: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textMuted },
});
