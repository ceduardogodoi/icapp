import { dateSlashfy } from '../utils/stringUtils';

export function isVencido(dataVencimento) {
    let split = dateSlashfy(dataVencimento).split('/');

    let vencimento = `${split[2]}-${split[1]}-${split[0]}`;

    return new Date(vencimento) < Date.now();
}
