import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function CommentsPage({onClose}:{onClose:() => void}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.text}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
          <FontAwesome name="remove" size={20} color="white" />
        </TouchableOpacity>
      </View>
          {/* Render comments here */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop:5,
    backgroundColor: '#252422',
    borderRadius: 10,
    height:'100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 15,
    paddingTop:15,
    paddingLeft:20,
    paddingRight:20,
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
})