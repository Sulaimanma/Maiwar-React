import { combineReducers } from "redux"
import viewpointReducer from "./viewpointReducer"

const reducers = combineReducers({
  viewpoint: viewpointReducer,
})

export default reducers
