import { prisma } from '@/lib/prisma'
import TherapistForm from '@/components/TherapistForm'
import { deleteTherapist } from '@/app/actions'
import { Therapist } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function TherapistsPage() {
    const therapists = await prisma.therapist.findMany({
        where: { active: true },
        orderBy: { name: 'asc' }
    })

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Gestión de Terapeutas</h1>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <TherapistForm />
                </div>

                <div style={{ flex: 2, minWidth: '300px' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Terapeutas Activos ({therapists.length})</h3>

                        {therapists.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>No hay terapeutas registrados.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {therapists.map((t: Therapist) => (
                                    <div key={t.id} style={{
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: t.color }}></div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{t.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.phone || 'Sin teléfono'}</div>
                                            </div>
                                        </div>

                                        <form action={deleteTherapist.bind(null, t.id)}>
                                            <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', fontSize: '0.85rem' }}>
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
