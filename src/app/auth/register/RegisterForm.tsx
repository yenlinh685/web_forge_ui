'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { GithubIcon, GoogleIcon } from '~/components/icon/Icon'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Field, FieldError, FieldGroup } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Spinner } from '~/components/ui/spinner'
import { getErrMessageFromAPI } from '~/helper/handleApiError'
import * as authService from '~/services/authServices'
import { loginWithGithub, loginWithGoogle } from '~/services/authServices'

const registerSchema = z
    .object({
        full_name: z
            .string()
            .min(1, 'Tên không được bỏ trống')
            .refine((value) => value.split(' ').length >= 2, 'Tên phải có ít nhất 2 từ'),
        email: z.email({ error: 'Vui lòng nhập email hợp lệ' }),
        password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
        confirm_password: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự' }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Mật khẩu và xác nhận mật khẩu không khớp',
        path: ['confirm_password'],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterForm = ({ searchParams }: { searchParams: { redirect_to?: string } }) => {
    const router = useRouter()
    const pathname = usePathname()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

    const handleRegisterWithGoogle = async () => {
        try {
            await loginWithGoogle()
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    const handleRegisterWithGithub = async () => {
        try {
            await loginWithGithub()
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const response = await authService.register({
                full_name: data.full_name,
                email: data.email,
                password: data.password,
            })

            router.push(
                `/auth/verify?auth_challenge_id=${encodeURIComponent(response.meta?.auth_challenge_id || '')}&from_email=${encodeURIComponent(data.email)}&redirect_to=${encodeURIComponent(searchParams.redirect_to || `/user/@${response.data.nickname}`)}&back_to=${encodeURIComponent(pathname)}`,
            )
        } catch (error) {
            setErrorMessage(getErrMessageFromAPI(error))
        }
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl leading-10 font-bold">Tạo tài khoản mới</h1>
            <p className="mt-1 leading-6 text-[#45464D]">Bắt đầu hành trình chinh phục kiến thức ngay hôm nay.</p>

            <div className="mt-8 flex items-center gap-4">
                <Button variant="outline" className="flex-1 py-5" onClick={handleRegisterWithGoogle}>
                    <GoogleIcon />
                    Google
                </Button>
                <Button variant="outline" className="flex-1 py-5" onClick={handleRegisterWithGithub}>
                    <GithubIcon />
                    Github
                </Button>
            </div>

            <div className="relative mt-8 flex items-center">
                <div className="border-border-subtle grow border-t"></div>
                <span className="text-muted-foreground text-outline mx-4 shrink-0 text-sm">Hoặc đăng ký với email</span>
                <div className="border-border-subtle grow border-t"></div>
            </div>

            <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Field className="gap-1.5">
                        <Label htmlFor="full_name">Họ và tên</Label>
                        <Input
                            id="full_name"
                            type="text"
                            placeholder="Nguyễn Văn A"
                            className="py-5"
                            {...register('full_name')}
                            onChange={(e) => {
                                setErrorMessage('')
                                register('full_name').onChange(e)
                            }}
                        />
                        {errors.full_name && <FieldError>{errors.full_name.message}</FieldError>}
                    </Field>
                    <Field className="gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="text"
                            placeholder="name@example.com"
                            className="py-5"
                            {...register('email')}
                            onChange={(e) => {
                                setErrorMessage('')
                                register('email').onChange(e)
                            }}
                        />
                        {errors.email && <FieldError>{errors.email.message}</FieldError>}
                    </Field>
                    <div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            <Field className="gap-1.5">
                                <Label htmlFor="password">Mật khẩu</Label>
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
                                {errors.password && <FieldError>{errors.password.message}</FieldError>}
                            </Field>
                            <Field className="gap-1.5">
                                <Label htmlFor="confirm_password">Xác nhận </Label>
                                <div className="relative">
                                    <Input
                                        id="confirm_password"
                                        type={isShowPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="py-5 pr-10!"
                                        {...register('confirm_password')}
                                        onChange={(e) => {
                                            setErrorMessage('')
                                            register('confirm_password').onChange(e)
                                        }}
                                    />
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
                                {errors.confirm_password && <FieldError>{errors.confirm_password.message}</FieldError>}
                            </Field>
                        </div>
                        {errorMessage && <FieldError className="mt-2">{errorMessage}</FieldError>}

                        <div className="mt-6 flex items-center gap-2">
                            <Checkbox
                                id="terms"
                                checked={termsAccepted}
                                onCheckedChange={(checked: boolean) => {
                                    setTermsAccepted(checked)
                                }}
                            />
                            <label htmlFor="terms" className="cursor-pointer text-sm">
                                Tôi đồng ý với{' '}
                                <Link href={'/terms'} className="text-chart-4 font-medium hover:underline">
                                    Điều khoản dịch vụ
                                </Link>{' '}
                                và{' '}
                                <Link href={'/policy'} className="text-chart-4 font-medium hover:underline">
                                    Chính sách bảo mật
                                </Link>
                                .
                            </label>
                        </div>
                    </div>
                </FieldGroup>

                <Button
                    className="mt-8 w-full py-5 font-semibold"
                    type="submit"
                    disabled={!termsAccepted || isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : 'Đăng Ký Tài Khoản'}
                </Button>

                <div className="mt-5 flex items-center justify-center">
                    <p className="text-center text-sm">
                        Đã có tài khoản?{' '}
                        <Link
                            href={`/auth/login?redirect_to=${searchParams.redirect_to || '/'}`}
                            className="text-chart-4 font-semibold hover:underline"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm
