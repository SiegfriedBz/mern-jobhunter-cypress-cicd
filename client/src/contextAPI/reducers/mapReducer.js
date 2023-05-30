import {
    SET_SHOW_POPUP,
    SET_POPUP
} from '../actions'

const mapReducer = (state, action) => {
    switch(action.type) {
        case SET_SHOW_POPUP:
            return { ...state, showPopUp: action.payload }
        case SET_POPUP:
            const { popUpInfo, popUpCoordinates } = action.payload
            return { ...state, popUpInfo, popUpCoordinates }
        default:
            return state
    }
}

export default mapReducer
