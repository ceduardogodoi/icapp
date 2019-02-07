import React, { Component } from 'react';
import { View, ScrollView, ToastAndroid, Text } from 'react-native';
import { Picker } from 'native-base';
import { connect } from 'react-redux';
import { ScaledSheet } from 'react-native-size-matters';
import { padStart } from '../utils/stringUtils';
import Dropdown from './Dropdown';
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import {
    FETCH_DOCUMENTOS_REQUEST,
    FETCH_TABLOIDES_REQUEST,
    FETCH_PAPEIS_REQUEST,
    UNLOAD_DOCUMENTOS_REQUEST
} from '../constants/action-types';

class DocumentosFiltro extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hostEan: '',
            hostEanIsValid: true,
            hostEanIsVisible: false,
            hostEanIsEditable: true,
            loja: undefined,
            lojaIsValid: true,
            tabloide: undefined,
            tabloideIsValid: true,
            tabloideIsVisible: false,
            tabloideIsEnabled: true,
            // papel: undefined,
            // papelIsValid: true,
            // papelIsVisible: false,
            // papelIsEnabled: true,
            pesquisarDisabled: true
        };

        this.setLoja = this.setLoja.bind(this);
        this.setHostEan = this.setHostEan.bind(this);
        this.setTabloide = this.setTabloide.bind(this);
        // this.setPapel = this.setPapel.bind(this);

        this.onPressPesquisar = this.onPressPesquisar.bind(this);
        this.onPressLimpar = this.onPressLimpar.bind(this);
    }

    setLoja(loja) {
        this.setState({ loja });

        if (loja) {
            const lojaFormat = `Loja: ${padStart(loja.codLoja, 3, '0')} - ${loja.dscOrgao}`;
            this.props.navigation.setParams({ selectedLoja: lojaFormat });

            this.setState({
                tabloide: undefined,
                hostEan: ''
            });

            this.props.unloadDocumentos();

            this.props.loadTabloides({
                codLoja: loja.codLoja,
                authData: this.props.authData
            });
            // this.props.loadPapeis(loja.codLoja);

            this.setState({
                lojaIsValid: true,
                pesquisarDisabled: false,
                tabloideIsVisible: true,
                // papelIsVisible: true,
                hostEanIsVisible: true,
                hostEanIsEditable: true,
                tabloideIsEnabled: true
                // papelIsEnabled: true
            });

            return;
        }

        this.props.navigation.setParams({ selectedLoja: 'Nenhuma Loja selecionada' });

        this.setState({
            pesquisarDisabled: true,
            hostEan: '',
            hostEanIsValid: true,
            hostEanIsEditable: false,
            tabloideIsEnabled: false,
            // papelIsEnabled: false
        });
    }

    setTabloide(tabloide) {
        this.setState({ tabloide });
    }

    // setPapel(papel) {
    //     this.setState({ papel });
    // }

    setHostEan(hostEan) {
        this.setState({ hostEan });

        if (hostEan.length > 0 && hostEan.length < 3) {
            this.setState({ hostEanIsValid: false });
            this.setState({ pesquisarDisabled: true });

            return;
        }

        this.setState({ pesquisarDisabled: false });
        this.setState({ hostEanIsValid: true });
    }

    getLojaPickers() {
        const { lojas } = this.props;

        if (lojas && lojas.length > 1) {
            let arr = [];
            arr[0] = <Picker.Item key="0" label="Escolha uma Loja" value={undefined} />;

            arr.push(lojas.map(loja => <Picker.Item key={loja.codLoja} label={`${padStart(loja.codLoja, 3, '0')} - ${loja.dscOrgao}`} value={loja} />));

            return arr;
        }

        let loja = lojas[0];
        return <Picker.Item key={loja.codLoja} label={`${padStart(loja.codLoja, 3, '0')} - ${loja.dscOrgao}`} value={loja} />;
    }

    getTabloidePickers() {
        const { tabloides } = this.props;
        const { loja } = this.state;

        if (loja) {
            if (tabloides && tabloides.length > 1) {
                let arr = [];
                arr[0] = <Picker.Item key="0" label="Todos" />;

                arr.push(tabloides.map((tabloide, idx) => <Picker.Item key={idx} label={tabloide} value={tabloide} />));

                return arr;
            } else if (tabloides.length === 1) {
                let tabloide = tabloides[0];
                return <Picker.Item key={tabloide} label={tabloide} value={tabloide} />;
            }

            return <Picker.Item key="0" label="Não há Documentos" value={undefined} />;
        }
    }

    // getPapelPickers() {
    //     const { papeis } = this.props;
    //     const { loja } = this.state;

    //     if (loja) {
    //         if (papeis && papeis.length > 1) {
    //             let arr = [];
    //             arr[0] = <Picker.Item key="0" label="Todos" />;

    //             arr.push(papeis.map((papel, idx) => <Picker.Item key={idx} label={papel} value={papel} />));

    //             return arr;
    //         } else if (papeis.length === 1) {
    //             let papel = papeis[0];
    //             return <Picker.Item key={papel} label={papel} value={papel} />;
    //         }

    //         return <Picker.Item key="0" label="Não há Documentos" value={undefined} />;
    //     }
    // }

    onPressPesquisar() {
        this.props.unloadDocumentos();

        const { loja, tabloide, papel, hostEan } = this.state;

        if (!loja) {
            this.setState({ lojaIsValid: false });

            ToastAndroid.show('Você deve escolher uma Loja', ToastAndroid.SHORT);
            return;
        }

        if (hostEan.length > 0 && hostEan.length < 3) {
            this.setState({ hostEanIsValid: false });

            ToastAndroid.show('Host/EAN deve ter no mínimo 5 caracteres', ToastAndroid.SHORT);
            return;
        }

        let param = loja.codLoja;

        this.setState({
            lojaIsValid: true,
            hostEanIsValid: true
        });

        this.props.loadDocumentos({
            param,
            tabloide,
            papel,
            hostEan,
            authData: this.props.authData
        });

        this.props.loadTabloides({
            codLoja: param,
            authData: this.props.authData
        });
    }

    onPressLimpar() {
        if (this.props.lojas.length > 1) {
            this.setState({ loja: undefined });
            this.props.navigation.setParams({ selectedLoja: 'Nenhuma Loja selecionada' });
        }

        this.props.unloadDocumentos();
        this.setState({
            hostEan: '',
            tabloide: undefined,
            hostEanIsValid: true
        });
    }

    componentDidMount() {
        const { lojas } = this.props;

        if (lojas.length === 1) {
            const loja = lojas[0];

            this.setState({
                loja,
                lojaIsValid: true,
                pesquisarDisabled: false,
                tabloideIsVisible: true,
                // papelIsVisible: true,
                hostEanIsVisible: true,
                hostEanIsEditable: true,
                tabloideIsEnabled: true,
                // papelIsEnabled: true
            });

            this.props.loadTabloides(loja.codLoja);
            this.props.loadPapeis(loja.codLoja);
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {
                    this.props.lojas !== undefined && this.props.lojas.length > 1 ?
                        <Text style={styles.text}>{`Lojas encontradas: ${this.props.lojas.length}`}</Text>
                        :
                        null
                }
                {
                    this.props.lojas !== undefined && this.props.lojas.length > 1 ?
                        <Dropdown label="Loja" pickers={this.getLojaPickers()}
                            selectedValue={this.state.loja} onValueChange={this.setLoja}
                            isValid={this.state.lojaIsValid} isVisible={true}
                            enabled={this.props.lojas.length > 1} />
                        :
                        null
                }

                {
                    this.props.tabloides !== undefined ?
                        <Dropdown label="Tabloide" pickers={this.getTabloidePickers()}
                            selectedValue={this.state.tabloide} onValueChange={this.setTabloide}
                            isValid={this.state.tabloideIsValid} isVisible={this.state.tabloideIsVisible}
                            enabled={this.props.tabloides.length > 1 && this.state.loja !== undefined} />
                        :
                        null
                }

                {
                    // this.props.papeis !== undefined ?
                    //     <Dropdown label="Papel" pickers={this.getPapelPickers()}
                    //         selectedValue={this.state.papel} onValueChange={this.setPapel}
                    //         isValid={this.state.papelIsValid} isVisible={this.state.papelIsVisible}
                    //         enabled={this.props.papeis.length > 1 && this.state.loja !== undefined} />
                    //     :
                    //     null
                }

                {
                    !this.state.hostEanIsValid && this.state.loja !== undefined ?
                        <Text style={styles.text}>Informe pelo menos 3 caracteres</Text>
                        :
                        null
                }

                <LabeledInput label='Host ou EAN' keyboardType="numeric" maxLength={14}
                    value={this.state.loja !== undefined ? this.state.hostEan : ''} onChangeText={this.setHostEan}
                    placeholder="Mínimo: 3 caracteres"
                    isValid={this.state.loja !== undefined ? this.state.hostEanIsValid : true} isVisible={this.state.hostEanIsVisible}
                    editable={this.state.hostEanIsEditable && this.state.loja !== undefined && this.props.tabloides.length > 0} />

                <View style={styles.buttonContainer}>
                    {
                        this.props.lojas !== undefined ?
                            <Button accessibilityLabel="Pesquisar" title="Pesquisar"
                                onPress={this.onPressPesquisar}
                                disabled={this.state.pesquisarDisabled && this.props.lojas.length < 1 || this.props.tabloides.length < 1 || !this.state.loja} />
                            :
                            null
                    }

                    {
                        this.props.lojas !== undefined ?
                            <Button accessibilityLabel="Limpar" title="Limpar"
                                onPress={this.onPressLimpar}
                                disabled={!this.state.loja} />
                            :
                            null
                    }
                </View>
            </ScrollView>
        );
    }

}

const styles = ScaledSheet.create({
    container: {
        margin: "10@ms",
        height: '95%',
        width: '35%'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50
    },
    pickerContainer: {
        marginBottom: "15@ms"
    },
    text: {
        fontSize: '12@ms',
        fontWeight: 'bold',
        paddingVertical: 5
    }
})

const mapStateToProps = state => {
    return { lojas, tabloides, papeis, documentos, error, authData } = state;
}

const mapDispatchToProps = dispatch => {
    return {
        loadDocumentos: filters => dispatch({
            type: FETCH_DOCUMENTOS_REQUEST,
            payload: filters
        }),
        loadTabloides: param => dispatch({
            type: FETCH_TABLOIDES_REQUEST,
            payload: param
        }),
        loadPapeis: param => dispatch({
            type: FETCH_PAPEIS_REQUEST,
            payload: param
        }),
        unloadDocumentos: () => dispatch({
            type: UNLOAD_DOCUMENTOS_REQUEST
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentosFiltro);
