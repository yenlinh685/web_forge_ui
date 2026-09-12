import { Metadata } from 'next'
import Image from 'next/image'
import { ChartLine, Cloud, Cylinder, LayoutGrid, Mail, ShieldCheck, ShieldCog, Star } from 'lucide-react'

import SectionObserver from '~/components/section-observer/SectionObserver'
import TableOfContents from '~/components/table-of-contents/TableOfContents'
import { Button } from '~/components/ui/button'

export const metadata: Metadata = {
    title: 'Terms and Conditions | H9N',
    description: 'Terms and Conditions | H9N',
}

const TERMS_LINKS = [
    { href: '#information-collection', label: 'Thu thập thông tin' },
    { href: '#usage-information', label: 'Sử dụng thông tin' },
    { href: '#security-of-data', label: 'Bảo mật dữ liệu' },
    { href: '#third-party-services', label: 'Dịch vụ bên thứ ba' },
    { href: '#contact-privacy-team', label: 'Liên hệ Đội ngũ Bảo mật' },
]

const TermsPage = () => {
    return (
        <div className="flex w-full flex-1 pb-10">
            <TableOfContents
                links={TERMS_LINKS}
                className="sticky top-[calc(var(--header-height)+40px)] hidden w-60 flex-col items-end gap-2 self-start md:flex"
            />
            <SectionObserver sectionIds={TERMS_LINKS.map((l) => l.href.slice(1))} />

            <article className="mx-auto mt-10 max-w-360 flex-1 md:px-10 lg:px-40">
                <p className="inline-flex items-center gap-2 rounded-2xl bg-[#6EFAD5] px-3 py-1 text-sm font-medium text-[#00725C]">
                    <ShieldCheck size={18} />
                    Cập nhật lần cuối: 05 tháng 06, 2026
                </p>
                <h2 className="mt-4 text-5xl font-bold">Chính sách Bảo mật</h2>
                <p className="mt-4 text-xl leading-relaxed text-[#45464D]">
                    Tại H9N Learning, chúng tôi tôn trọng quyền riêng tư của bạn hơn tất cả. Chính sách Bảo mật này mô
                    tả cách chúng tôi thu thập, sử dụng và xử lý dữ liệu của bạn khi bạn sử dụng nền tảng giáo dục hiệu
                    suất cao của chúng tôi.
                </p>

                <div className="border-border my-12 border-b"></div>

                <div className="space-y-12 text-[#45464D]">
                    <section id="information-collection" className="scroll-mt-25">
                        <h3 className="flex items-center gap-2 text-2xl font-semibold text-black">
                            <LayoutGrid className="text-chart-4" size={20} />
                            Thu thập thông tin
                        </h3>

                        <p className="mt-6 leading-8 text-[#45464D]">
                            Chúng tôi thu thập thông tin mà bạn cung cấp trực tiếp cho chúng tôi khi bạn tạo tài khoản,
                            tham gia vào bất kỳ tính năng tương tác nào của dịch vụ hoặc liên hệ với chúng tôi. Thông
                            tin này có thể bao gồm:
                        </p>

                        <ul className="mt-6 list-none space-y-3 pl-6">
                            <li>
                                <strong className="text-black">Thông tin Đăng nhập:</strong> Tên, địa chỉ email, mật
                                khẩu và nền tảng chuyên môn.
                            </li>
                            <li>
                                <strong className="text-black">Dữ liệu Giáo dục:</strong> Tiến độ học tập, bài nộp dự
                                án, trạng thái lộ trình và kết quả đánh giá.
                            </li>
                            <li>
                                <strong className="text-black">Dữ liệu Hợp tác:</strong> Tương tác trong các phòng học,
                                bài đăng trên diễn đàn cộng đồng và phản hồi từ bạn học.
                            </li>
                        </ul>
                    </section>

                    <section id="usage-information" className="scroll-mt-25">
                        <h2 className="text-primary flex items-center gap-2 text-2xl font-semibold">
                            <ChartLine className="text-chart-4" size={20} />
                            Sử dụng thông tin
                        </h2>
                        <p className="mt-6">
                            Thông tin chúng tôi thu thập được sử dụng để cung cấp, duy trì và cải thiện hệ sinh thái
                            giáo dục hiệu suất cao của chúng tôi. Cụ thể, chúng tôi sử dụng dữ liệu của bạn để:
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="border-border-subtle rounded-lg border p-5 transition-shadow hover:shadow-sm">
                                <h3 className="mb-2 text-sm font-semibold">Cá nhân hóa</h3>
                                <p className="text-sm">
                                    Cá nhân hóa lộ trình học tập và đề xuất các dự án dựa trên phân tích của bạn.
                                </p>
                            </div>
                            <div className="border-border-subtle rounded-lg border p-5 transition-shadow hover:shadow-sm">
                                <h3 className="mb-2 text-sm font-semibold">Truyền thông</h3>
                                <p className="text-sm">
                                    Gửi các thông báo kỹ thuật, cập nhật, cảnh báo bảo mật và tin nhắn quản trị.
                                </p>
                            </div>
                            <div className="border-border-subtle rounded-lg border p-5 transition-shadow hover:shadow-sm">
                                <h3 className="mb-2 text-sm font-semibold">Theo dõi Hiệu suất</h3>
                                <p className="text-sm">
                                    Tính toán chuỗi học tập, các cột mốc và đóng góp hợp tác trong nền tảng.
                                </p>
                            </div>
                            <div className="border-border-subtle rounded-lg border p-5 transition-shadow hover:shadow-sm">
                                <h3 className="mb-2 text-sm font-semibold">Bảo mật</h3>
                                <p className="text-sm">
                                    Theo dõi và ngăn chặn các giao dịch gian lận và các hoạt động bất hợp pháp khác.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="security-of-data" className="scroll-mt-25">
                        <h2 className="text-primary flex items-center gap-2 text-2xl font-semibold">
                            <ShieldCog className="text-chart-4" size={20} />
                            Bảo mật dữ liệu
                        </h2>

                        <p className="mt-6">
                            Chúng tôi triển khai nhiều biện pháp bảo mật khác nhau để duy trì sự an toàn cho thông tin
                            cá nhân của bạn. Dữ liệu của bạn được lưu trữ trên các máy chủ an toàn và thông tin nhạy cảm
                            được truyền qua công nghệ Lớp cổng bảo mật (SSL/TLS).
                        </p>

                        <div className="mt-4 gap-4 md:flex md:items-center">
                            <Image
                                src="/static/secure_data_infrastructure.png"
                                width={0}
                                height={0}
                                alt="Secure Data Infrastructure"
                                sizes="100vw"
                                className="h-48 w-full rounded-xl object-cover md:w-84.5"
                                loading="eager"
                            />

                            <div className="border-chart-4 mt-6 border-t-4 pt-6 md:border-t-0 md:border-l-4 md:pt-0">
                                <p className="md:ml-6">
                                    {' '}
                                    Các giao thức mã hóa của chúng tôi được kiểm tra thường xuyên bởi các công ty bảo
                                    mật độc lập để đảm bảo H9N Learning vẫn là một pháo đài cho dữ liệu trí tuệ của bạn.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="third-party-services" className="scroll-mt-25">
                        <h2 className="text-primary flex items-center gap-2 text-2xl font-semibold">
                            <Star className="text-chart-4" size={20} />
                            Dịch vụ bên thứ ba
                        </h2>

                        <p className="mt-6">
                            Chúng tôi có thể chia sẻ thông tin của bạn với các nhà cung cấp bên thứ ba và các nhà cung
                            cấp dịch vụ thực hiện các dịch vụ cho chúng tôi, chẳng hạn như lưu trữ web, phân tích dữ
                            liệu, xử lý thanh toán và cơ sở hạ tầng công nghệ thông tin. Các đối tác này bao gồm:
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <div className="flex items-center gap-3 rounded-lg bg-[#F2F4F6] p-4">
                                <Cloud size={18} />
                                <span className="text-sm">Lưu trữ Cloudflare (R2)</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-[#F2F4F6] p-4">
                                <Cylinder size={18} />
                                <span className="text-sm">Firebase</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg bg-[#F2F4F6] p-4">
                                <Mail size={18} />
                                <span className="text-sm">NodeMailer</span>
                            </div>
                        </div>

                        <p className="mt-6">
                            Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin nhận dạng cá nhân của bạn cho các
                            bên bên ngoài vì mục đích tiếp thị mà không có sự đồng ý rõ ràng của bạn.
                        </p>
                    </section>
                    <section
                        id="contact-privacy-team"
                        className="mt-24 flex flex-col items-center justify-between gap-8 rounded-2xl bg-black p-8 text-white md:flex-row"
                    >
                        <div>
                            <h3 className="selection-inverted mb-2 text-2xl font-semibold">
                                Bạn có câu hỏi về quyền riêng tư?
                            </h3>
                            <p className="font-sm selection-inverted text-[#7C839B]">
                                Nhân viên bảo vệ dữ liệu của chúng tôi sẵn sàng hỗ trợ bạn với bất kỳ mối quan tâm nào.
                            </p>
                        </div>
                        <Button className="bg-chart-4 hover:bg-chart-5 py-6">Liên hệ Đội ngũ Bảo mật</Button>
                    </section>
                </div>
            </article>
        </div>
    )
}

export default TermsPage
