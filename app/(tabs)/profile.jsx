import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../firebase/auth";
import { isUserAdmin } from "../../firebase/admin-check";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Edit Profile Form
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editEducation, setEditEducation] = useState("");
  const [editDream, setEditDream] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      checkAdmin();
    }
  }, [user]);

  async function loadProfile() {
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile(data);
        setEditName(data.name || user.displayName || "");
        setEditCity(data.city || "");
        setEditEducation(data.educationLevel || "");
        setEditDream(data.dreamCareer || "");
      }
    } catch (e) {
      console.log("Profile error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function checkAdmin() {
    const adminStatus = await isUserAdmin(user.uid);
    setIsAdmin(adminStatus);
  }

  async function handleSaveProfile() {
    if (!editName.trim()) { Alert.alert("Error", "Name is required"); return; }
    setSavingProfile(true);
    try {
      await updateProfile(auth.currentUser, { displayName: editName.trim() });
      await updateDoc(doc(db, "users", user.uid), {
        name: editName.trim(),
        city: editCity.trim(),
        educationLevel: editEducation.trim(),
        dreamCareer: editDream.trim(),
        updatedAt: new Date().toISOString(),
      });
      setShowEditProfile(false);
      loadProfile();
      Alert.alert("Success", "Profile updated successfully!");
    } catch (e) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      Alert.alert("Success", "Password changed successfully!");
    } catch (e) {
      if (e.code === "auth/wrong-password") {
        Alert.alert("Error", "Current password is incorrect");
      } else {
        Alert.alert("Error", "Failed to change password");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  const STATS = [
    { label: "XP Points", value: userProfile?.xp || 0 },
    { label: "Streak", value: `${userProfile?.streak || 0} 🔥` },
    { label: "Tests", value: userProfile?.testsCompleted || 0 },
  ];

  const MENU_SECTIONS = [
    {
      title: "Account",
      items: [
        { icon: "person-outline", label: "Edit Profile", color: "#3B82F6", action: () => setShowEditProfile(true) },
        { icon: "lock-closed-outline", label: "Change Password", color: "#8B5CF6", action: () => setShowChangePassword(true) },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "notifications-outline", label: "Notifications", color: "#F5A623",
          toggle: true, value: notifications, onToggle: setNotifications,
        },
        {
          icon: "moon-outline", label: "Dark Mode", color: "#6366F1",
          toggle: true, value: darkMode, onToggle: setDarkMode,
        },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle-outline", label: "Help & Support", color: "#EC4899", action: () => Alert.alert("Help & Support", "Email us at: support@futurewithfarhan.com\n\nWhatsApp: +92-XXX-XXXXXXX") },
        { icon: "information-circle-outline", label: "About FWF", color: "#14B8A6", action: () => setShowAbout(true) },
        { icon: "shield-outline", label: "Privacy Policy", color: "#10B981", action: () => Alert.alert("Privacy Policy", "Your data is secure and never shared with third parties.") },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.displayName ? user.displayName[0].toUpperCase() : "S"}
          </Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.white} />
            </View>
          )}
        </View>
        <Text style={styles.name}>{user?.displayName || "Student"}</Text>
        {isAdmin && <Text style={styles.adminLabel}>⚡ Admin</Text>}
        <Text style={styles.email}>{user?.email}</Text>
        {userProfile?.city ? <Text style={styles.city}>📍 {userProfile.city}</Text> : null}
        {userProfile?.dreamCareer ? <Text style={styles.dream}>🎯 Dream: {userProfile.dreamCareer}</Text> : null}

        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        {/* Admin Panel Button - Only for admins */}
        {isAdmin && (
          <TouchableOpacity style={styles.adminPanelBtn} onPress={() => router.push("/admin")}>
            <View style={styles.adminPanelIcon}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.white} />
            </View>
            <View style={styles.adminPanelInfo}>
              <Text style={styles.adminPanelTitle}>Admin Panel</Text>
              <Text style={styles.adminPanelSubtitle}>Manage content, users & settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={item.action}
                  activeOpacity={item.toggle ? 1 : 0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.white}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel" },
            { text: "Logout", style: "destructive", onPress: async () => { await logoutUser(); router.replace("/(auth)/login"); } },
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Future With Farhan v1.0.0</Text>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {[
                { label: "Full Name *", value: editName, set: setEditName, placeholder: "Your full name" },
                { label: "City", value: editCity, set: setEditCity, placeholder: "e.g. Lahore, Islamabad" },
                { label: "Education Level", value: editEducation, set: setEditEducation, placeholder: "e.g. FSC Pre-Medical" },
                { label: "Dream Career", value: editDream, set: setEditDream, placeholder: "e.g. Doctor, Software Engineer" },
              ].map((field, i) => (
                <View key={i}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={field.value}
                    onChangeText={field.set}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Save Profile</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {[
                { label: "Current Password", value: currentPassword, set: setCurrentPassword },
                { label: "New Password", value: newPassword, set: setNewPassword },
                { label: "Confirm New Password", value: confirmNewPassword, set: setConfirmNewPassword },
              ].map((field, i) => (
                <View key={i}>
                  <Text style={styles.inputLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={field.value}
                    onChangeText={field.set}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry
                  />
                </View>
              ))}
              <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword} disabled={savingPassword}>
                {savingPassword ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveBtnText}>Change Password</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={showAbout} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About FWF</Text>
              <TouchableOpacity onPress={() => setShowAbout(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.aboutContent}>
              <View style={styles.aboutLogo}>
                <Text style={styles.aboutLogoText}>FWF</Text>
              </View>
              <Text style={styles.aboutTitle}>Future With Farhan</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              <Text style={styles.aboutDesc}>
                Pakistan's leading student success platform helping students discover opportunities, prepare for competitive exams, gain scholarships, choose careers, and build a better future.
              </Text>
              <View style={styles.aboutStats}>
                {[
                  { label: "Students Helped", value: "10,000+" },
                  { label: "Scholarships Listed", value: "500+" },
                  { label: "Universities", value: "50+" },
                  { label: "MCQs Available", value: "10,000+" },
                ].map((stat, i) => (
                  <View key={i} style={styles.aboutStat}>
                    <Text style={styles.aboutStatValue}>{stat.value}</Text>
                    <Text style={styles.aboutStatLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.aboutTagline}>"Someone is guiding me toward my future."</Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 32, alignItems: "center", paddingHorizontal: 20 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 12, position: "relative" },
  avatarText: { color: Colors.white, fontSize: 36, fontFamily: Fonts.bold },
  adminBadge: { position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.gold, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: Colors.primary },
  name: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  adminLabel: { color: Colors.gold, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, marginTop: 2 },
  email: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  city: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 2 },
  dream: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 24, marginTop: 20, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24 },
  stat: { alignItems: "center" },
  statValue: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  statLabel: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 2 },
  body: { padding: 16 },
  adminPanelBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.primaryDark, borderRadius: 16, padding: 16, marginBottom: 20, gap: 14 },
  adminPanelIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  adminPanelInfo: { flex: 1 },
  adminPanelTitle: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  adminPanelSubtitle: { color: "rgba(255,255,255,0.7)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textSecondary, marginBottom: 8, paddingLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionCard: { backgroundColor: Colors.white, borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 14 },
  menuLabel: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.error + "40", backgroundColor: Colors.error + "08" },
  logoutText: { color: Colors.error, fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold },
  version: { textAlign: "center", color: Colors.textMuted, fontSize: Fonts.sizes.xs, marginTop: 16, marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  inputLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 20 },
  saveBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  aboutContent: { alignItems: "center", paddingBottom: 20 },
  aboutLogo: { width: 80, height: 80, borderRadius: 20, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  aboutLogoText: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  aboutTitle: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.textPrimary },
  aboutVersion: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, marginTop: 4 },
  aboutDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, textAlign: "center", lineHeight: 22, marginTop: 12, marginBottom: 20 },
  aboutStats: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 16 },
  aboutStat: { backgroundColor: Colors.background, borderRadius: 12, padding: 12, alignItems: "center", width: "45%" },
  aboutStatValue: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.primary },
  aboutStatLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2, textAlign: "center" },
  aboutTagline: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.primary, fontStyle: "italic", textAlign: "center" },
});
