const initialState = {
  latitude: -27.477173,
  longitude: 138.014308,
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 7,
  bearing: 0,
  pitch: 0,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "changeViewpoint":
      return action.viewpoint
    // case "withdraw":
    //   return state - action.payload
    default:
      return state
  }
}

export default reducer
