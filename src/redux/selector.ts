import type { RootState } from './store'

export const selectCurrentUser = (state: RootState) => state.user.currentUser
export const selectIsAuthenticating = (state: RootState) => state.user.isAuthenticating
