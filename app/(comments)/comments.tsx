import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CommentsPage() {
  return (
    <View style={styles.commentContainer}>
          <Text style={styles.text}>Comments</Text>
          {/* Render comments here */}
    </View>
  )
}

const styles = StyleSheet.create({
    commentContainer: {
    marginTop:5,
    backgroundColor: '#252422',
    padding: 10,
    borderRadius: 10,
    height:'100%'
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
})