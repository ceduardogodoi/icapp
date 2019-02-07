import React, { Component } from 'react';
import { View, Text, ScrollView, ToastAndroid } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { ScaledSheet } from 'react-native-size-matters';
import { connect } from 'react-redux';
import Button from '../components/Button';
import { dateSlashfy } from '../utils/stringUtils';
import { isVencido } from '../utils/dateUtils';
import { okDialog } from '../utils/Dialogs';
import { PRINT_DOCUMENTO_REQUEST } from '../constants/action-types';

class DocumentosLista extends Component {

    onPressImprimirCartazPequeno(documento) {
        documento.papel = 'A5';

        this.sendToPrinter(documento);
    }

    onPressImprimirCartazGrande(documento) {
        documento.papel = 'A3';

        this.sendToPrinter(documento);
    }

    sendToPrinter(documento) {
        if (!isVencido(documento.dataFinal)) {
            okDialog('Aviso', 'Pressione OK e aguarde o fim da impressão dos Documentos');

            this.props.printDocumento({
                documento,
                authData: this.props.authData
            });
        } else
            ToastAndroid.show('Documento vencido não pode ser impresso', ToastAndroid.LONG);
    }

    render() {
        const { documentos, error } = this.props;

        if (documentos && documentos.length > 0) {
            return (
                <ScrollView>
                    {
                        documentos.map((documento, idx) => {
                            const { tipoTabloide, codigoTabloide, /* loja, */ papel, dataInicial, dataFinal, ean, host, descricao } = documento;

                            const disableA5 = !papel.includes('A5');
                            const disableA3 = !papel.includes('A3');

                            const dtInicial = dateSlashfy(dataInicial);
                            const dtFinal = dateSlashfy(dataFinal);

                            return (
                                <Card title={descricao} key={idx} titleStyle={styles.titleStyle}>
                                    {/* <View style={styles.cardRow}>
                                        <View style={styles.keyGrey}>
                                            <Text style={styles.keyLabel}>Loja:</Text>
                                        </View>
                                        <View style={styles.valueGrey}>
                                            <Text style={styles.valueLabel}>{loja}</Text>
                                        </View>
                                    </View> */}

                                    <View style={styles.cardRow}>
                                        <View style={styles.key}>
                                            <Text style={styles.keyLabel}>Tabloide:</Text>
                                        </View>
                                        <View style={styles.value}>
                                            <Text style={styles.valueLabel}>{tipoTabloide} {codigoTabloide}</Text>
                                        </View>
                                        {/* <View style={styles.key3}>
                                            <Text style={styles.keyLabel}>Papel:</Text>
                                        </View>
                                        <View style={styles.value}>
                                            <Text style={styles.valueLabel}>{papel}</Text>
                                        </View> */}
                                    </View>

                                    <View style={styles.cardRow}>
                                        <View style={styles.keyGrey}>
                                            <Text style={styles.keyLabel}>Início:</Text>
                                        </View>
                                        <View style={styles.valueGrey}>
                                            <Text style={styles.valueLabel}>{dtInicial}</Text>
                                        </View>

                                        <View style={styles.keyGrey2}>
                                            <Text style={styles.keyLabel}>Vencimento:</Text>
                                        </View>
                                        <View style={styles.valueGrey}>
                                            <Text style={styles.valueLabel}>{dtFinal}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardRow}>
                                        <View style={styles.key}>
                                            <Text style={styles.keyLabel}>Host:</Text>
                                        </View>
                                        <View style={styles.value}>
                                            <Text style={styles.valueLabel}>{host}</Text>
                                        </View>

                                        <View style={styles.key2}>
                                            <Text style={styles.keyLabel}>EAN:</Text>
                                        </View>
                                        <View style={styles.value}>
                                            <Text style={styles.valueLabel}>{ean}</Text>
                                        </View>
                                    </View>

                                    <Divider style={styles.divider} />

                                    <View style={styles.buttonContainer}>
                                        <Button title="Imprimir Cartaz Pequeno" disabled={disableA5}
                                            onPress={() => this.onPressImprimirCartazPequeno(documento)} />

                                        <Button title="Imprimir Cartaz Grande" disabled={disableA3}
                                            onPress={() => this.onPressImprimirCartazGrande(documento)} />
                                    </View>
                                </Card>
                            );
                        })
                    }
                </ScrollView>
            );
        }

        let loading = '';
        if (!error) {
            this.props.fetching ? 'Carregando...' : 'Sem dados para exibição';
        }

        return (
            <View style={styles.emptyData}>
                <Text style={styles.titleStyle}>{loading}</Text>
            </View>
        );
    }

}

const styles = ScaledSheet.create({
    titleStyle: {
        fontSize: 25,
        fontStyle: 'italic'
    },
    divider: {
        height: 3,
        marginBottom: 9
    },
    cardRow: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 9
    },
    key: {
        flex: 1,
        flexDirection: 'row'
    },
    key2: {
        paddingLeft: 40,
        flex: 1,
        flexDirection: 'row'
    },
    key3: {
        paddingLeft: 40,
        flex: 1,
        flexDirection: 'row'
    },
    keyGrey: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#eee'
    },
    keyGrey2: {
        paddingLeft: 40,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#eee'
    },
    value: {
        flex: 1,
        flexDirection: 'row-reverse'
    },
    valueGrey: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: '#eee',
        fontSize: "13@ms"
    },
    keyLabel: {
        fontSize: "13@ms",
        fontWeight: 'bold'
    },
    valueLabel: {
        fontSize: "13@ms",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '5%'
    },
    emptyData: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = state => {
    return { documentos, error, fetching, authData } = state;
}

const mapDispatchToProps = dispatch => {
    return {
        printDocumento: selectedDocumento => dispatch({
            type: PRINT_DOCUMENTO_REQUEST,
            payload: selectedDocumento
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentosLista);
