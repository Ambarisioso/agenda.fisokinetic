'use client'

import { deleteTherapist } from '@/app/actions'
import { useFormStatus } from 'react-dom'

export default function DeleteTherapistButton({ id }: { id: number }) {
    const { pending } = useFormStatus()

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (window.confirm('¿Estás seguro de que quieres eliminar a este terapeuta? Esta acción no se puede deshacer.')) {
            // We can call the server action directly since we are preventing default
            await deleteTherapist(id)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={pending}
            style={{
                color: 'var(--danger)',
                background: 'none',
                border: 'none',
                fontSize: '0.85rem',
                cursor: 'pointer',
                opacity: pending ? 0.5 : 1
            }}
        >
            {pending ? 'Eliminando...' : 'Eliminar'}
        </button>
    )
}
