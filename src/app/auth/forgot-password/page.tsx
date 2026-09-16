import { Metadata } from 'next'

import ForgotPasswordForm from './ForgotPasswordForm'

export const metadata: Metadata = {
    title: 'Quên mật khẩu | H9N',
    description: 'Quên mật khẩu',
}

interface SearchParams {
    back_to?: '/auth/login' | '/auth/register'
}

const ForgotPasswordPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams
    return <ForgotPasswordForm searchParams={params} />
}

export default ForgotPasswordPage
