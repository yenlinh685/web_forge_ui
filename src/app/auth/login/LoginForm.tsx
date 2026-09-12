'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { GithubIcon, GoogleIcon } from '~/components/icon/Icon'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Spinner } from '~/components/ui/spinner'
import { getErrMessageFromAPI } from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'
import { ApiResponse } from '~/types/apiResponse.type'
import { UserModel } from '~/types/user.type'

const loginSchema = z.object({
    email: z.email({ error: 'Vui lòng nhập email hợp lệ' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = ({ searchParams }: { searchParams: { redirect_to?: string } }) => {
    const router = useRouter()
    const pathname = usePathname()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleRedirectNextPage = (
        response: ApiResponse<
            UserModel,
            {
                auth_challenge_id?: string
            }
        >,
        email: string,
    ) => {
        // if the account is active -> redirect to previous page or home page
        if (response.data.is_active) {
            if (searchParams.redirect_to) {
                window.location.assign(searchParams.redirect_to || '/')
            } else {
                window.location.assign('/')
            }
        } else {
            // if the account is not active -> redirect to /auth/verify
            router.push(
                `/auth/verify?auth_challenge_id=${encodeURIComponent(response.meta?.auth_challenge_id || '')}&from_email=${encodeURIComponent(email)}&redirect_to=${encodeURIComponent(searchParams.redirect_to || '/')}&back_to=${encodeURIComponent(pathname)}`,
            )
        }
    }

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await authServices.login(data)

            if (response) {
                handleRedirectNextPage(response, data.email)
            }
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    const handleLoginWithGoogle = async () => {
        try {
            const response = await authServices.loginWithGoogle()

            if (response) {
                handleRedirectNextPage(response, response.email)
            }
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    const handleLoginWithGithub = async () => {
        try {
            const response = await authServices.loginWithGithub()

            if (response) {
                handleRedirectNextPage(response, response.email)
            }
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    return (
        <div className="flex w-full flex-col justify-center">
            <h1 className="text-4xl font-bold">Đăng nhập</h1>
            <p className="mt-2 text-[#45464D]">Chào mừng bạn quay lại. Vui lòng nhập thông tin.</p>

            <div className="mt-8">
                <Button
                    variant={'outline'}
                    className="flex h-11 w-full gap-3 px-4 py-3"
                    onClick={handleLoginWithGoogle}
                >
                    <GoogleIcon />
                    Đăng nhập với Google
                </Button>
                <Button
                    onClick={handleLoginWithGithub}
                    variant={'outline'}
                    className="mt-3 flex h-11 w-full gap-3 px-4 py-3"
                >
                    <GithubIcon />
                    Đăng nhập với Github
                </Button>
            </div>

            <div className="relative mt-8 flex items-center">
                <div className="border-border-subtle grow border-t"></div>
                <span className="text-muted-foreground text-outline mx-4 shrink-0 text-sm">
                    Hoặc đăng nhập bằng email
                </span>
                <div className="border-border-subtle grow border-t"></div>
            </div>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Field className="gap-1.5">
                        <Label htmlFor="email">Địa chỉ Email</Label>
                        <Input
                            id="email"
                            type="text"
                            placeholder="name@example.com"
                            className="py-5"
                            autoFocus
                            {...register('email')}
                            onChange={(e) => {
                                setErrorMessage('')
                                register('email').onChange(e)
                            }}
                        />
                        {errors.email && <FieldError>{errors.email.message}</FieldError>}
                    </Field>
                    <Field className="gap-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Mật khẩu</Label>

                            <Link
                                className="text-chart-4 text-sm font-medium hover:underline"
                                href="/auth/forgot-password"
                                tabIndex={-1}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="py-5 pr-10!"
                                {...register('password')}
                                onChange={(e) => {
                                    setErrorMessage('')
                                    register('password').onChange(e)
                                }}
                            />
                            {errors.password && <FieldError>{errors.password.message}</FieldError>}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1/2 right-2 -translate-y-1/2 active:translate-y-[calc(-50%+3px)]!"
                                type="button"
                                onClick={() => setIsShowPassword(!isShowPassword)}
                                tabIndex={-1}
                            >
                                {isShowPassword ? <Eye /> : <EyeOff />}
                            </Button>
                        </div>

                        {errorMessage && <FieldError>{errorMessage}</FieldError>}
                    </Field>

                    <Button type="submit" className="h-11 w-full px-4 py-3 font-semibold" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : 'Đăng nhập'}
                    </Button>

                    <div className="flex items-center justify-center">
                        <p className="text-center text-sm">
                            Chưa có tài khoản?{' '}
                            <Link
                                href={`/auth/register?redirect_to=${searchParams.redirect_to || '/'}`}
                                className="text-chart-4 font-semibold hover:underline"
                            >
                                Đăng ký tài khoản
                            </Link>
                        </p>
                    </div>
                </FieldGroup>
            </form>
        </div>
    )
}

export default LoginForm
