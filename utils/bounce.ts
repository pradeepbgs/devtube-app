import { Animated, Easing } from "react-native";

export const handleBounce = (bounceAnim:any) => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };
