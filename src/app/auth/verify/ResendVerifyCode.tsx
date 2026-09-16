'use client'

import { useEffect, useState } from 'react'
import moment from 'moment-timezone'

import handleApiError from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'

interface ResendVerifyCodeProps {
    createdAt?: string
    fromEmail: string
}

const ResendVerifyCode: React.FC<ResendVerifyCodeProps> = ({ createdAt, fromEmail }) => {
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        if (!createdAt) return

        const nowMoment = moment.tz(new Date(), 'Asia/Ho_Chi_Minh')

        requestIdleCallback(() => {
            setCounter(60 - nowMoment.diff(moment.tz(createdAt, 'Asia/Ho_Chi_Minh'), 'seconds'))
        })
    }, [createdAt])

    useEffect(() => {
        if (counter <= 0) return

        const timer = setInterval(() => {
            setCounter((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [counter])

    const handleResendCode = async () => {
        if (counter !== 0 || !createdAt) {
            return
        }

        try {
            await authServices.sendVerifyChallengeCode(fromEmail)

            setCounter(60)
        } catch (error) {
            handleApiError(error)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return (
        <div className="mt-6 text-center text-sm select-none">
            Không nhận được mã?{' '}
            <span className="text-chart-4 cursor-pointer select-none">
                <span onClick={handleResendCode} className="text-chart-4 font-semibold hover:underline">
                    Gửi lại mã
                </span>
            </span>
            <p className="text-muted-foreground mt-2 text-xs font-medium">
                {counter > 0
                    ? `Bạn có thể gửi lại mã sau ${formatTime(counter)}`
                    : 'Bạn có thể gửi lại mã ngay bây giờ'}
            </p>
        </div>
    )
}

export default ResendVerifyCode
