import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Verifica se as credenciais estão configuradas
export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''

// Cria cliente apenas se configurado, caso contrário retorna null
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos para o banco de dados
export type Animal = {
  id: string
  user_id: string
  identificador: string
  sexo: 'macho' | 'femea'
  data_nascimento: string
  genetica: string
  foto_url?: string
  created_at: string
}

export type Pesagem = {
  id: string
  user_id: string
  animal_id: string
  peso: number
  data_pesagem: string
  created_at: string
}

export type Transacao = {
  id: string
  user_id: string
  tipo: 'compra' | 'venda'
  animal_id?: string
  quantidade: number
  valor_total: number
  data_transacao: string
  observacoes?: string
  created_at: string
}

export type Vacinacao = {
  id: string
  user_id: string
  animal_id: string
  vacina: string
  data_aplicacao: string
  proxima_dose?: string
  created_at: string
}

export type Lida = {
  id: string
  user_id: string
  titulo: string
  descricao?: string
  data_evento: string
  horario: string
  local?: string
  concluido: boolean
  created_at: string
}
