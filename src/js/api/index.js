import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadOptions } from '../utils/downloadUtils';
import { cartazDir } from '../utils/fsUtils';
import { URL_API, AUTH_CONDOR, URL_EMPRESAS } from './constants';

export function fetchDocumentos(action) {
    let { param, tabloide, papel, hostEan } = action.payload;
    param += '';

    let isRegiao = param.toLowerCase().includes('regiao');

    let url = `${URL_API}/documentos?`;

    if (isRegiao) {
        let regiao = param.replace(' ', '+');

        url += `regiao=${regiao}`;
    } else {
        url += `loja=${param}`;
    }

    if (tabloide) {
        let tipoTabloide = tabloide.slice(0, tabloide.lastIndexOf(' '));
        let tipo = tipoTabloide.replace(' ', '+');
        url = url.concat(`&tipoTabloide=${tipo}`);

        let codigo = tabloide.slice(tabloide.lastIndexOf(' ') + 1);
        url = url.concat(`&codigoTabloide=${codigo}`);
    }

    if (papel) {
        url = url.concat(`&papel=${papel}`);
    }

    if (hostEan) {
        url = url.concat(`&hostEan=${hostEan}`);
    }

    return new Promise((resolve, reject) => {
        axios({
            url,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${action.payload.authData.access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            // console.dir(response);
            resolve(response.data);
        })
        .catch(error => {
            // console.dir(error);
            reject(error);
        });
    });
}

export function print(action) {
    let { regiao, loja, tipoTabloide, codigoTabloide,
        papel, dataInicial, dataFinal, ean, host, geral } = action.payload.documento;

    tipoTabloide = tipoTabloide.replace(' ', '+');

    let url = `${URL_API}/documentos/download?`;

    let documento = '';
    if (loja !== null) {
        url += `loja=${loja}`;
    } else if (geral) {
        url += `geral=${true}`;
    } else {
        regiao = regiao.replace(' ', '+');
        url += `regiao=${regiao}`;
    }

    documento += `${papel}__${dataInicial}__${dataFinal}__${ean}__${host}__.pdf`;

    url += `&tipoTabloide=${tipoTabloide}`;
    url += `&codigoTabloide=${codigoTabloide}`;
    url += `&documento=${documento}`;

    return RNFetchBlob.config(downloadOptions(cartazDir, documento))
        // aqui é onde o download é feito.
        .fetch('GET', url, {
            'Authorization': `Bearer ${action.payload.authData.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        .then(response => response.data) // retorna o Path do arquivo no dispositivo.
        .catch(error => error); // retorna o erro.
}

export function fetchLojas() {
    return new Promise((resolve, reject) => {
        axios.get(`${URL_API}/lojas`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

export function fetchTipos() {
    return new Promise((resolve, reject) => {
        axios.get(`${URL_API}/documentos/tipos`)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

export function fetchTabloides(action) {
    let codigoLoja = '' + action.payload.codLoja;

    let url = `${URL_API}/documentos/tabloides?`;

    url += `loja=${codigoLoja}`;

    return new Promise((resolve, reject) => {
        axios({
            url,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${action.payload.authData.access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

export function fetchPapeis(action) {
    let payload = '' + action.payload;

    let isRegiao = payload.toLowerCase().includes('regiao');

    let url = `${URL_API}/documentos/papeis?`;

    if (isRegiao) {
        let regiao = payload.replace(' ', '+');

        url += `regiao=${regiao}`;

        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }


    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

export function authorize(action) {
    const { matricula, senha } = action.payload;
    let encodedMatricula = encodeURIComponent(matricula);
    let encodedSenha = encodeURIComponent(senha);

    let data = `client_id=web_app&grant_type=password&username=${encodedMatricula}&password=${encodedSenha}`;
    let config = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return new Promise((resolve, reject) => {
        axios.post(AUTH_CONDOR, data, config)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export function getLojasByAccessToken(action) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: URL_EMPRESAS,
            headers: {
                'Authorization': `Bearer ${action}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'uriservico': 'APP_IMPRESSORA_CARTAZ'
            }
        })
        .then(response => {
            resolve(response.data[0].listaOrgao);
        })
        .catch(error => {
            reject(error);
        });
    });
}
