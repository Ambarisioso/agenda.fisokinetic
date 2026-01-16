'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, subDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface DateSelectorProps {
    currentDate: string // ISO string
}

export default function DateSelector({ currentDate }: DateSelectorProps) {
    const router = useRouter()

    // We treat currentDate as a plain date string "YYYY-MM-DD" to avoid timezone issues
    // parseISO defaults to local time if no TZ info, but here we just want to do date math
    // simpler: append T00:00:00 to force local calculation or use addDays on the parsed date
    // Best way: use string manipulation or ensure parseISO treats it as midnight local

    const displayDate = parseISO(currentDate)

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        if (newDate) {
            router.push(`/?date=${newDate}`)
        }
    }

    const handlePrev = () => {
        const prev = format(subDays(displayDate, 1), 'yyyy-MM-dd')
        router.push(`/?date=${prev}`)
    }

    const handleNext = () => {
        const next = format(addDays(displayDate, 1), 'yyyy-MM-dd')
        router.push(`/?date=${next}`)
    }

    const dateInputRef = React.useRef<HTMLInputElement>(null)

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handlePrev} className="btn btn-secondary">
                &larr;
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Visible Date Label with Icon */}
                <label
                    htmlFor="date-picker"
                    style={{
                        cursor: 'pointer',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '200px',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid transparent',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                    onClick={(e) => {
                        e.preventDefault()
                        const input = dateInputRef.current
                        if (input) {
                            try {
                                if (typeof (input as any).showPicker === 'function') {
                                    (input as any).showPicker()
                                } else {
                                    input.click()
                                }
                            } catch (err) {
                                // Fallback
                                input.click()
                            }
                        }
                    }}
                >
                    <span>{format(displayDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}</span>
                    <span style={{ fontSize: '1.2rem' }}>📅</span>
                </label>

                {/* Hidden but functional date input */}
                <input
                    ref={dateInputRef}
                    id="date-picker"
                    type="date"
                    value={currentDate}
                    onChange={handleDateChange}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1px',
                        height: '1px',
                        opacity: 0,
                        padding: 0,
                        margin: -1,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        border: 0,
                        pointerEvents: 'none'
                    }}
                />
            </div>

            <button onClick={handleNext} className="btn btn-secondary">
                &rarr;
            </button>
        </div>
    )
}
