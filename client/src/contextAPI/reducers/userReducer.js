import { SET_USER, CLEAR_USER } from '../actions'

const userReducer = (state, action) => {
    switch(action.type){
        case SET_USER:
            return { ...state, ...action.payload }
        case CLEAR_USER:
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export default userReducer
