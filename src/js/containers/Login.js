import React, { Component } from 'react';
import { View, ToastAndroid, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { connect } from 'react-redux';
import { padStart } from '../utils/stringUtils'
import LabeledInput from '../components/LabeledInput';
import Button from '../components/Button';
import { LOGOUT_REQUEST, SIGNIN_REQUEST } from '../constants/action-types';
import { URL_API } from '../api/constants';

class Login extends Component {

    constructor() {
        super();

        this.state = {
            // matricula: '1223230',
            matricula: '',
            matriculaIsValid: true,
            // senha: '456789',
            senha: '',
            senhaIsValid: true,
            message: '',
            showLoginMsg: false
        }

        this.tries = -1;

        this.setMatricula = this.setMatricula.bind(this);
        this.setSenha = this.setSenha.bind(this);

        this.onPressEntrar = this.onPressEntrar.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    static navigationOptions = {
        title: 'Impressão de Documentos - Login'
    }

    resetState() {
        this.setState({
            matricula: '',
            matriculaIsValid: true,
            senha: '',
            senhaIsValid: true,
            message: '',
            showLoginMsg: false
        });
    }

    setMatricula(matricula) {
        if (matricula && matricula.length > 0) {
            this.setState({ matriculaIsValid: true });
        }

        this.setState({ matricula });
    }

    setSenha(senha) {
        if (senha && senha.length > 0) {
            this.setState({ senhaIsValid: true });
        }

        this.setState({ senha });
    }

    onPressEntrar() {
        const { matricula, senha } = this.state;

        if (!matricula || matricula.length < 1) {
            this.setState({ matriculaIsValid: false });

            ToastAndroid.show('Você deve informar a Matrícula', ToastAndroid.SHORT);
            return;
        }

        this.setState({ matriculaIsValid: true });

        if (!senha || senha.length < 1) {
            this.setState({ senhaIsValid: false });

            ToastAndroid.show('Você deve informar a Senha', ToastAndroid.SHORT);
            return;
        }

        this.setState({ senhaIsValid: true });

        this.tries++;
        this.props.signIn(matricula, senha);
    }

    disabledHandler = () => {
        const { matricula, senha } = this.state;
        const { error } = this.props;

        if (error && error.message === 'Network Error')
            return true;

        return matricula === '' || senha === '';
    }

    editableHandler = () => {
        const { error } = this.props;
        if (error && error.message !== 'Network Error')
            return true;
        else if (error === null)
            return true;
        else
            return false;
    }

    componentWillReceiveProps() {
        this.setState({ showLoginMsg: true });
    }

    componentDidMount() {
        this.tries++;
        this.props.signIn('', '');
    }

    componentDidUpdate() {
        const { isAuthorized, isLogout, error, lojas } = this.props;
        const { showLoginMsg } = this.state;

        if (showLoginMsg) {
            if (!isLogout) {
                if (error !== null && error.response !== undefined && error.response.status !== 401) {
                    ToastAndroid.show(`${error}`, ToastAndroid.LONG);
                } else if (isAuthorized && denied === false) {
                    this.resetState();

                    if (lojas.length === 1) {
                        const loja = `Loja: ${padStart(lojas[0].codLoja, 3, '0')} - ${lojas[0].dscOrgao}`;
                        this.props.navigation.navigate('DocumentosFiltroContainer', { selectedLoja: loja });
                    } else {
                        this.tries = 0;
                        this.props.navigation.navigate('DocumentosFiltroContainer');
                    }
                } else if (isAuthorized === false && denied === false) {
                    if (error.message !== 'Network Error' && this.tries > 0)
                        ToastAndroid.show('Usuário ou Senha inválidos', ToastAndroid.SHORT);
                } else if (denied === true) {
                    ToastAndroid.show('Acesso Negado', ToastAndroid.SHORT);
                }
            }

            this.setState({ showLoginMsg: false });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <LabeledInput label="Matrícula" placeholder="Informe sua Matrícula"
                        keyboardType="numeric" value={this.state.matricula}
                        onChangeText={this.setMatricula}
                        isValid={this.state.matriculaIsValid}
                        isVisible={true} returnKeyType="next"
                        editable={this.editableHandler()} />

                    <LabeledInput label="Senha" placeholder="Informe sua Senha"
                        secureTextEntry={true} textContentType="password"
                        value={this.state.senha} onChangeText={this.setSenha}
                        isValid={this.state.senhaIsValid}
                        isVisible={true} returnKeyType="go"
                        editable={this.editableHandler()} />

                    <View style={styles.buttonContainer}>
                        <Button title="Entrar" onPress={this.onPressEntrar} disabled={this.disabledHandler()} />
                        <Button title="Limpar" onPress={this.resetState} disabled={this.disabledHandler()} />
                    </View>
                </View>

                <View>
                    {
                        this.props.error && this.props.error.response && this.props.error.response.status !== 401 ?
                            <Text style={styles.errorMessage}>{`${this.props.error}`}</Text>
                            :
                            this.props.error && this.props.error.message === 'Network Error' ?
                                <Text style={styles.errorMessage}>{`O Certificado Digital parece não estar instalado no Dispositivo:\n${this.props.error.stack}`}</Text>
                                :
                                null
                    }
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionInfo}>Versão 1.0.0</Text>
                </View>
            </View>
        );
    }

}

const styles = ScaledSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center'
    },
    content: {
        marginHorizontal: '25%'
    },
    errorMessage: {
        alignSelf: 'center',
        marginTop: 25,
        color: 'red',
        fontSize: '15@ms',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    versionContainer: {
        position: 'absolute',
        bottom: 0,
        right: 10,
    },
    versionInfo: {
        fontSize: '11@ms'
    }
})

const mapStateToProps = state => {
    return { isAuthorized, isLogout, authData, denied, error, lojas } = state;
}

const mapDispatchToProps = dispatch => {
    return {
        unauthorize: () => dispatch({
            type: LOGOUT_REQUEST
        }),
        signIn: (matricula, senha) => dispatch({
            type: SIGNIN_REQUEST,
            payload: { matricula, senha }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);