
import { PrismaClient } from '@prisma/client'
import { startOfDay, endOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
    const today = new Date()
    console.log('Server Date (today):', today.toString())
    console.log('Start of Day:', startOfDay(today).toISOString())
    console.log('End of Day:', endOfDay(today).toISOString())

    const appointments = await prisma.appointment.findMany()
    console.log('All Appointments in DB:', appointments)

    const filtered = await prisma.appointment.findMany({
        where: {
            startTime: {
                gte: startOfDay(today),
                lt: endOfDay(today)
            }
        }
    })
    console.log('Filtered Appointments (Prisma Query):', filtered)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
