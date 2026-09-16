import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const getErrMessageFromAPI = (error: any) => {
    let message = ''

    if (error instanceof AxiosError) {
        if (error.response?.status === 422 && Array.isArray(error.response.data.error)) {
            interface ValidationError {
                code: string
                field: string
                message: string
            }

            message = error.response.data.error
                .map((error: ValidationError) => {
                    return error.field + ': ' + error.message
                })
                .join('\n')

            return message
        }

        if (error.response?.data.message && !error.status?.toString().startsWith('5')) {
            message = error.response?.data.message
        } else {
            message = 'Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ admin để xử lí'
        }
    } else {
        message = error.message
    }

    return message
}

const handleApiError = (error: any, message?: string, toastId?: string | number) => {
    const errorMessage = message || getErrMessageFromAPI(error)
    toast.error(errorMessage, { id: toastId })
}

export default handleApiError
