'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircleAlert, CircleCheck, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Spinner } from '~/components/ui/spinner'
import { getErrMessageFromAPI } from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'

interface ResetPasswordFormProps {
    searchParams: {
        token: string
        email: string
    }
}

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
        confirm_password: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự' }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
        path: ['confirm_password'],
    })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm = ({ searchParams }: ResetPasswordFormProps) => {
    const router = useRouter()

    const { token, email } = searchParams

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirm_password: '',
        },
    })

    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const onSubmit = async (data: ResetPasswordValues) => {
        try {
            await authServices.resetPassword({ token, email, password: data.password })

            toast.success('Đặt lại mật khẩu thành công. Đang chuyển hướng về trang login...')

            setTimeout(() => {
                router.push('/auth/login')
            }, 2000)
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    // verify token
    useEffect(() => {
        if (!token && !email) {
            toast.error('Thiếu thông tin token hoặc email')

            router.push('/auth/forgot-password')

            return
        }

        const verifyToken = async () => {
            try {
                await authServices.verifyResetPasswordToken({ token, email })
            } catch (error) {
                toast.error(getErrMessageFromAPI(error))

                router.push('/auth/forgot-password')
            }
        }

        verifyToken()
    }, [email, router, token])

    return (
        <div className="w-full">
            <h1 className="mt-10 text-3xl leading-10 font-bold">Đặt lại mật khẩu</h1>

            <p className="mt-2 leading-6 text-[#45464D]">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Field className="gap-2">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="••••••••"
                                className="py-5"
                                {...register('password')}
                                onChange={(e) => {
                                    register('password').onChange(e)
                                }}
                            />
                            <Button
                                tabIndex={-1}
                                type="button"
                                variant={'ghost'}
                                size={'icon'}
                                className="absolute top-1/2 right-2 -translate-y-1/2 active:translate-y-[calc(-50%+3px)]!"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        {errors.password && <FieldError>{errors.password.message}</FieldError>}
                    </Field>
                    <Field className="gap-2">
                        <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirm_password"
                                placeholder="••••••••"
                                className="py-5 pr-12"
                                {...register('confirm_password')}
                                onChange={(e) => {
                                    register('confirm_password').onChange(e)
                                }}
                            />
                            <Button
                                tabIndex={-1}
                                type="button"
                                variant={'ghost'}
                                size={'icon'}
                                className="absolute top-1/2 right-2 -translate-y-1/2 active:translate-y-[calc(-50%+3px)]!"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                        {errors.confirm_password && <FieldError>{errors.confirm_password.message}</FieldError>}
                        {errorMessage && <FieldError>{errorMessage}</FieldError>}
                    </Field>
                </FieldGroup>

                <div className="mt-6 rounded-md border border-[#E2E8F0] p-4">
                    <p className="flex items-center gap-2 text-xs font-medium">
                        <CircleAlert className="text-chart-4" size={16} />
                        Lưu ý bảo mật
                    </p>
                    <p className="text-chart-4 mt-3 flex items-center gap-2 text-xs font-medium">
                        <CircleCheck className="text-chart-4" size={16} />
                        Sử dụng ít nhất một chữ hoa và một chữ số.
                    </p>
                    <p className="text-chart-4 mt-2 flex items-center gap-2 text-xs font-medium">
                        <CircleCheck className="text-chart-4" size={16} />
                        Tránh sử dụng thông tin cá nhân như ngày sinh.
                    </p>
                </div>

                <Button className="mt-6 w-full py-5" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? <Spinner /> : 'Đặt lại mật khẩu'}
                </Button>

                <Link
                    className="mt-4 block text-center text-sm leading-6 font-medium select-none hover:underline"
                    href={'/auth/login'}
                >
                    Hủy và quay lại đăng nhập
                </Link>
            </form>
        </div>
    )
}

export default ResetPasswordForm
