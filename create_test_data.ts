
import { prisma } from './src/lib/prisma'

async function main() {
    // Create a therapist if not exists
    let therapist = await prisma.therapist.findFirst()
    if (!therapist) {
        therapist = await prisma.therapist.create({
            data: { name: 'Test Therapist', phone: '1234567890' }
        })
    }

    // Create a patient
    const patient = await prisma.patient.create({
        data: { name: 'Test Patient', phone: '0987654321' }
    })

    const today = new Date()
    today.setHours(10, 0, 0, 0) // 10:00 AM Today Local

    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1) // Next Month

    // Create appointment for Today
    await prisma.appointment.create({
        data: {
            startTime: today,
            endTime: new Date(today.getTime() + 60 * 60 * 1000),
            therapistId: therapist.id,
            patientId: patient.id
        }
    })

    // Create appointment for Next Month (should NOT show up)
    await prisma.appointment.create({
        data: {
            startTime: nextMonth,
            endTime: new Date(nextMonth.getTime() + 60 * 60 * 1000),
            therapistId: therapist.id,
            patientId: patient.id
        }
    })

    console.log('Test appointments created: Today & Next Month')
}

main()
