import React, { Component } from 'react';
import { View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

import DocumentosCounter from '../components/DocumentosCounter';
import DocumentosLista from '../components/DocumentosLista';

class DocumentosListaContainer extends Component {

    render() {
        return (
            <View style={styles.container}>
                <DocumentosCounter />

                <DocumentosLista />
            </View>
        );
    }

}

const styles = ScaledSheet.create({
    container: {
        margin: "10@ms",
        height: '95%',
        width: '64%'
    }
})

export default DocumentosListaContainer;