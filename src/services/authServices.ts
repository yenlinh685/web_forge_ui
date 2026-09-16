import { AxiosResponse } from 'axios'
import { signInWithPopup } from 'firebase/auth'

import config from '~/config'
import { ApiResponse } from '~/types/apiResponse.type'
import { UserModel } from '~/types/user.type'
import axiosClient from '~/utils/axiosClient'

export const loginWithToken = async (
    token: string,
): Promise<ApiResponse<UserModel, { auth_challenge_id?: string }>> => {
    const res = await axiosClient.post('/auth/loginwithtoken', {
        token,
    })

    return res.data
}

export const loginWithGoogle = async () => {
    const credential = await signInWithPopup(config.firebaseAuth, config.googleProvider)

    const token = await credential.user.getIdToken()

    const res = await loginWithToken(token)

    return {
        ...res,
        email: credential.user.email!,
    }
}

export const loginWithGithub = async () => {
    const credential = await signInWithPopup(config.firebaseAuth, config.githubProvider)

    const token = await credential.user.getIdToken()

    const res = await loginWithToken(token)

    return {
        ...res,
        email: credential.user.providerData[0].email!,
    }
}

export const login = async ({
    email,
    password,
}: {
    email: string
    password: string
}): Promise<ApiResponse<UserModel, { auth_challenge_id?: string }>> => {
    const res = await axiosClient.post('/auth/login', {
        email,
        password,
    })

    return res.data
}

export const logOut = () => {
    return axiosClient.post('/auth/logout')
}

export const register = async ({
    full_name,
    email,
    password,
}: {
    full_name: string
    email: string
    password: string
}): Promise<
    ApiResponse<
        UserModel,
        {
            auth_challenge_id: string
        }
    >
> => {
    const res = await axiosClient.post('/auth/register', {
        full_name,
        email,
        password,
    })

    return res.data
}

export const verifyAuthChallengeId = async ({
    authChallengeId,
    fromEmail,
}: {
    authChallengeId: string
    fromEmail: string
}): Promise<ApiResponse<{ auth_challenge_id: string; created_at: string }>> => {
    const response = await axiosClient.get(`/auth/verification/challenge/${authChallengeId}`, {
        params: {
            email: fromEmail,
        },
    })

    return response.data
}

export const verifyAccountActive = async ({
    email,
    code,
}: {
    email: string
    code: string
}): Promise<AxiosResponse<{ message: string }>> => {
    const response = await axiosClient.post('/auth/verification/active', {
        email,
        code,
    })

    return response.data
}

export const sendVerifyChallengeCode = async (email: string): Promise<AxiosResponse<void>> => {
    return await axiosClient.post('/auth/verification/send', {
        email,
    })
}

export const verifyAccount = async ({
    email,
    code,
}: {
    email: string
    code: string
}): Promise<AxiosResponse<{ message: string }>> => {
    const res = await axiosClient.post('/auth/verification/verify', {
        email,
        code,
    })

    return res.data
}

export const sendResetPasswordEmail = async (email: string): Promise<AxiosResponse<void>> => {
    return await axiosClient.post('/auth/forgot-password', {
        email,
    })
}

export const verifyResetPasswordToken = async ({ email, token }: { email: string; token: string }) => {
    const response = await axiosClient.post(`/auth/forgot-password/verify`, {
        email,
        token,
    })

    return response.data
}

export const resetPassword = async ({ email, token, password }: { email: string; token: string; password: string }) => {
    const response = await axiosClient.post(`/auth/reset-password`, {
        email,
        token,
        password,
    })

    return response.data
}
