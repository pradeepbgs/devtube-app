import { ActivityIndicator, StyleSheet, View } from "react-native";

export const LoadingSpinner = (size = "small", color = "#00ff00") => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
  
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
  });