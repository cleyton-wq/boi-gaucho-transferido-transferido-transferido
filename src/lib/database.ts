import { supabase } from './supabase'

// Helper para garantir que user_id seja sempre incluído
const getUserId = async () => {
  const { data: { user } } = await supabase!.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')
  return user.id
}

// ANIMAIS
export const saveAnimal = async (animal: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('animais')
    .insert({
      user_id: userId,
      numero_brinco: animal.numeroBrinco,
      cor_brinco: animal.corBrinco,
      idade: animal.idade,
      sexo: animal.sexo,
      status: animal.status,
      peso: animal.peso,
      peso_compra: animal.pesoCompra,
      valor_compra: animal.valorCompra,
      observacao: animal.observacao
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateAnimal = async (id: string, animal: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('animais')
    .update({
      numero_brinco: animal.numeroBrinco,
      cor_brinco: animal.corBrinco,
      idade: animal.idade,
      sexo: animal.sexo,
      status: animal.status,
      peso: animal.peso,
      peso_compra: animal.pesoCompra,
      valor_compra: animal.valorCompra,
      observacao: animal.observacao,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId) // Garante que só atualiza se for do usuário
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadAnimais = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('animais')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Converte para formato do app
  return data.map((a: any) => ({
    id: a.id,
    numeroBrinco: a.numero_brinco,
    corBrinco: a.cor_brinco,
    idade: a.idade,
    sexo: a.sexo,
    status: a.status,
    peso: a.peso,
    pesoCompra: a.peso_compra,
    valorCompra: a.valor_compra,
    observacao: a.observacao,
    createdAt: a.created_at
  }))
}

// RELATÓRIOS DE PESAGEM
export const saveRelatorioPesagem = async (relatorio: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_pesagem')
    .insert({
      user_id: userId,
      data: relatorio.data,
      total_animais: relatorio.totalAnimais,
      peso_total: relatorio.pesoTotal,
      peso_medio: relatorio.pesoMedio,
      animais: relatorio.animais
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadRelatoriosPesagem = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_pesagem')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((r: any) => ({
    id: r.id,
    data: r.data,
    totalAnimais: r.total_animais,
    pesoTotal: r.peso_total,
    pesoMedio: r.peso_medio,
    animais: r.animais
  }))
}

// RELATÓRIOS DE COMPRA
export const saveRelatorioCompra = async (relatorio: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_compra')
    .insert({
      user_id: userId,
      data: relatorio.data,
      total_animais: relatorio.totalAnimais,
      peso_total: relatorio.pesoTotal,
      peso_medio: relatorio.pesoMedio,
      valor_total: relatorio.valorTotal,
      fornecedor: relatorio.fornecedor,
      observacao: relatorio.observacao,
      animais: relatorio.animais
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadRelatoriosCompra = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_compra')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((r: any) => ({
    id: r.id,
    data: r.data,
    totalAnimais: r.total_animais,
    pesoTotal: r.peso_total,
    pesoMedio: r.peso_medio,
    valorTotal: r.valor_total,
    fornecedor: r.fornecedor,
    observacao: r.observacao,
    animais: r.animais
  }))
}

// RELATÓRIOS DE VENDA
export const saveRelatorioVenda = async (relatorio: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_venda')
    .insert({
      user_id: userId,
      data: relatorio.data,
      total_animais: relatorio.totalAnimais,
      peso_total: relatorio.pesoTotal,
      peso_medio: relatorio.pesoMedio,
      valor_total: relatorio.valorTotal,
      valor_medio: relatorio.valorMedio,
      lucro_total: relatorio.lucroTotal,
      lucro_medio: relatorio.lucroMedio,
      comprador: relatorio.comprador,
      observacao: relatorio.observacao,
      animais: relatorio.animais
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadRelatoriosVenda = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('relatorios_venda')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((r: any) => ({
    id: r.id,
    data: r.data,
    totalAnimais: r.total_animais,
    pesoTotal: r.peso_total,
    pesoMedio: r.peso_medio,
    valorTotal: r.valor_total,
    valorMedio: r.valor_medio,
    lucroTotal: r.lucro_total,
    lucroMedio: r.lucro_medio,
    comprador: r.comprador,
    observacao: r.observacao,
    animais: r.animais
  }))
}

// DESPESAS
export const saveDespesa = async (despesa: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('despesas')
    .insert({
      user_id: userId,
      data: despesa.data,
      tipo: despesa.tipo,
      descricao: despesa.descricao,
      valor: despesa.valor,
      relatorio_id: despesa.relatorioId
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadDespesas = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('despesas')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((d: any) => ({
    id: d.id,
    data: d.data,
    tipo: d.tipo,
    descricao: d.descricao,
    valor: d.valor,
    relatorioId: d.relatorio_id
  }))
}

// RECEITAS
export const saveReceita = async (receita: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('receitas')
    .insert({
      user_id: userId,
      data: receita.data,
      tipo: receita.tipo,
      descricao: receita.descricao,
      valor: receita.valor,
      relatorio_id: receita.relatorioId
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadReceitas = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('receitas')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((r: any) => ({
    id: r.id,
    data: r.data,
    tipo: r.tipo,
    descricao: r.descricao,
    valor: r.valor,
    relatorioId: r.relatorio_id
  }))
}

// VACINAÇÕES
export const saveVacinacao = async (vacinacao: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('vacinacoes')
    .insert({
      user_id: userId,
      animal_id: vacinacao.animalId,
      numero_brinco: vacinacao.numeroBrinco,
      tipo_vacina: vacinacao.tipoVacina,
      data_aplicacao: vacinacao.dataAplicacao,
      data_vencimento: vacinacao.dataVencimento,
      observacao: vacinacao.observacao
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadVacinacoes = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('vacinacoes')
    .select('*')
    .eq('user_id', userId)
    .order('data_aplicacao', { ascending: false })
  
  if (error) throw error
  
  return data.map((v: any) => ({
    id: v.id,
    animalId: v.animal_id,
    numeroBrinco: v.numero_brinco,
    tipoVacina: v.tipo_vacina,
    dataAplicacao: v.data_aplicacao,
    dataVencimento: v.data_vencimento,
    observacao: v.observacao
  }))
}

// TAREFAS
export const saveTarefa = async (tarefa: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('tarefas')
    .insert({
      user_id: userId,
      tipo: tarefa.tipo,
      descricao: tarefa.descricao,
      data: tarefa.data,
      status: tarefa.status,
      observacao: tarefa.observacao
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateTarefa = async (id: string, updates: any) => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('tarefas')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const loadTarefas = async () => {
  const userId = await getUserId()
  const { data, error } = await supabase!
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
  
  if (error) throw error
  
  return data.map((t: any) => ({
    id: t.id,
    tipo: t.tipo,
    descricao: t.descricao,
    data: t.data,
    status: t.status,
    observacao: t.observacao
  }))
}
