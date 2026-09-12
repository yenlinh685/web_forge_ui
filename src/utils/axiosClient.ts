import axios from 'axios'

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
})
let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = []

const processQueue = (error: unknown) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve('')
        }
    })

    failedQueue = []
}

const refreshToken = async () => {
    try {
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}auth/refresh`, {
            withCredentials: true,
        })

        processQueue(null)
    } catch (error) {
        processQueue(error)
        throw error
    }
}

const getNewToken = async () => {
    if (isRefreshing) {
        // if isRefreshing is true, push next failed request to queue
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
        })
    }

    isRefreshing = true

    try {
        await refreshToken()
        isRefreshing = false
        return
    } catch (error) {
        isRefreshing = false
        throw error
    }
}

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        const shouldRenewToken =
            error.response?.status === 401 &&
            !originalRequest._retry &&
            error.response.headers['x-refresh-token-required'] === 'true'

        if (shouldRenewToken) {
            originalRequest._retry = true

            try {
                await getNewToken()

                return axiosClient(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default axiosClient
