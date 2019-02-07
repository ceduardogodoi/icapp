import { Alert } from 'react-native';

export function okDialog(title, msg) {
    Alert.alert(title, msg, [
        { text: 'Ok' }
    ]);
}