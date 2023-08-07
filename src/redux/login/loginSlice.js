import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import { ALERT_TYPE, ERROR_MSG } from '../../utils/Constants'
import { postApi } from "../../utils/Apis"
import { setLoading } from '../configSlice'


const initialState = {

}

export const signup = createAsyncThunk('signup', async (payload, { dispatch }) => {
    dispatch(setLoading(true))
    const { data } = await postApi('/signup', payload)
    dispatch(setLoading(false))
    return data
})

export const login = createAsyncThunk('signup', async (payload, { dispatch }) => {
    dispatch(setLoading(true))
    const { data } = await postApi('/login', payload)
    dispatch(setLoading(false))
    return data
})

export const loginSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
    },
    // extraReducers(builder) {
    //     builder
    //         .addCase(signup.pending, (state, action) => {
    //             // state.status = 'loading'
    //         })
    //         .addCase(signup.fulfilled, (state, action) => {
    //             // state.status = 'succeeded'
    //         })
    //         .addCase(signup.rejected, (state, action) => {
    //             // state.status = 'failed'
    //         })
    // }
})

// Action creators are generated for each case reducer function
export const { } = loginSlice.actions

export default loginSlice.reducer