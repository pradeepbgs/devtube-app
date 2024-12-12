import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const DescriptionPage = ({
    video,
    createdOn,
    isExpanded,
    setIsExpanded
}: {
    video: any,
    createdOn: string,
    isExpanded: boolean,
    setIsExpanded: (value: boolean) => void
}) => {

    const [animation] = useState(new Animated.Value(0));

    const toggleExpand = () => {
        Animated.timing(animation, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsExpanded(!isExpanded);
    };

    return (
        <View
            style={styles.container}>

            <TouchableOpacity
                style={styles.viewLessConatiner}
                activeOpacity={1}
            >
                <Text
                    style={styles.viewLessText}
                >
                    {video?.views || 0} views
                </Text>
                <Text style={styles.viewLessText}>
                    {createdOn}
                </Text>
                <MaterialIcons
                    onPress={toggleExpand}
                    name="clear"
                    size={20}
                    color="white"
                />
            </TouchableOpacity>

            <ScrollView
                style={styles.descriptionConatiner}
            >
                <Text
                    style={styles.descriptionText}
                    numberOfLines={isExpanded ? undefined : 1}
                    selectable={true}
                >
                    {video?.description || "No Description"}
                </Text>
            </ScrollView>

        </View>
    )
}

export default DescriptionPage

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: "rgba(50, 50, 50, 0.6)",
        borderRadius: 10,
        // marginTop: 5,
        // paddingHorizontal: 10,
    },
    descriptionConatiner: {
        height: '100%',
        backgroundColor: "rgba(50, 50, 50, 0.6)",
        paddingHorizontal: 10,
    },
    descriptionText: {
        color: "white",
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 22,
        fontFamily: "Arial",
        marginTop: 5,
        borderRadius: 10,
        padding: 5,
    },
    viewLessConatiner: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#212529",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    viewLess: {
        position: "absolute",
        bottom: 0,
        right: 0,
        // top:-50
    },
    viewLessText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
})