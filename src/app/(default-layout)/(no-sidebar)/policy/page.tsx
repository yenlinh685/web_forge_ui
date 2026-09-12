import { ShieldCheck, ShieldEllipsis, UserMinus } from 'lucide-react'

import SectionObserver from '~/components/section-observer/SectionObserver'
import TableOfContents from '~/components/table-of-contents/TableOfContents'
import { Button } from '~/components/ui/button'

const POLICY_LINKS = [
    { href: '#introduction', label: 'Giới thiệu' },
    { href: '#usage-policy', label: 'Sử dụng dịch vụ' },
    { href: '#user-accounts', label: 'Tài khoản người dùng' },
    { href: '#intellectual-property', label: 'Sở hữu trí tuệ' },
    { href: '#account-termination', label: 'Chấm dứt tài khoản' },
]

const PolicyPage = () => {
    return (
        <div className="mt-10 flex w-full flex-1 px-8 pb-10">
            <div>
                <TableOfContents
                    links={POLICY_LINKS}
                    className="sticky top-[calc(var(--header-height)+40px)] hidden w-60 flex-col items-end gap-2 self-start md:flex"
                />
                <SectionObserver sectionIds={POLICY_LINKS.map((link) => link.href.slice(1))} />
            </div>

            <article className="mx-auto max-w-360 flex-1 md:px-10 lg:px-40">
                <p className="text-chart-4 inline-flex items-center gap-2 rounded-2xl bg-[#6EFAD5] px-3 py-1 text-sm font-medium">
                    <ShieldCheck size={18} />
                    Cập nhật lần cuối: 05 tháng 06, 2026
                </p>

                <h1 className="mt-6 text-5xl font-bold">Điều khoản Dịch Vụ</h1>
                <p className="mt-4 text-[#45464D]">
                    Vui lòng đọc kỹ các điều khoản này trước khi sử dụng hệ sinh thái học tập cộng tác của chúng tôi.
                </p>

                <div className="mt-10 space-y-16">
                    <section id="introduction" className="scroll-mt-25">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                            <span className="text-chart-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6EFAD5] text-sm font-bold">
                                01
                            </span>
                            Giới thiệu
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-[#45464D]">
                            <p>
                                Chào mừng bạn đến với H9N Learning (được gọi là &quot;chúng tôi&quot;, hoặc &quot;của
                                chúng tôi&quot;). Các Điều khoản Dịch vụ này (&quot;Điều khoản&quot;) điều chỉnh việc
                                bạn truy cập và sử dụng trang web, ứng dụng di động và nền tảng học tập của chúng tôi.
                            </p>
                            <p>
                                Bằng cách truy cập hoặc sử dụng Dịch vụ của chúng tôi, bạn đồng ý chịu sự ràng buộc của
                                các Điều khoản này và Chính sách Bảo mật của chúng tôi. Nếu bạn không đồng ý với các
                                Điều khoản này, bạn không được truy cập hoặc sử dụng Dịch vụ. Chúng tôi cung cấp một nền
                                tảng được thiết kế cho giáo dục hiệu suất cao và môi trường học tập cộng tác.
                            </p>
                        </div>
                    </section>

                    <section id="usage-policy" className="scroll-mt-25">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                            <span className="text-chart-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6EFAD5] text-sm font-bold">
                                02
                            </span>
                            Sử dụng Dịch vụ
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-[#45464D]">
                            <p>
                                Bạn đồng ý chỉ sử dụng Dịch vụ cho các mục đích hợp pháp và tuân theo các Điều khoản
                                này. Bạn chịu trách nhiệm cho tất cả hoạt động xảy ra dưới tài khoản của mình.
                            </p>
                            <ul className="space-y-3 pl-0">
                                {[
                                    'Bạn phải ít nhất 13 tuổi để sử dụng Dịch vụ. Người dùng dưới 18 tuổi cần có sự đồng ý của phụ huynh.',
                                    'Bạn không được sử dụng Dịch vụ để phát tán thư rác, phần mềm độc hại hoặc bất kỳ nội dung phá hoại nào khác.',
                                    'Việc thiết kế ngược hoặc cố gắng trích xuất mã nguồn của nền tảng của chúng tôi bị nghiêm cấm.',
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4"
                                    >
                                        <ShieldCheck size={20} className="text-chart-4 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section id="user-accounts" className="scroll-mt-25">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                            <span className="text-chart-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6EFAD5] text-sm font-bold">
                                03
                            </span>
                            Tài khoản Người dùng
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-[#45464D]">
                            <p>
                                Để truy cập một số tính năng nhất định, bạn phải đăng ký tài khoản. Bạn cung cấp thông
                                tin chính xác, hiện tại và đầy đủ trong quá trình đăng ký.
                            </p>
                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="hover:border-chartext-chart-4 rounded-xl border border-gray-200 p-6 transition-colors">
                                    <ShieldEllipsis size={24} className="text-chart-4 mb-2" />
                                    <h4 className="mb-2 font-semibold text-gray-900">Bảo mật Tài khoản</h4>
                                    <p className="text-sm text-[#45464D]">
                                        Bạn chịu trách nhiệm duy trì tính bảo mật cho thông tin đăng nhập của mình và
                                        mọi hoạt động diễn ra dưới tài khoản của mình.
                                    </p>
                                </div>
                                <div className="hover:border-chartext-chart-4 rounded-xl border border-gray-200 p-6 transition-colors">
                                    <UserMinus size={24} className="text-chart-4 mb-2" />
                                    <h4 className="mb-2 font-semibold text-gray-900">Chia sẻ Tài khoản</h4>
                                    <p className="text-sm text-[#45464D]">
                                        Tài khoản là cá nhân và không thể chuyển nhượng. Nhiều người dùng chia sẻ một
                                        thông tin đăng nhập duy nhất là vi phạm các điều khoản này.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="intellectual-property" className="scroll-mt-25">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                            <span className="text-chart-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6EFAD5] text-sm font-bold">
                                04
                            </span>
                            Sở hữu Trí tuệ
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-[#45464D]">
                            <p>
                                Dịch vụ và nội dung gốc của chúng (không bao gồm Nội dung của Người dùng), các tính năng
                                và chức năng là và sẽ vẫn là tài sản độc quyền của H9N Learning và các bên cấp phép của
                                nó.
                            </p>
                            <p>
                                Nhãn hiệu và trang trí thương mại của chúng tôi không được sử dụng liên quan đến bất kỳ
                                sản phẩm hoặc dịch vụ nào mà không có sự đồng ý trước bằng văn bản của chúng tôi. Bằng
                                cách tải nội dung lên nền tảng của chúng tôi, bạn cấp cho chúng tôi giấy phép toàn cầu,
                                không độc quyền để lưu trữ và hiển thị nội dung đó như một phần của Dịch vụ.
                            </p>
                        </div>
                    </section>

                    <section id="account-termination" className="scroll-mt-25">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                            <span className="text-chart-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#6EFAD5] text-sm font-bold">
                                05
                            </span>
                            Chấm dứt tài khoản
                        </h2>
                        <div className="space-y-4 text-base leading-relaxed text-[#45464D]">
                            <p>
                                Chúng tôi có thể chấm dứt hoặc đình chỉ tài khoản của bạn và chặn quyền truy cập vào
                                Dịch vụ ngay lập tức, không cần thông báo trước hoặc chịu trách nhiệm pháp lý, theo
                                quyết định riêng của chúng tôi, vì bất kỳ lý do gì và không giới hạn, bao gồm nhưng
                                không giới hạn ở việc vi phạm Điều khoản.
                            </p>
                            <p>
                                Nếu bạn muốn chấm dứt tài khoản của mình, bạn chỉ cần ngừng sử dụng Dịch vụ hoặc sử dụng
                                tính năng &quot;Xóa tài khoản&quot; trong phần cài đặt của mình.
                            </p>
                        </div>
                    </section>

                    <section
                        id="contact-privacy-team"
                        className="mt-24 flex flex-col items-center justify-between gap-8 rounded-2xl bg-black p-8 text-white md:flex-row"
                    >
                        <div>
                            <h3 className="selection-inverted mb-2 text-2xl font-semibold">
                                Bạn có câu hỏi về Điều khoản Bảo mật?
                            </h3>
                            <p className="font-sm selection-inverted text-[#7C839B]">
                                Đội ngũ hỗ trợ của chúng tôi sẵn sàng 24/7 để làm rõ mọi lo ngại về pháp lý.
                            </p>
                        </div>
                        <Button className="bg-chart-4 hover:bg-chart-5 py-6">Liên hệ Hỗ trợ</Button>
                    </section>
                </div>
            </article>
        </div>
    )
}

export default PolicyPage
