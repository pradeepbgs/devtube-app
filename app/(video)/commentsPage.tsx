import { FlatList, Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addComment, getVideoComments } from '@/service/apiService';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';
import * as SecureStore from 'expo-secure-store';
import { LoadingSpinner } from '@/components/loadSpinner';


export default function CommentsPage({ onClose, videoId }: { onClose: () => void, videoId: string }) {
    const [commentInput, setCommentInput] = useState('');
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const dispatch = useDispatch()
    const fetchVideoComments = async () => {
        try {
            const res = await getVideoComments(videoId)
            if (res === 'No comments found')
                setComments([])
            else setComments(res)
        } catch (error: any) {
            ToastAndroid.show(`Error fetching comments: ${error?.message}`, ToastAndroid.SHORT);
        }
    }

    const HandleComment = async () => {
        try {
            const res = await addComment(videoId, commentInput)
            setRefresh(!refresh)
            setCommentInput('')
        } catch (error: any) {
            console.log(error?.message)
            // if (error.status === 401) {
            //     dispatch(login({ isLoggedIn: false, user: null }));
            //     await SecureStore.deleteItemAsync("accessToken");
            //     await SecureStore.deleteItemAsync("refreshToken");
            // }
            ToastAndroid.show(`error while adding comment ${error?.message}`, ToastAndroid.SHORT)
        }
    }

    useEffect(() => {
        console.log('first')
        if (videoId)
            fetchVideoComments()
    }, [videoId, refresh])


    return (
        <View style={styles.container}>
            <View style={styles.secondContainer}>
                <View style={styles.header}>
                    <Text style={styles.text}>Comments</Text>
                    <TouchableOpacity onPress={onClose}>
                        <FontAwesome name="remove" size={20} color="white" />
                    </TouchableOpacity>
                </View>


                {
                    loading
                        ? LoadingSpinner()
                        :
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => `key_id${item?._id}`}
                            contentContainerStyle={styles.commentList}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <View style={styles.commentRow}>
                                    <Image source={{ uri: item?.owner?.avatar }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }} />
                                    <View>
                                        <Text style={styles.username}>{item.owner.username}</Text>
                                        <Text style={styles.comment}>{item.content}</Text>
                                    </View>
                                </View>
                            )}
                        />

                }

                <KeyboardAvoidingView style={styles.userInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        placeholderTextColor="#aaa"
                        value={commentInput}
                        onChangeText={setCommentInput}
                    />
                    <TouchableOpacity onPress={HandleComment}>
                        <FontAwesome name="send" size={18} color="white" />
                    </TouchableOpacity>
                </KeyboardAvoidingView>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#252422',
        borderRadius: 10,
        height: '100%',
    },
    secondContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    commentList: {
        paddingBottom: 10,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 35,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    username: {
        color: 'white',
        fontWeight: '600',
    },
    comment: {
        color: '#ccc',
        fontSize: 13,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        marginBottom: 20
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        fontStyle: 'italic',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginBottom: 15,
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    userInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15,
        position: 'absolute',
        top: '61%'
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    text: {
        color: 'white',
        fontSize: 15,
        marginBottom: 5,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
})