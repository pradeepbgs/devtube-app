import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Modal } from 'react-native-paper';

interface VideoSettingPopUpProps {
    videoId: number;
    visible: boolean;
    onClose: () => void;
    onRemove: (id: number) => void;
}

const PlayListVideoSettingPopUp: React.FC<VideoSettingPopUpProps> = ({
    videoId,
    visible,
    onClose,
    onRemove
}) => {
    return (
        <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
            <View style={styles.popupContainer}>
                <Text style={styles.title}>Video Options</Text>
                <TouchableOpacity style={styles.optionButton} onPress={() => onRemove(videoId)}>
                    <Text style={styles.optionText}>Remove Video from Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={onClose}>
                    <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#242423',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
        position: 'absolute',
        bottom: 15,
        width: '100%',
        borderWidth:1,
        borderTopColor:'#6c757d',

    },
    popupContainer: {
        backgroundColor: '#242423',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: 'white',
    },
    optionButton: {
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
    },
});

export default PlayListVideoSettingPopUp;
