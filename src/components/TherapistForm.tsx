'use client'

import { createTherapist } from '@/app/actions'
import { useRef } from 'react'

export default function TherapistForm() {
    const ref = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={ref}
            action={async (formData) => {
                await createTherapist(formData)
                ref.current?.reset()
            }}
            className="card"
            style={{ maxWidth: '400px', marginBottom: '2rem' }}
        >
            <h3 style={{ marginBottom: '1rem' }}>Nuevo Terapeuta</h3>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre</label>
                <input
                    type="text"
                    name="name"
                    required
                    className="input"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teléfono</label>
                <input
                    type="tel"
                    name="phone"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Color</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'].map(c => (
                        <label key={c} style={{ cursor: 'pointer' }}>
                            <input type="radio" name="color" value={c} defaultChecked={c === '#3b82f6'} style={{ display: 'none' }} />
                            <div
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: c,
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 0 0 1px var(--border)'
                                }}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
            </div>
        </form>
    )
}
