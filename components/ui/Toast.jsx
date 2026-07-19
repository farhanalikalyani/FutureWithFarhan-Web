import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

export function Toast({ message, type = "success", visible, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -20, duration: 300, useNativeDriver: true }),
        ]).start(onHide);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const COLOR = type === "success" ? Colors.success : type === "error" ? Colors.error : Colors.info;
  const ICON = type === "success" ? "checkmark-circle" : type === "error" ? "close-circle" : "information-circle";

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { backgroundColor: COLOR, opacity, transform: [{ translateY }] }]}>
      <Ionicons name={ICON} size={20} color={Colors.white} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute", top: 60, left: 16, right: 16,
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 14, padding: 14, zIndex: 9999,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastText: { color: Colors.white, fontSize: 14, fontFamily: Fonts.semiBold, flex: 1 },
});
