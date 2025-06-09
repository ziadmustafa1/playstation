import './globals.css'

export const metadata = {
  title: 'إدارة محل البلايستيشن',
  description: 'نظام شامل لإدارة محل البلايستيشن',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
