import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function upload() {
  return (
    <View style={styles.container}>
      <Text>upload video </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'black'
  }
})