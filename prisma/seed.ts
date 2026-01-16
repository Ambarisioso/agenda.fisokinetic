import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Therapists
    const therapist1 = await prisma.therapist.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Fisioterapeuta A (Ejemplo)',
            color: '#3b82f6', // Blue
            phone: '555-123-4567'
        },
    })

    const therapist2 = await prisma.therapist.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Fisioterapeuta B (Ejemplo)',
            color: '#10b981', // Emerald
            phone: '555-987-6543'
        },
    })

    // Create dummy patient
    const patient = await prisma.patient.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Juan Perez',
            phone: '555-000-0000',
        },
    })

    // Create dummy appointments for tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)

    const end = new Date(tomorrow)
    end.setHours(11, 0, 0, 0)

    await prisma.appointment.createMany({
        data: [
            {
                startTime: tomorrow,
                endTime: end,
                patientId: patient.id,
                therapistId: therapist1.id,
                status: 'SCHEDULED'
            }
        ]
    })

    console.log({ therapist1, therapist2, patient })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
