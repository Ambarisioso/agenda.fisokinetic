'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="btn"
            style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
            }}
        >
            Salir
        </button>
    )
}
