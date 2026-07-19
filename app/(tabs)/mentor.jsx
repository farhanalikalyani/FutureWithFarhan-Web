import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const functions = getFunctions();
const claudeChat = httpsCallable(functions, "claudeChat");

const SYSTEM_PROMPT = "You are a friendly AI Mentor for Pakistani students aged 16-25. Your name is FWF Mentor. Help with MDCAT, ECAT, NTS, CSS, scholarships, career guidance, and study planning. Be encouraging and practical. Keep responses concise and helpful. Use simple English with occasional Urdu words to feel relatable.";

const SUGGESTIONS = [
  "How do I prepare for MDCAT?",
  "What careers are best for FSC students?",
  "How to get a scholarship abroad?",
  "Make me a weekly study plan",
  "Tips to improve concentration",
  "Best books for CSS exam",
];

export default function AIMentorScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Assalam o Alaikum! 👋 I'm your AI Mentor. I'm here to help you with exam preparation, career guidance, scholarships, and study planning. What would you like to know today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Call secure Firebase Function — API key never exposed
      const result = await claudeChat({
        messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
        systemPrompt: SYSTEM_PROMPT,
      });

      const aiText = result.data?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: aiText },
      ]);
    } catch (error) {
      console.log("Mentor error:", error);
      let errorMessage = "Sorry, something went wrong. Please try again.";
      if (error.code === "functions/unauthenticated") {
        errorMessage = "Please log in to use AI Mentor.";
      } else if (error.code === "functions/internal") {
        errorMessage = "AI service is temporarily unavailable. Please try again later.";
      }
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <Ionicons name="sparkles" size={22} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>FWF AI Mentor</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Always here to guide you</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setMessages([{
            id: 1, role: "assistant",
            text: "Assalam o Alaikum! 👋 I'm your AI Mentor. How can I help you today?",
          }])}
        >
          <Ionicons name="refresh-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Quick suggestions shown only at start */}
        {messages.length === 1 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsTitle}>💡 Try asking:</Text>
            <View style={styles.suggestionsGrid}>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Chat bubbles */}
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.bubbleRow,
              msg.role === "user" ? styles.bubbleRowUser : styles.bubbleRowAI,
            ]}
          >
            {msg.role === "assistant" && (
              <View style={styles.aiBubbleAvatar}>
                <Ionicons name="sparkles" size={14} color={Colors.white} />
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.role === "user" ? styles.bubbleUser : styles.bubbleAI,
            ]}>
              <Text style={[
                styles.bubbleText,
                msg.role === "user" ? styles.bubbleTextUser : styles.bubbleTextAI,
              ]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Loading indicator */}
        {loading && (
          <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
            <View style={styles.aiBubbleAvatar}>
              <Ionicons name="sparkles" size={14} color={Colors.white} />
            </View>
            <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask your mentor anything..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || loading) && styles.sendBtnDisabled,
          ]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  clearBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center", justifyContent: "center",
  },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  suggestionsBox: { marginBottom: 20 },
  suggestionsTitle: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold,
    color: Colors.textSecondary, marginBottom: 10,
  },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: Colors.primary + "40",
  },
  suggestionText: {
    fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.primary,
  },
  bubbleRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },
  aiBubbleAvatar: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
    marginRight: 8, marginBottom: 2,
  },
  bubble: { maxWidth: "78%", borderRadius: 18, padding: 12 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleAI: {
    backgroundColor: Colors.white, borderBottomLeftRadius: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  bubbleText: { fontSize: Fonts.sizes.sm, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white, fontFamily: Fonts.regular },
  bubbleTextAI: { color: Colors.textPrimary, fontFamily: Fonts.regular },
  loadingBubble: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 14 },
  loadingText: {
    fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: Fonts.sizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
});
