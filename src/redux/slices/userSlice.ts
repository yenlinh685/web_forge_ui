import type { Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import * as meService from '~/services/meServices'
import { UserModel } from '~/types/user.type'

interface InitialState {
    currentUser: UserModel | null
    isAuthenticating: boolean
}

const initialState: InitialState = {
    currentUser: null,
    isAuthenticating: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<UserModel | null>) {
            state.currentUser = action.payload
        },
        setIsAuthenticating(state, action: PayloadAction<boolean>) {
            state.isAuthenticating = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser, setIsAuthenticating } = userSlice.actions

export const getCurrentUser = (dispatch: Dispatch) => {
    ;(async () => {
        try {
            const res = await meService.getCurrentUser()

            dispatch(setCurrentUser(res.data || null))
        } catch (_) {
            dispatch(setCurrentUser(null))
        } finally {
            dispatch(setIsAuthenticating(false))
        }
    })()
}

export default userSlice.reducer
