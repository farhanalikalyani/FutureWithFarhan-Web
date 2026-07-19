import { Image, StyleSheet } from "react-native";
import Floating from "./Floating";

export default function Logo({ size = 40, floating = false, style }) {
  const img = (
    <Image
      source={require("../../assets/images/logo.png")}
      style={[{ width: size, height: size, borderRadius: size * 0.22 }, style]}
      resizeMode="cover"
    />
  );
  if (!floating) return img;
  return (
    <Floating distance={4} duration={2200}>
      {img}
    </Floating>
  );
}

const styles = StyleSheet.create({});
