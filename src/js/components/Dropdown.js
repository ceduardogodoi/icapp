import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { Picker } from 'native-base';

class Dropdown extends Component {

    isVisible(visibility) {
        if (visibility) {
            return <View style={styles.pickerContainer}>
                <Text style={this.props.isValid ? styles.text : styles.textInvalid}>{`${this.props.label}:`}</Text>
                <Picker {...this.props} mode="dropdown" style={this.props.isValid ? styles.picker : styles.pickerInvalid}>
                    {
                        this.props.pickers ? this.props.pickers : []
                    }
                </Picker>
            </View>
        }

        return null;
    }

    render() {
        return this.isVisible(this.props.isVisible);
    }

}

const styles = ScaledSheet.create({
    pickerContainer: {
        marginBottom: "15@ms"
    },
    picker: {
        width: '96%'
    },
    pickerInvalid: {
        color: 'red',
        width: '96%'
    },
    text: {
        fontSize: "15@ms"
    },
    textInvalid: {
        fontSize: "15@ms",
        color: "red"
    }
})

export default Dropdown;