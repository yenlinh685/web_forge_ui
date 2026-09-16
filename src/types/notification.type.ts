import { BaseModel, MetaCursorPagination, ResponseCursorPagination } from './apiResponse.type'
import { UserModel } from './user.type'

type NotificationMetadata = { type: 'course'; course_id: string } | { type: 'group'; group_id: string }

export interface NotificationModel extends BaseModel {
    content: string
    meta_data: NotificationMetadata | null
    actor_id: string
}

export interface NotificationRecipientModel extends BaseModel {
    is_read: boolean
    is_seen: boolean
    notification_id: string
    recipient_id: string
}

export interface NotificationResponse extends Omit<
    ResponseCursorPagination<
        (NotificationModel & {
            recipient: NotificationRecipientModel
            actor: UserModel
        })[]
    >,
    'meta'
> {
    meta: MetaCursorPagination['meta'] & {
        unseen_count: number
    }
}
