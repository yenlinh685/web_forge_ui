import { ApiResponse } from '~/types/apiResponse.type'
import { Stats } from '~/types/stats.type'
import axiosClient from '~/utils/axiosClient'

export const getStats = async (): Promise<ApiResponse<Stats>> => {
    const res = await axiosClient.get('/stats')
    return res.data
}
