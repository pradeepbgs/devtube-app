import React, { useEffect, useState } from 'react';
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
import {
    addVideoToPlayList,
    createUserPlayLists,
    getUserPlayLists,
    globalAccessToken,
} from '@/service/apiService';
import { setPlayLists } from '@/redux/userProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import Input from './Input';

interface PlayListPopUpProps {
    userId: string;
    visible: boolean;
    videoId: string;
    onClose: () => void;
}

const PlayListPopUp: React.FC<PlayListPopUpProps> = ({
    userId,
    videoId,
    visible,
    onClose,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedPlayLists, setSelectedPlayLists] = useState<string[]>([]);
    const [newPlayListName, setNewPlayListName] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false);
    const [playListCreatingLoading, setPlayListCreatingLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const playList = useSelector((state: any) => state.userProfile?.playLists[userId]) ?? [];

    const getUserPlaylist = async () => {
        setLoading(true);
        try {
            const data = await getUserPlayLists(userId);
            dispatch(setPlayLists({ userId: userId, playlists: data }));
        } catch (error: any) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!playList || playList.length === 0) {
            getUserPlaylist();
        }
    }, []);

    const handleToggle = (item: any) => {
        setSelectedPlayLists((prev) =>
            prev.includes(item._id) ? prev.filter((id) => id !== item._id) : [...prev, item._id]
        );
    };

    const handleSave = async () => {
        try {
            if (selectedPlayLists.length > 0) {
                const requests = selectedPlayLists.map((playlistId) =>
                    addVideoToPlayList(playlistId, videoId, globalAccessToken as string)
                );
                const results = await Promise.all(requests);
                const allSuccessful = results.every((res) => res?.success === true);
                if (allSuccessful) onClose();
            }
        } catch (error) {
            console.error('Error saving video to playlists:', error);
        }
    };

    const createNewPlayList = async () => {
        if (!newPlayListName.trim()) return;
        setPlayListCreatingLoading(true);
        try {
            const res = await createUserPlayLists(newPlayListName.trim(), globalAccessToken as string);
            if (res?.success) {
                await getUserPlaylist();
                setNewPlayListName('');
                setShowInput(false);
            } else {
                console.error('Failed to create playlist');
            }
        } catch (error: any) {
            console.error('Error creating playlist:', error?.message);
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
                    ) : (
                        <>
                            <Text style={styles.modalTitle}>
                                {playList?.length === 0 ? "You don't have any playlists" : "Select a playlist"}
                            </Text>

                            {playList?.length > 0 && (
                                <ScrollView style={styles.scrollContainer}>
                                    {playList.map((item: any) => (
                                        <TouchableOpacity
                                            key={item._id}
                                            onPress={() => handleToggle(item)}
                                            style={styles.playListItem}
                                        >
                                            <View style={styles.checkbox}>
                                                {selectedPlayLists.includes(item._id) && (
                                                    <View style={styles.checkboxSelected} />
                                                )}
                                            </View>
                                            <Text style={styles.playlistText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}

                            {/* Create New Toggle Button */}
                            {!showInput && (
                                <TouchableOpacity onPress={() => setShowInput(true)} style={styles.createButton}>
                                    <Text style={styles.createButtonText}>+ Create New Playlist</Text>
                                </TouchableOpacity>
                            )}

                            {/* Create New Playlist Input */}
                            {showInput && (
                                <>
                                    <Input
                                        label="New Playlist"
                                        placeholder="Enter playlist name"
                                        value={newPlayListName}
                                        onChangeText={setNewPlayListName}
                                    />
                                    <View style={styles.actionButtons}>
                                        <Button title="Cancel" color="red" onPress={() => {
                                            setShowInput(false);
                                            setNewPlayListName('');
                                        }} />
                                        {playListCreatingLoading ? (
                                            <Text style={styles.modalTitle}>Creating...</Text>
                                        ) : (
                                            <Button title="Create" onPress={createNewPlayList} />
                                        )}
                                    </View>
                                </>
                            )}

                            {/* Save Button */}
                            {/* Save and Cancel Buttons */}
                            {playList?.length > 0 && (
                                <View style={styles.actionButtons}>
                                    <Button title="Save" onPress={handleSave} />
                                    <Button title="Cancel" color="red" onPress={onClose} />
                                </View>
                            )}

                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(PlayListPopUp);

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
    createButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
