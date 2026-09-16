import { Metadata } from 'next'

import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = {
    title: 'Đặt lại mật khẩu | H9N',
    description: 'Đặt lại mật khẩu',
}

interface SearchParams {
    token: string
    email: string
}

const ResetPasswordPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams
    return <ResetPasswordForm searchParams={params} />
}

export default ResetPasswordPage
