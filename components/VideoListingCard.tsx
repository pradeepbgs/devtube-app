import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function VideoListingCard(video:any) {
  return (
    <View style={styles.container}>
      <Text style={styles.videocard}>VideoListingCard</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videocard:{
    marginTop:5
  }
})