import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import {SearchLocation} from '../utils/Communication';
import * as Location from "expo-location";
import { useState } from 'react';
import BasicScreenTemplate from '../components/screen_components/BasicScreenTemplate';
import NavigationHeader from '../components/screen_components/NavigationHeader';
import MapScreen from './MapScreen';

export default function DriveScreen() {

    // screen ui
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // map states
    const [markers, setMarkers] = useState([]);
    const [destination, setDestination] = useState(null);

    const getAddressFromCoords = async (lat, lng) => {
        try {
            const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            return `${place.street || ""} ${place.name || ""} , ${place.city || ""}`;
        } catch (error) {
            console.log("Error:", error);
            return "Unknown location";
        }
      };

    const handleSearch = async () => {
        
        console.log('Search:', searchText);
        // const result = await SearchLocation(searchText).catch((error) => console.log(error));   
        // console.log(result);
        await handleAddMarkerByAddress();
        setSearchText('');
        setModalVisible(false);
    };

    
      const handleAddMarkerByAddress = async () => {
        if (!searchText.trim()) {
          console.log("Error", "Please enter an address.");
          return;
        }
    
        try {
          const location = await Location.geocodeAsync(searchText);
          if (location.length === 0) {
            console.log("Error", "Address not found.");
            return;
          }
    
          const { latitude, longitude } = location[0];
          const addr = await getAddressFromCoords(latitude, longitude);
          const newMarker = {
            id: Math.random().toString(),
            latitude,
            longitude,
            address: addr,
            name: "Custom Marker",
            description: "No description",
          };
          setMarkers((prev) => [...prev, newMarker]);
          setDestination({ latitude, longitude });
        } catch (error) {
            console.log("Error:", error, "Could not fetch location.");
        }
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
                <MapScreen 
                    address={searchText}
                    setAddress={setSearchText}
                    markers={markers}
                    setMarkers={setMarkers}
                    destination={destination}
                    setDestination={setDestination}
                />
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
