import { ApiResponse } from '~/types/apiResponse.type'
import { UserModel } from '~/types/user.type'
import axiosClient from '~/utils/axiosClient'

export const getCurrentUser = async (): Promise<ApiResponse<UserModel>> => {
    const response = await axiosClient.get('/me')
    return response.data
}
