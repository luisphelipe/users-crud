import { combineReducers } from 'redux';
import { reducer as auth } from './slices/auth';

const rootReducer = combineReducers({
    auth,
});

export default rootReducer;
