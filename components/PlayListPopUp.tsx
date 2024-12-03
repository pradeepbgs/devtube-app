import {
    Modal,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { addVideoToPlayList, getUserPlayLists } from '@/service/apiService';
import { setPlayLists } from '@/redux/userProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStorage from 'expo-secure-store';

interface PlayListPopUpProps {
    userId: number;
    visible: boolean;
    videoId: number,
    onClose: () => void;
}

export const PlayListPopUp: React.FC<PlayListPopUpProps> = ({
    userId,
    videoId,
    visible,
    onClose,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPlayLists, setSelectedPlayLists] = useState<string[]>()

    const playList = useSelector((state: any) => state.userProfile.playLists);
    const dispatch = useDispatch();

    const getUserPlaylist = async () => {
        setLoading(true);
        try {
            const data = await getUserPlayLists(userId);
            dispatch(setPlayLists(data));
        } catch (error: any) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playList) return;
        if (userId) getUserPlaylist();
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
        const accessToken = await SecureStorage.getItem('accessToken') as string
        selectedPlayLists?.map(async (playlist: any) => {
            const res = await addVideoToPlayList(playlist?.id, videoId, accessToken)
            if (res?.success === true) {
                onClose()
            }
        })
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : playList.length === 0 ? (
                        <Text>No playlists found.</Text>
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>
                                Select a playlist
                            </Text>
                            <ScrollView style={styles.scrollContainer}>
                                {playList.map((item: any) => (
                                    <TouchableOpacity
                                        key={item.name}
                                        onPress={() => handleToggle(item)}
                                        style={styles.playListItem}
                                    >
                                        <View style={styles.checkbox}>
                                            {selectedPlayLists?.includes(item) && (
                                                <View
                                                    style={
                                                        styles.checkboxSelected
                                                    }
                                                />
                                            )}
                                        </View>
                                        <Text style={styles.playlistText}>
                                            {item.name}
                                        </Text>
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
        color: 'white'
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
        color: 'white'
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
