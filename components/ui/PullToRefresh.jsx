import { ScrollView, RefreshControl } from "react-native";
import { Colors } from "../../constants/colors";

export function RefreshableScrollView({ onRefresh, refreshing, children, style, contentContainerStyle }) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || false}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      {children}
    </ScrollView>
  );
}
