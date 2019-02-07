import { all } from 'redux-saga/effects';
import * as sagas from './sagas';

export default function* rootSaga() {
    yield all([
        sagas.watchLoadDocumentos(),
        sagas.watchPrintDocumento(),
        sagas.watchLoadLojas(),
        sagas.watchLoadTabloides(),
        sagas.watchLoadPapeis(),
        sagas.watchFetchTipos(),
        sagas.watchLogout(),
        sagas.watchGetLojas(),
        sagas.watchSignIn(),
        sagas.watchUnloadDocumentos()
    ]);
}
