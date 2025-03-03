export interface Patient {
  id: number
  created_at: string
  name: string
  email: string
  phone?: string
  address?: string
  // Add any other fields that exist in your patients table
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at'> 