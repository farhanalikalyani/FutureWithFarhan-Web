import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Colors } from "../../constants/colors";

export function SkeletonCard({ height = 80, borderRadius = 14, style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonList({ count = 5, height = 80 }) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: Colors.border, width: "100%" },
});
