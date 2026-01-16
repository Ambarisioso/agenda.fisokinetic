'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/actions'
import Image from 'next/image'

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8fafc'
        }}>
            <div className="card" style={{ width: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.svg" alt="Fisiokinetic" width={200} height={80} style={{ objectFit: 'contain' }} />
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Iniciar Sesión</h2>

                <form action={dispatch}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Usuario</label>
                        <input
                            type="text"
                            name="username"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            required
                        />
                    </div>
                    <LoginButton />
                    <div style={{ height: '1.5rem', marginTop: '1rem' }}>
                        {errorMessage && (
                            <p style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{errorMessage}</p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <button aria-disabled={pending} type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {pending ? 'Verificando...' : 'Entrar'}
        </button>
    )
}
