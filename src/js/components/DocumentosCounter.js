import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { PRINT_DOCUMENTO_REQUEST } from '../constants/action-types';
import { isVencido } from '../utils/dateUtils';
import { okDialog } from '../utils/Dialogs';

class DocumentosCounter extends Component {

    handleErrorContent = error => {
        const msg = error.response ? JSON.stringify(error.response.data, null, '\t') : `${error}`

        return (
            <View>
                <Text style={styles.error}>{`Erro:\n${msg}`}</Text>
            </View>
        );
    }

    handleOkContent = props => {
        const { fetching, documentos } = props;

        let a5count = 0;
        documentos.forEach(documento => documento.papel.includes('A5') ? a5count++ : 0);

        return (
            <View style={styles.counterContainer}>
                <Text style={styles.text}>
                    {
                        fetching ? 'Buscando documentos...' :
                            documentos.length > 0 ? `Documentos encontrados: ${documentos.length}` : 'Não foram encontrados documentos para os filtros informados'
                    }
                </Text>
                {
                    documentos.length > 0 ?
                        <TouchableOpacity style={a5count < 1 ? styles.disabledButton : styles.button} disabled={a5count < 1}
                            onPress={() => this.onPressImprimirTodos(documentos)}>
                            <Text style={styles.buttonText}>Imprimir Todos Pequenos</Text>
                        </TouchableOpacity>
                        : null
                }
            </View>
        );
    }

    onPressImprimirTodos(documentos) {
        okDialog('Aviso', 'Aguarde o fim da impressão dos Documentos');

        documentos.forEach(documento => {
            documento.papel = 'A5';

            if (!isVencido(documento.dataFinal))
                this.props.printDocumento(documento);
        });
    }

    render() {
        const { error } = this.props;

        return (
            <View style={styles.container}>
                { error ? this.handleErrorContent(error) : this.handleOkContent(this.props) }
            </View>
        );
    }

}

const styles = ScaledSheet.create({
    container: {
        height: '7%'
    },
    counterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25
    },
    text: {
        fontSize: "13@ms"
    },
    button: {
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: '#005baa',
        paddingHorizontal: 10,
        height: 40,
    },
    disabledButton: {
        alignItems: 'center',
        backgroundColor: 'grey',
        paddingHorizontal: 10,
        height: 40
    },
    buttonText: {
        fontSize: "15@ms",
        color: 'white',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        fontSize: "13@ms",
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 5,
    }
})

const mapStateToProps = state => {
    return { fetching, documentos, error } = state;
}

const mapDispatchToProps = dispatch => {
    return {
        printDocumento: selectedDocumento => dispatch({
            type: PRINT_DOCUMENTO_REQUEST,
            payload: selectedDocumento
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentosCounter);