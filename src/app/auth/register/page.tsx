import { Metadata } from 'next'

import RegisterForm from './RegisterForm'

interface SearchParams {
    redirect_to?: string
}

export const metadata: Metadata = {
    title: 'Đăng ký tài khoản | H9N',
    description: 'Đăng ký tài khoản của bạn',
}

const RegisterPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams

    return <RegisterForm searchParams={params} />
}

export default RegisterPage
