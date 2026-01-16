'use client'

import { format, differenceInMinutes, startOfDay, parseISO, getHours, getMinutes, addMinutes, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './CalendarGrid.module.css'
import AppointmentModal from './AppointmentModal'
import { useState } from 'react'

interface Therapist {
    id: number
    name: string
    color: string
    phone: string | null
}

interface Appointment {
    id: number
    startTime: string // ISO String
    endTime: string   // ISO String
    patientName: string
    patientPhone?: string | null
    status: string
    therapistId: number
}

interface CalendarGridProps {
    therapists: Therapist[]
    appointments: Appointment[]
    currentDate: string
}

export default function CalendarGrid({ therapists, appointments, currentDate: currentDateStr }: CalendarGridProps) {
    const currentDate = parseISO(currentDateStr)
    // Modal State
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<{
        therapistId: number,
        therapistName: string,
        date: string,
        time: string,
        // Edit Mode Props
        appointmentId?: number,
        patientName?: string,
        patientPhone?: string,
        duration?: number
    } | null>(null)

    const handleSlotClick = (therapist: Therapist, hour: number, minute: number) => {
        const dateStr = format(currentDate, 'yyyy-MM-dd')
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

        setSelectedSlot({
            therapistId: therapist.id,
            therapistName: therapist.name,
            date: dateStr,
            time: timeStr
        })
        setModalOpen(true)
    }

    const handleAppointmentClick = (e: React.MouseEvent, app: Appointment, therapist: Therapist) => {
        e.stopPropagation()
        const start = parseISO(app.startTime)
        const end = parseISO(app.endTime)
        const duration = differenceInMinutes(end, start)

        setSelectedSlot({
            therapistId: therapist.id,
            therapistName: therapist.name,
            date: format(start, 'yyyy-MM-dd'),
            time: format(start, 'HH:mm'),
            appointmentId: app.id,
            patientName: app.patientName,
            patientPhone: app.patientPhone || '',
            duration: duration
        })
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedSlot(null)
    }

    // Config
    const START_HOUR = 8
    const END_HOUR = 18
    const SLOT_HEIGHT = 60
    const SLOT_DURATION = 30

    // Generate time slots
    const timeSlots: { hour: number; minute: number }[] = []
    for (let h = START_HOUR; h < END_HOUR; h++) {
        timeSlots.push({ hour: h, minute: 0 })
        timeSlots.push({ hour: h, minute: 30 })
    }

    // Calculate position
    const getPosition = (isoDate: string) => {
        const date = parseISO(isoDate)
        const hours = getHours(date)
        const minutes = getMinutes(date)

        if (hours < START_HOUR) return -1

        const totalMinutes = (hours - START_HOUR) * 60 + minutes
        return (totalMinutes / SLOT_DURATION) * SLOT_HEIGHT
    }

    const getHeight = (startIso: string, endIso: string) => {
        const start = parseISO(startIso)
        const end = parseISO(endIso)
        const diff = differenceInMinutes(end, start)
        return (diff / SLOT_DURATION) * SLOT_HEIGHT
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.timeHeader}></div>
                {therapists.map(therapist => (
                    <div key={therapist.id} className={styles.therapistHeader}>
                        <span className={styles.dot} style={{ backgroundColor: therapist.color }}></span>
                        <span style={{ flex: 1 }}>{therapist.name}</span>
                        {therapist.phone && (
                            <a
                                href={`https://wa.me/${therapist.phone.replace(/[^0-9]/g, '')}?text=${(() => {
                                    const apps = appointments
                                        .filter(a => {
                                            const appTime = parseISO(a.startTime)
                                            return isSameDay(appTime, currentDate) && a.therapistId === therapist.id
                                        })
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))

                                    let msg = `Hola ${therapist.name}, tu agenda para hoy ${format(currentDate, 'dd/MM/yyyy')}:\n`
                                    if (apps.length === 0) msg += 'No tienes citas.'
                                    else apps.forEach(app => {
                                        msg += `${format(parseISO(app.startTime), 'HH:mm')} - ${app.patientName}\n`
                                    })
                                    return encodeURIComponent(msg)
                                })()}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontSize: '1.2rem', textDecoration: 'none' }}
                                title="Enviar Agenda por WhatsApp"
                                onClick={(e) => e.stopPropagation()}
                            >
                                📱
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className={styles.body}>
                {/* Time Labels */}
                <div className={styles.timeColumn}>
                    {timeSlots.map((slot, i) => (
                        <div key={i} className={styles.timeSlot}>
                            {`${slot.hour.toString().padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`}
                        </div>
                    ))}
                </div>

                {/* Columns per Therapist */}
                {therapists.map(therapist => {
                    const therapistApps = appointments.filter(a => a.therapistId === therapist.id)

                    return (
                        <div key={therapist.id} className={styles.column}>
                            {/* Render Background Slots */}
                            {timeSlots.map((slot, i) => (
                                <div
                                    key={`bg-${i}`}
                                    className={styles.slot}
                                    onClick={() => handleSlotClick(therapist, slot.hour, slot.minute)}
                                    style={{ cursor: 'pointer' }}
                                    title="Click para agendar"
                                ></div>
                            ))}

                            {/* Render Appointments */}
                            {therapistApps.map(app => {
                                const top = getPosition(app.startTime)
                                const height = getHeight(app.startTime, app.endTime)

                                if (top < 0) return null // Out of bounds

                                return (
                                    <div
                                        key={app.id}
                                        className={styles.appointment}
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            backgroundColor: therapist.color,
                                            cursor: 'pointer' // Make it look clickable
                                        }}
                                        title={`${app.patientName} (Click para editar)`}
                                        onClick={(e) => handleAppointmentClick(e, app, therapist)}
                                    >
                                        <span className={styles.patientName}>{app.patientName}</span>
                                        <span className={styles.timeRange}>
                                            {format(parseISO(app.startTime), 'HH:mm')} - {format(parseISO(app.endTime), 'HH:mm')}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>


            {
                modalOpen && selectedSlot && (
                    <AppointmentModal
                        isOpen={modalOpen}
                        onClose={handleClose}
                        therapistId={selectedSlot.therapistId}
                        therapistName={selectedSlot.therapistName}
                        initialDate={selectedSlot.date}
                        initialTime={selectedSlot.time}
                        // Edit Props
                        appointmentId={selectedSlot.appointmentId}
                        initialPatientName={selectedSlot.patientName}
                        initialPatientPhone={selectedSlot.patientPhone}
                        initialDuration={selectedSlot.duration}
                    />
                )
            }
        </div >
    )
}

