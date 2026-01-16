'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTherapist(formData: FormData) {
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const color = formData.get('color') as string || '#3b82f6'

    if (!name) return { error: 'El nombre es obligatorio' }

    await prisma.therapist.create({
        data: {
            name,
            phone,
            color,
            active: true
        }
    })

    revalidatePath('/therapists')
    revalidatePath('/')
}

export async function deleteTherapist(id: number) {
    await prisma.therapist.update({
        where: { id },
        data: { active: false }
    })
    revalidatePath('/therapists')
    revalidatePath('/')
}

export async function createAppointment(formData: FormData) {
    const therapistId = parseInt(formData.get('therapistId') as string)
    const patientName = formData.get('patientName') as string
    const patientPhone = formData.get('patientPhone') as string
    const date = formData.get('date') as string // YYYY-MM-DD
    const time = formData.get('time') as string // HH:mm
    const duration = parseInt(formData.get('duration') as string) || 60 // minutes

    if (!patientName || !date || !time || !therapistId) {
        return { error: 'Faltan datos obligatorios' }
    }

    // Calculate start and end
    const startTime = new Date(`${date}T${time}:00`)
    const endTime = new Date(startTime.getTime() + duration * 60000)

    // Find or Create Patient
    let patient = await prisma.patient.findFirst({
        where: { name: patientName }
    })

    if (!patient) {
        patient = await prisma.patient.create({
            data: {
                name: patientName,
                phone: patientPhone
            }
        })
    } else if (patientPhone && patient.phone !== patientPhone) {
        // Update phone if provided and different? Maybe safe to just keep existing.
        // Let's update it for now.
        await prisma.patient.update({
            where: { id: patient.id },
            data: { phone: patientPhone }
        })
    }

    await prisma.appointment.create({
        data: {
            startTime,
            endTime,
            therapistId,
            patientId: patient.id,
            status: 'SCHEDULED'
        }
    })

    revalidatePath('/')
    revalidatePath('/')
    return { success: true }
}

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales Inválidas.'
                default:
                    return 'Algo salió mal.'
            }
        }
        throw error
    }
}
