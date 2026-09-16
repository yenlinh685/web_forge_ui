import { Metadata } from 'next'

import LoginForm from './LoginForm'

export const metadata: Metadata = {
    title: 'Đăng nhập | H9N',
    description: 'Đăng nhập vào tài khoản của bạn',
}

interface SearchParams {
    redirect_to?: string
}

const LoginPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams

    return <LoginForm searchParams={params} />
}

export default LoginPage
