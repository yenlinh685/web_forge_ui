'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import AuthContact from '../components/Contact'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { FieldError } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { getErrMessageFromAPI } from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'

interface SearchParams {
    back_to?: '/auth/login' | '/auth/register'
}

type BackTo = '/auth/login' | '/auth/register'

const backToMap: Record<BackTo, string> = {
    '/auth/login': 'Đăng nhập',
    '/auth/register': 'Đăng ký',
}

const forgotPasswordFormSchema = z.object({
    email: z.email({
        message: 'Vui lòng nhập email hợp lệ',
    }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

const ForgotPasswordForm = ({ searchParams }: { searchParams: SearchParams }) => {
    const { back_to } = searchParams

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: '',
        },
    })

    const [errorMessage, setErrorMessage] = useState<string>('')

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const response = await authServices.sendResetPasswordEmail(data.email)

            if (response.status === 202) {
                toast.success(
                    `Chúng tôi đã gửi đường dẫn khôi phục tới ${data.email}. Vui lòng kiểm tra email hoặc thư mục spam.`,
                )

                setErrorMessage('')
            }
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    return (
        <div>
            <Link
                href={back_to ?? '/auth/login'}
                className="flex w-fit items-center gap-1 text-sm font-semibold text-[#45464D] hover:underline"
            >
                <ArrowLeft size={16} />
                Quay lại trang {backToMap[back_to ?? '/auth/login']}
            </Link>

            <h1 className="mt-10 text-3xl leading-10 font-bold">Quên mật khẩu?</h1>
            <p className="mt-2 leading-6 text-[#45464D]">
                Không vấn đề gì! Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn khôi phục mật khẩu.
            </p>

            <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                <p className="text-sm font-semibold text-[#191C1E]">Địa chỉ Email</p>
                <Input type="text" placeholder="name@example.com" className="mt-2 py-5" {...register('email')} />
                <div className="mt-1">
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                    {errorMessage && <FieldError>{errorMessage}</FieldError>}
                </div>

                <Button type="submit" className="mt-6 w-full py-5" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? <Spinner /> : 'Gửi hướng dẫn khôi phục'}
                    {!isSubmitting && <Send />}
                </Button>
            </form>

            <AuthContact />
        </div>
    )
}

export default ForgotPasswordForm
