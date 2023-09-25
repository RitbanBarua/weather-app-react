import { combineReducers } from "redux";
import latitudeReducer from './latitudeReducer'
import longitudeReducer from './logitudeReducer'

const reducers = combineReducers({
    latitude: latitudeReducer,
    longitude : longitudeReducer
})

export default reducers;