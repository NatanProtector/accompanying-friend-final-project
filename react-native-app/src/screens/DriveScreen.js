import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import {SearchLocation} from '../utils/Communication';
import { useState } from 'react';
import BasicScreenTemplate from '../components/screen_components/BasicScreenTemplate';
import NavigationHeader from '../components/screen_components/NavigationHeader';
import MapScreen from './MapScreen';

export default function DriveScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearch = async () => {
        console.log('Search:', searchText);
        const result = await SearchLocation(searchText).catch((error) => console.log(error));   
        console.log(result);
        setSearchText('');
        setModalVisible(false);
    };

    return (
        <BasicScreenTemplate 
            HeaderComponent={<NavigationHeader />}
            FooterComponent={
                <TouchableOpacity 
                    style={styles.searchButton} 
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            }
        >
            <View style={styles.container}>
                <MapScreen />
            </View>

            {/* Search Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="Type your search..."
                            value={searchText}
                            onChangeText={setSearchText}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSearch}>
                                <Text style={styles.modalButtonText}>Search</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </BasicScreenTemplate>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        overflow: 'hidden',
    },
    searchButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        backgroundColor: '#4958FF',
        padding: 10,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    searchIcon: {
        fontSize: 24,
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#4958FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'gray',
        marginLeft: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
