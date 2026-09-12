import { SupportIcon } from '~/components/icon/Icon'
import { Separator } from '~/components/ui/separator'

const AuthContact = () => {
    return (
        <div className="mt-14">
            <Separator />

            <div className="mt-8 flex items-center gap-4">
                <a
                    target="_blank"
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                    className="flex-center size-10 rounded-full bg-[#E6E8EA]"
                >
                    <SupportIcon />
                </a>

                <div>
                    <p className="text-sm font-semibold">Cần hỗ trợ?</p>

                    <a
                        target="_blank"
                        className="text-chart-4 text-xs font-semibold hover:underline"
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                    >
                        Liên hệ với bộ phận kĩ thuật
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AuthContact
