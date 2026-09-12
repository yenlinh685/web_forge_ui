'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ArrowLeft } from 'lucide-react'

import AuthContact from '../components/Contact'
import ResendVerifyCode from './ResendVerifyCode'
import { Button } from '~/components/ui/button'
import { FieldError } from '~/components/ui/field'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/components/ui/input-otp'
import handleApiError, { getErrMessageFromAPI } from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'

type BackTo = '/auth/login' | '/auth/register'

interface VerifyFormProps {
    searchParams: {
        from_email: string
        redirect_to?: string
        auth_challenge_id: string
        back_to?: BackTo
    }
}

const backToMap: Record<BackTo, string> = {
    '/auth/login': 'Đăng nhập',
    '/auth/register': 'Đăng ký',
}

const OTP_LENGTH = 6

const VerifyForm = ({ searchParams }: VerifyFormProps) => {
    const router = useRouter()

    const { from_email, redirect_to, back_to, auth_challenge_id } = searchParams

    const inputRef = useRef<HTMLInputElement>(null)

    const [value, setValue] = useState<string>('')
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const [authChallengePayload, setAuthChallengePayload] = useState<{
        auth_challenge_id: string
        created_at: string
    } | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                if (!auth_challenge_id || !from_email) {
                    router.push('/auth/login')
                    return
                }

                const { data } = await authServices.verifyAuthChallengeId({
                    authChallengeId: auth_challenge_id,
                    fromEmail: from_email,
                })

                setAuthChallengePayload(data)
                setIsVerified(true)
            } catch (error) {
                setIsVerified(false)
                handleApiError(error)
                router.push(back_to ?? '/auth/login')
            }
        })()
    }, [auth_challenge_id, back_to, from_email, router])

    const handleChange = (value: string) => {
        setErrorMessage('')

        if (!Number.isNaN(Number(value))) {
            setValue(value)
        }
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleVerifyAccount = async () => {
        try {
            await authServices.verifyAccountActive({ email: from_email, code: value })

            window.location.assign(redirect_to ?? '/')
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    return (
        <div className="w-full 2xl:px-20">
            <Link
                href={back_to ?? '/auth/login'}
                className="flex w-fit items-center gap-1 text-sm font-semibold text-[#45464D] hover:underline"
            >
                <ArrowLeft size={16} />
                Quay lại trang {backToMap[back_to ?? '/auth/login']}
            </Link>

            <h1 className="mt-6 text-3xl leading-10 font-bold">Xác thực tài khoản</h1>

            {!isVerified ? (
                <p className="mt-2 leading-6 text-[#45464D]">Đang xác thực Auth Challenge ID... </p>
            ) : (
                <>
                    <p className="mt-2 leading-6 text-[#45464D]">
                        Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email của bạn.
                    </p>

                    <p className="mt-1 text-sm font-semibold">{from_email}</p>
                </>
            )}

            <div className="mt-8 flex w-full justify-center">
                <div>
                    <InputOTP
                        maxLength={OTP_LENGTH}
                        containerClassName="dark gap-[clamp(0.5rem,2vw,1rem)]"
                        autoFocus
                        onChange={handleChange}
                        value={value}
                        ref={inputRef}
                        pattern={REGEXP_ONLY_DIGITS}
                    >
                        {Array.from({ length: OTP_LENGTH }, (_, i) => (
                            <InputOTPGroup key={i}>
                                <InputOTPSlot
                                    index={i}
                                    className="rounded-md text-2xl font-bold data-[active=true]:ring-0"
                                    style={{
                                        width: 'clamp(2.5rem, 12vw, 3.75rem)',
                                        height: 'clamp(2.5rem, 12vw, 3.75rem)',
                                    }}
                                    aria-invalid={!!errorMessage}
                                />
                            </InputOTPGroup>
                        ))}
                    </InputOTP>
                    {errorMessage && <FieldError className="mt-2">{errorMessage}</FieldError>}
                </div>
            </div>

            <Button
                disabled={!isVerified || value.length < OTP_LENGTH}
                className="mt-8 w-full py-6"
                onClick={handleVerifyAccount}
            >
                Xác thực
            </Button>

            <ResendVerifyCode createdAt={authChallengePayload?.created_at} fromEmail={from_email} />

            <AuthContact />
        </div>
    )
}

export default VerifyForm
