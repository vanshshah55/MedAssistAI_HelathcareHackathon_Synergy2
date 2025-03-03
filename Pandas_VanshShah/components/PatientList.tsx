'use client'

import { useEffect, useState } from 'react'
import { Patient } from '@/types/database.types'
import { getAllPatients } from '@/utils/patients'

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getAllPatients()
        setPatients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patients')
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <div className="grid gap-4">
        {patients.map((patient) => (
          <div key={patient.id} className="border p-4 rounded-lg shadow">
            <h2 className="font-semibold">{patient.name}</h2>
            <p>{patient.email}</p>
            {patient.phone && <p>{patient.phone}</p>}
            {patient.address && <p>{patient.address}</p>}
          </div>
        ))}
      </div>
    </div>
  )
} 