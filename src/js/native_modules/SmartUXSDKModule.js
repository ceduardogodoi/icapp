/**
 * Isto expõe o módulo nativo da SmartUX SDK como um módulo JavaScript.
 * Este módulo possui os métodos:
 * 
 * O método imprimir.
 * 1. SmartUXSDKModule.print(filePath: string)
 * 1.1 {string} filePath O caminho do arquivo a ser impresso.
 */
import { NativeModules } from 'react-native';

export default NativeModules.SmartUXSDKModule;