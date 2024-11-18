import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ProfileIndex from '@/app/(profile)/index'
export default function profile() {
  return (
    <View style={styles.container}>
      <ProfileIndex />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  }
})