import { supabase } from '@/lib/supabase'
import { Patient, PatientInsert } from '@/types/database.types'

export async function getAllPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function getPatientById(id: number): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function createPatient(patient: PatientInsert): Promise<Patient> {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updatePatient(id: number, updates: Partial<PatientInsert>): Promise<Patient> {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deletePatient(id: number): Promise<void> {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
} 