'use client'

import { LogOut } from 'lucide-react'

import { Button } from '~/components/ui/button'
import handleApiError from '~/helper/handleApiError'
import * as authServices from '~/services/authServices'

interface LogoutButtonProps extends React.ComponentProps<'button'> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ variant = 'destructive', ...props }) => {
    const handleLogOut = async () => {
        try {
            await authServices.logOut()

            window.location.reload()
        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <Button variant={variant} {...props} onClick={handleLogOut}>
            <LogOut className="h-4 w-4" />
            Đăng xuất
        </Button>
    )
}

export default LogoutButton
