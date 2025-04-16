import { ActivityIndicator, StyleSheet, View } from "react-native";

export const LoadingSpinner = (Size = "small", color = "#00ff00") => (
    <View style={styles.loadingContainer}>
      
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