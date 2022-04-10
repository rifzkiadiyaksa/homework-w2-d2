import { configureStore } from '@reduxjs/toolkit'
import userTokenReducer from './userToken'

export const store = configureStore({
    reducer: {
        userToken: userTokenReducer
    },
})