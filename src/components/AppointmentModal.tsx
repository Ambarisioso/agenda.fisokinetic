'use client'

import React, { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createAppointment, updateAppointment, cancelAppointment } from '@/app/actions'
import styles from './CalendarGrid.module.css'

interface AppointmentModalProps {
    isOpen: boolean
    onClose: () => void
    therapistId: number
    therapistName: string
    initialDate: string // YYYY-MM-DD
    initialTime: string // HH:mm
    // Optional props for Editing
    appointmentId?: number
    initialPatientName?: string
    initialPatientPhone?: string
    initialDuration?: number
}

export default function AppointmentModal({
    isOpen,
    onClose,
    therapistId,
    therapistName,
    initialDate,
    initialTime,
    appointmentId,
    initialPatientName,
    initialPatientPhone,
    initialDuration = 60
}: AppointmentModalProps) {
    const ref = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    const isEditing = !!appointmentId

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isOpen || !mounted) return null

    const handleDelete = async () => {
        if (!appointmentId) return
        if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            setLoading(true)
            await cancelAppointment(appointmentId)
            setLoading(false)
            onClose()
        }
    }

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    {isEditing ? 'Editar Cita' : 'Nueva Cita'}
                </h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    {isEditing ? 'Modificando cita con' : 'Agendando con'} <strong>{therapistName}</strong>
                </p>

                <form
                    ref={ref}
                    action={async (formData) => {
                        setLoading(true)
                        if (isEditing) {
                            await updateAppointment(formData)
                        } else {
                            await createAppointment(formData)
                        }
                        setLoading(false)
                        onClose()
                    }}
                >
                    <input type="hidden" name="therapistId" value={therapistId} />
                    {isEditing && <input type="hidden" name="appointmentId" value={appointmentId} />}

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem' }}>Fecha</label>
                            <input type="date" name="date" defaultValue={initialDate} required style={{ width: '100%', padding: '0.5rem' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem' }}>Hora</label>
                            <input type="time" name="time" defaultValue={initialTime} required style={{ width: '100%', padding: '0.5rem' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem' }}>Duración (min)</label>
                        <select name="duration" defaultValue={initialDuration} style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                            <option value="120">2 horas</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem' }}>Nombre Paciente</label>
                        <input
                            type="text"
                            name="patientName"
                            defaultValue={initialPatientName}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem' }}>Teléfono (Opcional)</label>
                        <input
                            type="tel"
                            name="patientPhone"
                            defaultValue={initialPatientPhone}
                            style={{ width: '100%', padding: '0.5rem' }}
                            placeholder="555-..."
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        {isEditing ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn"
                                style={{ backgroundColor: 'var(--danger)', color: 'white', border: 'none' }}
                                disabled={loading}
                            >
                                Cancelar Cita
                            </button>
                        ) : (
                            <div></div> // Spacer
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>Cerrar</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Agendar')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}
