import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
import LogoutButton from '../components/LogoutButton'
import { auth } from '../auth'

const notoSans = Noto_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata: Metadata = {
    title: 'Fisiokinetic - Agenda Interna',
    description: 'Gestión de citas y terapeutas',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <html lang="es">
            <body className={notoSans.className}>
                {session && (
                    <nav style={{
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: '#fff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }}>
                        <div className="container" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem'
                        }}>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                                <div style={{ position: 'relative', width: '150px' }}>
                                    <FisiokineticLogo style={{ width: '100%', height: 'auto' }} />
                                </div>
                            </Link>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <Link href="/" className="btn btn-secondary" style={{ border: 'none', background: 'transparent', color: '#111827', fontWeight: '600' }}>Agenda</Link>
                                <Link href="/therapists" className="btn btn-secondary" style={{ border: 'none', background: 'transparent', color: '#111827', fontWeight: '600' }}>Terapeutas</Link>
                                <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
                                <LogoutButton />
                            </div>
                        </div>
                    </nav>
                )}
                <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                    {children}
                </main>
            </body>
        </html>
    )
}
