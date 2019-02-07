import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from '../sagas';

import rootReducer from '../reducers';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// create a redux store with middleware
const store = createStore(
    rootReducer,
    compose(applyMiddleware(sagaMiddleware))
)

// run the saga
sagaMiddleware.run(rootSaga);

export default store;