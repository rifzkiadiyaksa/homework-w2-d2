import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: "",
}

export const userTokenSlice = createSlice({
    name: 'userToken',
    initialState,
    reducers: {
        saveToken: (state, action) => {
        state.token += action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { saveToken } = userTokenSlice.actions

export default userTokenSlice.reducer