import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Button } from 'react-native';
import { addVideoToPlayList, createUserPlayLists, getUserPlayLists } from '@/service/apiService';
import { setPlayLists } from '@/redux/userProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStorage from 'expo-secure-store';
import Input from './Input';

interface PlayListPopUpProps {
    userId: number;
    visible: boolean;
    videoId: number;
    onClose: () => void;
}

export const PlayListPopUp: React.FC<PlayListPopUpProps> = ({
    userId,
    videoId,
    visible,
    onClose,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPlayLists, setSelectedPlayLists] = useState<string[]>([]);
    const [newPlayListName, setNewPlayListName] = useState<string>('');
    const [playListCreatingLoading, setPlayListCreatingLoading] = useState<boolean>(false);

    const localUser = useSelector((state: any) => state.userProfile.user);
    const playList = useSelector((state: any) => state.userProfile?.playLists[userId]) ?? [];
    const dispatch = useDispatch();

    const getUserPlaylist = async () => {
        setLoading(true);
        try {
            const data = await getUserPlayLists(userId);
            dispatch(setPlayLists({ userId: userId, playlists: data }));
        } catch (error: any) {
            // console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!playList || playList.length === 0) {
            getUserPlaylist(); 
        }
    }, [userId]);

    const handleToggle = (name: string) => {
        setSelectedPlayLists((prev) => {
            if (prev?.includes(name)) {
                return prev.filter((item) => item !== name);
            } else {
                return [...(prev || []), name];
            }
        });
    };

    const handleSave = async () => {
        try {
            const accessToken = await SecureStorage.getItem('accessToken') as string;
            if (selectedPlayLists) {
                const requests = selectedPlayLists.map((playlist: any) =>
                    addVideoToPlayList(playlist?.id, videoId, accessToken)
                );
                const results = await Promise.all(requests);
                const allSuccessful = results.every(res => res?.success === true);
                if (allSuccessful) onClose();
            }
        } catch (error) {
            console.error('Error saving video to playlists:', error);
        }
    };

    const createNewPlayList = async () => {
        setPlayListCreatingLoading(true);
        const accessToken = await SecureStorage.getItem('accessToken') as string;
        try {
            const res = await createUserPlayLists(newPlayListName, accessToken);
            if (res?.success) {
                await getUserPlaylist();  // Fetch updated playlists after creation
                setNewPlayListName('');  // Reset input field
            } else {
                console.error('Failed to create playlist');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        } finally {
            setPlayListCreatingLoading(false);
        }
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : playList?.length === 0 ? (
                        <View>
                            <Text style={styles.modalTitle}>You don't have any playlists</Text>
                            <Input
                                label="Create a new PlayList"
                                placeholder="Enter playlist name"
                                value={newPlayListName}
                                onChangeText={setNewPlayListName}
                            />
                            <View style={styles.actionButtons}>
                                <Button title="Cancel" onPress={onClose} color="red" />
                                {playListCreatingLoading ? (
                                    <Text style={styles.modalTitle}>Creating...</Text>
                                ) : (
                                    <Button title="Create" onPress={createNewPlayList} />
                                )}
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>Select a playlist</Text>
                            <ScrollView style={styles.scrollContainer}>
                                {playList?.map((item: any) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => handleToggle(item)}
                                        style={styles.playListItem}
                                    >
                                        <View style={styles.checkbox}>
                                            {selectedPlayLists?.includes(item) && (
                                                <View style={styles.checkboxSelected} />
                                            )}
                                        </View>
                                        <Text style={styles.playlistText}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <View style={styles.actionButtons}>
                                <Button title="Cancel" onPress={onClose} color="red" />
                                <Button title="Save" onPress={handleSave} />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#212529',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    scrollContainer: {
        marginBottom: 20,
    },
    playListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'gray',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        width: 12,
        height: 12,
        backgroundColor: 'green',
        borderRadius: 2,
    },
    playlistText: {
        fontSize: 16,
        color: 'white',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
