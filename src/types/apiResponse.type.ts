export interface ApiResponse<T, M = never> {
    data: T
    meta?: M
}

export interface BaseModel {
    id: string
    created_at: Date
    updated_at: Date
}

export interface MetaPagination {
    meta: {
        pagination: {
            total: number
            count: number
            per_page: number
            current_page: number
            total_pages: number
        }
    }
}

export interface MetaCursorPagination {
    meta: {
        pagination: {
            limit: number
            has_next_page: boolean
            next_cursor: string | null
        }
        links: {
            next: string | null
        }
    }
}

export interface ResponsePagination<T> extends MetaPagination {
    data: T
}

export interface ResponseCursorPagination<T> extends MetaCursorPagination {
    data: T
}
