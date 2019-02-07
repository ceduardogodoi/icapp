import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

class LabeledInput extends Component {

    isVisible(visibility) {
        if (visibility) {
            return (
                <View style={styles.container}>
                    <Text style={this.props.isValid ? styles.text : styles.textInvalid}>{`${this.props.label}:`}</Text>
                    <TextInput {...this.props} underlineColorAndroid="grey" placeholderTextColor="grey"
                        style={this.props.isValid ? styles.input : styles.inputInvalid} />
                </View>
            );
        }

        return null;
    }

    render() {
        return this.isVisible(this.props.isVisible);
    }

}

const styles = ScaledSheet.create({
    container: {
        marginBottom: "15@ms"
    },
    input: {
        fontSize: "15@ms",
        width: '96%',
        color: 'black'
    },
    inputInvalid: {
        fontSize: "15@ms",
        width: '96%',
        color: 'red'
    },
    text: {
        fontSize: "15@ms"
    },
    textInvalid: {
        fontSize: "15@ms",
        color: "red"
    }
})

export default LabeledInput;