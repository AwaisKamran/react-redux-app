import counterReducer from './counter';
import loggedReducer from './isLogged';
import { combineReducers } from 'redux';

const rootState = combineReducers({
    counter: counterReducer,
    loggedReducer
});

export default rootState;