import { ApiResponse } from '~/types/apiResponse.type'
import { SearchResult } from '~/types/search.type'
import axiosClient from '~/utils/axiosClient'

export const search = async ({ q }: { q: string }): Promise<ApiResponse<SearchResult>> => {
    const res = await axiosClient.get('/search', {
        params: {
            q,
        },
    })

    return res.data
}
