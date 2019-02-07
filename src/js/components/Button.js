import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

class Button extends Component {

    render() {
        let buttonStyle = this.props.type === 'warn' ? styles.warnButton : styles.button;

        return (
            <TouchableOpacity { ...this.props }
                style={this.props.disabled ? styles.disabledButton : buttonStyle}>
                <Text style={styles.text}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }

}

const styles = ScaledSheet.create({
    button: {
        width: '45%',
        alignItems: 'center',
        backgroundColor: '#005baa',
        padding: 10,
        height: 50,
    },
    warnButton: {
        width: '45%',
        alignItems: 'center',
        backgroundColor: '#ff7e47',
        padding: 10,
        height: 50,
    },
    disabledButton: {
        width: '45%',
        alignItems: 'center',
        backgroundColor: 'grey',
        padding: 10,
        height: 50,
    },
    text: {
        fontSize: "15@ms",
        color: 'white',
        fontWeight: 'bold'
    }
})

export default Button;