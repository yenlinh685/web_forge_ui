import VerifyForm from './VerifyForm'

interface SearchParams {
    from_email: string
    redirect_to?: string
    auth_challenge_id: string
    back_to?: '/auth/login' | '/auth/register'
}

const VerifyPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const params = await searchParams

    return <VerifyForm searchParams={params} />
}

export default VerifyPage
