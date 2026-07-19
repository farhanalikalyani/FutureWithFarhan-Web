import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: 1,
    emoji: "🎓",
    title: "Welcome to FWF",
    subtitle: "Future With Farhan",
    desc: "Pakistan's #1 student success platform. Built to help you ace exams, find scholarships, and build your dream career.",
    color: Colors.primary,
  },
  {
    id: 2,
    emoji: "📚",
    title: "Study Smarter",
    subtitle: "Complete Exam Preparation",
    desc: "Access thousands of MCQs, past papers, video lectures, and notes for MDCAT, ECAT, NTS, CSS, and more.",
    color: "#8B5CF6",
  },
  {
    id: 3,
    emoji: "🎯",
    title: "Know Your Merit",
    subtitle: "University-Specific Calculator",
    desc: "Calculate your exact aggregate for NUST, FAST, UET, LUMS, and all other top Pakistani universities.",
    color: "#10B981",
  },
  {
    id: 4,
    emoji: "🤖",
    title: "AI Mentor",
    subtitle: "Your Personal Guide",
    desc: "Get personalized guidance, study plans, CV reviews, and answers to all your academic and career questions.",
    color: "#EF4444",
  },
  {
    id: 5,
    emoji: "🚀",
    title: "Ready to Begin?",
    subtitle: "Your future starts now",
    desc: "Join thousands of Pakistani students already using FWF to unlock their potential and achieve their dreams.",
    color: Colors.gold,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  async function finish() {
    await AsyncStorage.setItem("onboardingDone", "true");
    router.replace("/(auth)/login");
  }

  function next() {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      finish();
    }
  }

  function skip() { finish(); }

  const slide = SLIDES[current];

  return (
    <View style={[styles.container, { backgroundColor: slide.color }]}>
      {/* Skip button */}
      {current < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => setCurrent(i)}>
            <View style={[styles.dot, i === current && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Next / Get Started button */}
      <TouchableOpacity style={styles.nextBtn} onPress={next}>
        <Text style={styles.nextBtnText}>
          {current === SLIDES.length - 1 ? "Get Started 🚀" : "Next"}
        </Text>
        {current < SLIDES.length - 1 && (
          <Ionicons name="arrow-forward" size={20} color={slide.color} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  skipBtn: { alignSelf: "flex-end", paddingHorizontal: 16, paddingVertical: 8 },
  skipText: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontFamily: Fonts.medium },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 80, marginBottom: 24 },
  subtitle: {
    color: "rgba(255,255,255,0.8)", fontSize: 14,
    fontFamily: Fonts.medium, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1,
  },
  title: {
    color: Colors.white, fontSize: 32,
    fontFamily: Fonts.bold, textAlign: "center", marginBottom: 20,
  },
  desc: {
    color: "rgba(255,255,255,0.9)", fontSize: 16,
    fontFamily: Fonts.regular, textAlign: "center", lineHeight: 26,
  },
  dotsRow: { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 24 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: { backgroundColor: Colors.white, width: 24 },
  nextBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: Colors.white,
    borderRadius: 16, paddingVertical: 16,
  },
  nextBtnText: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.primary },
});
