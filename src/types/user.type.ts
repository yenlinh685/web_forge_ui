export interface UserModel {
    full_name: string
    avatar_url?: string
    id: string
    first_name: string
    last_name: string
    nickname: string
    role: 'admin' | 'user'
    is_active: boolean
    is_blocked: boolean
    blocked_at: Date | null
    blocked_by: string | null
    blocked_reason: string | null
    created_at: Date
    updated_at: Date
}
