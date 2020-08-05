import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const handleAxiosErrors = async (props, err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        Alert.alert('Please sign in again');
        await AsyncStorage.clear();
        props.navigation.navigate('StartScreen');
    } else if (err.response && err.response.status === 400) {
        Alert.alert('Error found');
    } else {
        Alert.alert('Connection not available');
    }
};

export default handleAxiosErrors;