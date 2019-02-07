import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import Login from './src/js/containers/Login';
import DocumentosFiltroContainer from './src/js/containers/DocumentosFiltroContainer';
import { Provider } from 'react-redux';
import store from './src/js/store';

const RootStack = createStackNavigator(
    {
        Login: Login,
        DocumentosFiltroContainer: DocumentosFiltroContainer
    },
    {
        initialRouteName: 'Login',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#005baa',
            },
            headerTintColor: '#fff'
        }
    }
);

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <RootStack />
            </Provider>
        );
    }

}

export default App;