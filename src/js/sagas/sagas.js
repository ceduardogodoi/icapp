import { takeEvery, call, put } from 'redux-saga/effects';
import {
    fetchDocumentos, print, fetchLojas, fetchTabloides,
    fetchPapeis, fetchTipos, authorize, getLojasByAccessToken
} from '../api';
import { deleteCartazes } from '../utils/fsUtils'
import SmartUXSDKModule from '../native_modules/SmartUXSDKModule';
import {
    FETCH_DOCUMENTOS_REQUEST,
    FETCH_DOCUMENTOS_SUCCESS,
    FETCH_DOCUMENTOS_FAILURE,
    PRINT_DOCUMENTO_REQUEST,
    PRINT_DOCUMENTO_SUCCESS,
    PRINT_DOCUMENTO_FAILURE,
    FETCH_LOJAS_REQUEST,
    FETCH_LOJAS_FAILURE,
    FETCH_LOJAS_SUCCESS,
    FETCH_TABLOIDES_REQUEST,
    FETCH_TABLOIDES_SUCCESS,
    FETCH_TABLOIDES_FAILURE,
    FETCH_PAPEIS_REQUEST,
    FETCH_PAPEIS_SUCCESS,
    FETCH_PAPEIS_FAILURE,
    FETCH_TIPOS_REQUEST,
    FETCH_TIPOS_SUCCESS,
    FETCH_TIPOS_FAILURE,
    SIGNIN_REQUEST,
    SIGNIN_REQUEST_SUCCESS,
    SIGNIN_REQUEST_FAILURE,
    SIGNIN_REQUEST_DENIED,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    GET_LOJAS_REQUEST,
    GET_LOJAS_SUCCESS,
    GET_LOJAS_FAILURE,
    UNLOAD_DOCUMENTOS_REQUEST,
    UNLOAD_DOCUMENTOS_SUCCESS,
    UNLOAD_DOCUMENTOS_FAILURE
} from '../constants/action-types';

// Watcher Saga: assiste as ações despachadas para a Store e
// inicia os Workers Sagas correspondentes.
export function* watchLoadDocumentos() {
    yield takeEvery(FETCH_DOCUMENTOS_REQUEST, loadDocumentos);
}

export function* watchUnloadDocumentos() {
    yield takeEvery(UNLOAD_DOCUMENTOS_REQUEST, unloadDocumentos);
}

export function* watchPrintDocumento() {
    yield takeEvery(PRINT_DOCUMENTO_REQUEST, printFile);
}

export function* watchLoadLojas() {
    yield takeEvery(FETCH_LOJAS_REQUEST, loadLojas);
}

export function* watchLoadTabloides() {
    yield takeEvery(FETCH_TABLOIDES_REQUEST, loadTabloides);
}

export function* watchLoadPapeis() {
    yield takeEvery(FETCH_PAPEIS_REQUEST, loadPapeis);
}

export function* watchFetchTipos() {
    yield takeEvery(FETCH_TIPOS_REQUEST, loadTipos);
}

export function* watchLogout() {
    yield takeEvery(LOGOUT_REQUEST, unauthorize);
}

export function* watchGetLojas() {
    yield takeEvery(GET_LOJAS_REQUEST, getLojas);
}

export function* watchSignIn() {
    yield takeEvery(SIGNIN_REQUEST, signIn);
}

// Worker Saga: faz a chamada a API quando o Watcher Saga vê a ação.
function* loadDocumentos(action) {
    try {
        const data = yield call(fetchDocumentos, action);
        const documentos = data ? data : {};

        // despacha uma ação de Sucesso para a Store com o documentos.
        yield put({ type: FETCH_DOCUMENTOS_SUCCESS, documentos });
    } catch (error) {
        // Despacha uma ação de Falha para a Store com o erro.
        yield put({ type: FETCH_DOCUMENTOS_FAILURE, error });
    }
}

function* printFile(action) {
    try {
        // apaga o diretório do cartazes e o cria novamente.
        deleteCartazes();

        // faz o download do arquivo e retorna o seu Path no dispositivo.
        const filePath = yield call(print, action);

        // imprime usando o Progress Dialog da Impressora.
        SmartUXSDKModule.executePrint(filePath);

        yield put({ type: PRINT_DOCUMENTO_SUCCESS });
    } catch (error) {
        yield put({ type: PRINT_DOCUMENTO_FAILURE, error });
    }
}

function* loadLojas() {
    try {
        const data = yield call(fetchLojas);
        const lojas = data ? data : {};

        yield put({ type: FETCH_LOJAS_SUCCESS, lojas });
    } catch (error) {
        yield put({ type: FETCH_LOJAS_FAILURE, error });
    }
}

function* loadTipos() {
    try {
        const data = yield call(fetchTipos);
        const tipos = data ? data : {};

        yield put({ type: FETCH_TIPOS_SUCCESS, tipos });
    } catch (error) {
        yield put({ type: FETCH_TIPOS_FAILURE, error });
    }
}

function* loadTabloides(action) {
    try {
        const data = yield call(fetchTabloides, action);
        const tabloides = data ? data : {};

        yield put({ type: FETCH_TABLOIDES_SUCCESS, tabloides });
    } catch (error) {
        yield put({ type: FETCH_TABLOIDES_FAILURE, error });
    }
}

function* loadPapeis(action) {
    try {
        const data = yield call(fetchPapeis, action);
        const papeis = data ? data : {};

        yield put({ type: FETCH_PAPEIS_SUCCESS, papeis });
    } catch (error) {
        yield put({ type: FETCH_PAPEIS_FAILURE, error });
    }
}

function* signIn(action) {
    try {
        const authData = yield call(authorize, action);
        if (authData)
            yield put({ type: 'STORE_AUTH_DATA', authData });

        let lojas = yield call(getLojasByAccessToken, authData.access_token);

        lojas.length === 0 ?
            yield put({ type: SIGNIN_REQUEST_DENIED })
            :
            yield put({ type: SIGNIN_REQUEST_SUCCESS, authData, lojas });
    } catch (error) {
        yield put({ type: SIGNIN_REQUEST_FAILURE, error });
    }
}

function* unauthorize() {
    try {
        yield put({ type: LOGOUT_SUCCESS });
    } catch (error) {
        yield put({ type: LOGOUT_FAILURE, error });
    }
}

function* getLojas(action) {
    try {
        let lojas = yield call(getLojasByAccessToken, action);

        yield put({ type: GET_LOJAS_SUCCESS, lojas });
    } catch (error) {
        yield put({ type: GET_LOJAS_FAILURE, error });
    }
}

function* unloadDocumentos() {
    try {
        yield put({ type: UNLOAD_DOCUMENTOS_SUCCESS });
    } catch (error) {
        yield put({ type: UNLOAD_DOCUMENTOS_FAILURE, error });
    }
}
