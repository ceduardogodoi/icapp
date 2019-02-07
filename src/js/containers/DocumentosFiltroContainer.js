import React, { Component } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ScaledSheet } from 'react-native-size-matters';
import { LOGOUT_REQUEST } from '../constants/action-types';
import DocumentosFiltro from '../components/DocumentosFiltro';
import ListaDocumentosContainer from './DocumentosListaContainer';
import UserInactivity from 'react-native-user-inactivity';

class DocumentosFiltroContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <Text style={[styles.headerLeft, styles.headerText]}>Impressão de Documentos</Text>
            ),
            headerTitle: (
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>{navigation.getParam('selectedLoja', 'Nenhuma Loja selecionada')}</Text>
                </View>
            ),
            headerRight: (
                <TouchableOpacity style={styles.button} onPress={navigation.getParam('onPressLogout')}>
                    <Text style={styles.text}>LOGOUT</Text>
                </TouchableOpacity>
            )
        }
    }

    onSessionExpires = active => {
        if (!active) {
            ToastAndroid.show('Usuário deslogado por inatividade', ToastAndroid.SHORT);

            this.props.unauthorize();
            this.props.navigation.navigate('Login');
        }
    }

    onPressLogout = () => {
        this.props.unauthorize();
        this.props.navigation.navigate('Login');
    }

    componentDidMount() {
        this.props.navigation.setParams({ onPressLogout: this.onPressLogout });
    }

    render() {
        // Desabilita o Warning do Timer com valor alto.
        // Ainda não foi lançado uma correção para este warning:
        // https://github.com/facebook/react-native/issues/12981
        console.disableYellowBox = true;

        return (
            <UserInactivity timeForInactivity={1800000} onAction={this.onSessionExpires}>
                <View style={styles.container}>
                    <DocumentosFiltro navigation={this.props.navigation} />

                    <ListaDocumentosContainer />
                </View>
            </UserInactivity>
        );
    }

}

const styles = ScaledSheet.create({
    container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%'
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    headerLeft: {
        marginLeft: 10
    },
    headerTitle: {
        width: '100%',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#005baa',
        paddingHorizontal: 10
    },
    text: {
        fontSize: '12@ms',
        color: 'white',
        fontWeight: 'bold'
    }
})

const mapStateToProps = state => {
    return { isAuthorized, loja } = state;
}

const mapDispatchToProps = dispatch => {
    return {
        unauthorize: () => dispatch({
            type: LOGOUT_REQUEST
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentosFiltroContainer);