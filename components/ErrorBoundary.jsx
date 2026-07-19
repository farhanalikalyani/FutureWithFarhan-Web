import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { Fonts } from "../constants/fonts";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.log("App Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.desc}>
            Don't worry! This is not your fault.{"\n"}Please restart the app.
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.background, padding: 32,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: {
    fontSize: 22, fontFamily: Fonts.bold,
    color: Colors.textPrimary, marginBottom: 10,
  },
  desc: {
    fontSize: 14, fontFamily: Fonts.regular,
    color: Colors.textSecondary, textAlign: "center",
    lineHeight: 22, marginBottom: 24,
  },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  btnText: { color: Colors.white, fontSize: 16, fontFamily: Fonts.bold },
});
