import {
    SET_IS_LOADING,
    CLEAR_IS_LOADING,
    SET_FLASH,
    CLEAR_FLASH,
    TOGGLE_SIDE_BAR
} from '../actions'

const appReducer = (state, action) => {
    switch(action.type) {
        case SET_IS_LOADING:
            return { ...state, isLoading: true }
        case CLEAR_IS_LOADING:
            return { ...state, isLoading: false }
        case SET_FLASH:
            return { ...state, flash: { ...action.payload, showFlash: true } }
        case CLEAR_FLASH:
            return { ...state, flash: { ...state.flash, showFlash: false } }
        case TOGGLE_SIDE_BAR:
            return { ...state, showSideBar: !state.showSideBar }
        default:
            return state
    }
}

export default appReducer
