'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'

import { getCurrentUser } from '~/redux/slices/userSlice'
import { AppStore, makeStore } from '~/redux/store'

const store: AppStore = makeStore()

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (store) {
            store.dispatch(getCurrentUser)
        }
    }, [])

    return <Provider store={store}>{children}</Provider>
}
