import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

/**
 * Wraps children in a subtle, continuous up/down floating animation.
 * Use for logos, icons, badges, or hero illustrations to add life to the UI.
 *
 * Props:
 *  - distance: how many px it floats up/down (default 8)
 *  - duration: ms for one direction of the float (default 1800)
 *  - delay: ms before the animation starts (default 0) — stagger multiple items
 *  - style: extra style applied to the animated wrapper
 */
export default function Floating({ children, distance = 8, duration = 1800, delay = 0, style }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -distance,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [distance, duration, delay]);

  return (
    <Animated.View style={[{ transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
