import { prisma } from '@/lib/prisma'
import CalendarGrid from '@/components/CalendarGrid'
import { startOfDay, endOfDay, parseISO, format, addDays, subDays, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { Appointment, Therapist, Patient } from '@prisma/client'
import Link from 'next/link'
import DateSelector from '@/components/DateSelector'

export const dynamic = 'force-dynamic'

async function getTherapists() {
  return await prisma.therapist.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })
}

async function getAppointments(date: Date) {
  return await prisma.appointment.findMany({
    where: {
      startTime: {
        gte: startOfDay(date),
        lt: endOfDay(date)
      }
    },
    include: {
      patient: true
    }
  })
}

// Define props for page component to catch searchParams
interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams
  const dateParam = params?.date

  let currentDate = new Date()
  if (dateParam) {
    const parsed = parseISO(dateParam)
    if (isValid(parsed)) {
      currentDate = parsed
    }
  }

  const prevDay = format(subDays(currentDate, 1), 'yyyy-MM-dd')
  const nextDay = format(addDays(currentDate, 1), 'yyyy-MM-dd')

  const therapists = await getTherapists()
  const appointments = await getAppointments(currentDate)

  // Serialize for Client Component
  const serializedApps = appointments.map((app: Appointment & { patient: Patient }) => ({
    id: app.id,
    startTime: app.startTime.toISOString(),
    endTime: app.endTime.toISOString(),
    patientName: app.patient?.name || 'Desconocido',
    status: app.status,
    therapistId: app.therapistId
  }))

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Agenda del Día
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <DateSelector currentDate={currentDate.toISOString()} />
        </div>
      </div>

      {therapists.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No hay terapeutas registrados.</p>
          <a href="/therapists" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Agregar Terapeuta
          </a>
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate.toISOString()}
          therapists={therapists}
          appointments={serializedApps}
        />
      )}
    </div>
  )
}
