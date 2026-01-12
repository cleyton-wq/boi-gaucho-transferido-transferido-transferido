"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Users, LogOut, AlertCircle, Edit, Trash2, X, Scale, TrendingUp, ShoppingCart, DollarSign, Syringe, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Animal {
  id: string
  numeroBrinco: string
  corBrinco: string
  idade: string
  sexo: string
  status: string
  peso: string
  observacao: string
  createdAt: string
  valorCompra?: number
  pesoCompra?: string
}

interface PesagemAnimal {
  id: string
  numeroBrinco: string
  peso: number
  pesoAnterior?: number
  diasEntrePesagens?: number
  gmd?: number
  isNovoCadastro: boolean
}

interface RelatorioPesagem {
  id: string
  data: string
  animais: PesagemAnimal[]
  pesoTotal: number
  pesoMedio: number
  totalAnimais: number
}

interface AnimalCompra {
  id: string
  numeroBrinco: string
  corBrinco: string
  idade: string
  sexo: string
  peso: string
  valorPorKg: number
  valorTotal: number
}

interface RelatorioCompra {
  id: string
  data: string
  animais: AnimalCompra[]
  totalAnimais: number
  pesoTotal: number
  pesoMedio: number
  valorTotal: number
  fornecedor: string
  observacao: string
}

interface AnimalVenda {
  id: string
  numeroBrinco: string
  pesoVenda: number
  valorPorKg: number
  valorTotal: number
  valorCompra: number
  lucro: number
  pesoCompra: number
  ganhoPeso: number
  diasPropriedade: number
  gmd: number
}

interface RelatorioVenda {
  id: string
  data: string
  animais: AnimalVenda[]
  totalAnimais: number
  pesoTotal: number
  pesoMedio: number
  valorTotal: number
  valorMedio: number
  lucroTotal: number
  lucroMedio: number
  comprador: string
  observacao: string
}

interface Despesa {
  id: string
  data: string
  tipo: string
  descricao: string
  valor: number
  relatorioId?: string
}

interface Receita {
  id: string
  data: string
  tipo: string
  descricao: string
  valor: number
  relatorioId?: string
}

interface Vacinacao {
  id: string
  animalId: string
  numeroBrinco: string
  tipoVacina: string
  dataAplicacao: string
  dataVencimento?: string
  observacao: string
}

interface Tarefa {
  id: string
  tipo: string
  descricao: string
  data: string
  status: 'pendente' | 'concluida'
  observacao: string
}

interface UserData {
  id: string
  email: string
  nome: string
  fazenda: string
}

export default function BoiGaucho() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [animais, setAnimais] = useState<Animal[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  
  // Pesagem states
  const [pesagemDialogOpen, setPesagemDialogOpen] = useState(false)
  const [pesagemAtual, setPesagemAtual] = useState<PesagemAnimal[]>([])
  const [relatorios, setRelatorios] = useState<RelatorioPesagem[]>([])
  const [relatorioDialogOpen, setRelatorioDialogOpen] = useState(false)
  const [relatorioAtual, setRelatorioAtual] = useState<RelatorioPesagem | null>(null)
  
  // Compra states
  const [compraDialogOpen, setCompraDialogOpen] = useState(false)
  const [compraAtual, setCompraAtual] = useState<AnimalCompra[]>([])
  const [relatoriosCompra, setRelatoriosCompra] = useState<RelatorioCompra[]>([])
  const [relatorioCompraDialogOpen, setRelatorioCompraDialogOpen] = useState(false)
  const [relatorioCompraAtual, setRelatorioCompraAtual] = useState<RelatorioCompra | null>(null)
  const [despesas, setDespesas] = useState<Despesa[]>([])
  
  // Venda states
  const [vendaDialogOpen, setVendaDialogOpen] = useState(false)
  const [vendaAtual, setVendaAtual] = useState<AnimalVenda[]>([])
  const [relatoriosVenda, setRelatoriosVenda] = useState<RelatorioVenda[]>([])
  const [relatorioVendaDialogOpen, setRelatorioVendaDialogOpen] = useState(false)
  const [relatorioVendaAtual, setRelatorioVendaAtual] = useState<RelatorioVenda | null>(null)
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [searchVenda, setSearchVenda] = useState("")
  
  // Vacinação states
  const [vacinacaoDialogOpen, setVacinacaoDialogOpen] = useState(false)
  const [vacinacoes, setVacinacoes] = useState<Vacinacao[]>([])
  
  // Lida/Tarefas states
  const [tarefaDialogOpen, setTarefaDialogOpen] = useState(false)
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    numeroBrinco: "",
    corBrinco: "",
    idade: "",
    sexo: "",
    status: "",
    peso: "",
    observacao: ""
  })

  // Pesagem form state
  const [pesagemForm, setPesagemForm] = useState({
    tipo: "cadastrado",
    animalId: "",
    numeroBrinco: "",
    peso: ""
  })

  // Compra form state
  const [compraForm, setCompraForm] = useState({
    numeroBrinco: "",
    corBrinco: "",
    idade: "",
    sexo: "",
    peso: "",
    valorPorKg: ""
  })

  const [compraInfoForm, setCompraInfoForm] = useState({
    fornecedor: "",
    observacao: ""
  })

  // Venda form state
  const [vendaForm, setVendaForm] = useState({
    animalId: "",
    pesoVenda: "",
    valorPorKg: ""
  })

  const [vendaInfoForm, setVendaInfoForm] = useState({
    comprador: "",
    observacao: ""
  })

  // Vacinação form state
  const [vacinacaoForm, setVacinacaoForm] = useState({
    animalId: "",
    tipoVacina: "",
    dataAplicacao: "",
    dataVencimento: "",
    observacao: ""
  })

  // Tarefa form state
  const [tarefaForm, setTarefaForm] = useState({
    tipo: "",
    descricao: "",
    data: "",
    observacao: ""
  })

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user_data')
      
      if (!userData) {
        router.push('/login')
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        loadAnimais(parsedUser.id)
        loadRelatorios(parsedUser.id)
        loadRelatoriosCompra(parsedUser.id)
        loadRelatoriosVenda(parsedUser.id)
        loadDespesas(parsedUser.id)
        loadReceitas(parsedUser.id)
        loadVacinacoes(parsedUser.id)
        loadTarefas(parsedUser.id)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const loadAnimais = (userId: string) => {
    const stored = localStorage.getItem(`animais_${userId}`)
    if (stored) {
      setAnimais(JSON.parse(stored))
    }
  }

  const loadRelatorios = (userId: string) => {
    const stored = localStorage.getItem(`relatorios_${userId}`)
    if (stored) {
      setRelatorios(JSON.parse(stored))
    }
  }

  const loadRelatoriosCompra = (userId: string) => {
    const stored = localStorage.getItem(`relatorios_compra_${userId}`)
    if (stored) {
      setRelatoriosCompra(JSON.parse(stored))
    }
  }

  const loadRelatoriosVenda = (userId: string) => {
    const stored = localStorage.getItem(`relatorios_venda_${userId}`)
    if (stored) {
      setRelatoriosVenda(JSON.parse(stored))
    }
  }

  const loadDespesas = (userId: string) => {
    const stored = localStorage.getItem(`despesas_${userId}`)
    if (stored) {
      setDespesas(JSON.parse(stored))
    }
  }

  const loadReceitas = (userId: string) => {
    const stored = localStorage.getItem(`receitas_${userId}`)
    if (stored) {
      setReceitas(JSON.parse(stored))
    }
  }

  const loadVacinacoes = (userId: string) => {
    const stored = localStorage.getItem(`vacinacoes_${userId}`)
    if (stored) {
      setVacinacoes(JSON.parse(stored))
    }
  }

  const loadTarefas = (userId: string) => {
    const stored = localStorage.getItem(`tarefas_${userId}`)
    if (stored) {
      setTarefas(JSON.parse(stored))
    }
  }

  const saveAnimais = (newAnimais: Animal[]) => {
    if (user) {
      localStorage.setItem(`animais_${user.id}`, JSON.stringify(newAnimais))
      setAnimais(newAnimais)
    }
  }

  const saveRelatorios = (newRelatorios: RelatorioPesagem[]) => {
    if (user) {
      localStorage.setItem(`relatorios_${user.id}`, JSON.stringify(newRelatorios))
      setRelatorios(newRelatorios)
    }
  }

  const saveRelatoriosCompra = (newRelatorios: RelatorioCompra[]) => {
    if (user) {
      localStorage.setItem(`relatorios_compra_${user.id}`, JSON.stringify(newRelatorios))
      setRelatoriosCompra(newRelatorios)
    }
  }

  const saveRelatoriosVenda = (newRelatorios: RelatorioVenda[]) => {
    if (user) {
      localStorage.setItem(`relatorios_venda_${user.id}`, JSON.stringify(newRelatorios))
      setRelatoriosVenda(newRelatorios)
    }
  }

  const saveDespesas = (newDespesas: Despesa[]) => {
    if (user) {
      localStorage.setItem(`despesas_${user.id}`, JSON.stringify(newDespesas))
      setDespesas(newDespesas)
    }
  }

  const saveReceitas = (newReceitas: Receita[]) => {
    if (user) {
      localStorage.setItem(`receitas_${user.id}`, JSON.stringify(newReceitas))
      setReceitas(newReceitas)
    }
  }

  const saveVacinacoes = (newVacinacoes: Vacinacao[]) => {
    if (user) {
      localStorage.setItem(`vacinacoes_${user.id}`, JSON.stringify(newVacinacoes))
      setVacinacoes(newVacinacoes)
    }
  }

  const saveTarefas = (newTarefas: Tarefa[]) => {
    if (user) {
      localStorage.setItem(`tarefas_${user.id}`, JSON.stringify(newTarefas))
      setTarefas(newTarefas)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingAnimal) {
      const updated = animais.map(a => 
        a.id === editingAnimal.id 
          ? { ...a, ...formData }
          : a
      )
      saveAnimais(updated)
    } else {
      const newAnimal: Animal = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      }
      saveAnimais([...animais, newAnimal])
    }
    
    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal)
    setFormData({
      numeroBrinco: animal.numeroBrinco,
      corBrinco: animal.corBrinco,
      idade: animal.idade,
      sexo: animal.sexo,
      status: animal.status,
      peso: animal.peso,
      observacao: animal.observacao
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const filtered = animais.filter(a => a.id !== id)
    saveAnimais(filtered)
  }

  const resetForm = () => {
    setFormData({
      numeroBrinco: "",
      corBrinco: "",
      idade: "",
      sexo: "",
      status: "",
      peso: "",
      observacao: ""
    })
    setEditingAnimal(null)
  }

  const resetPesagemForm = () => {
    setPesagemForm({
      tipo: "cadastrado",
      animalId: "",
      numeroBrinco: "",
      peso: ""
    })
  }

  const resetCompraForm = () => {
    setCompraForm({
      numeroBrinco: "",
      corBrinco: "",
      idade: "",
      sexo: "",
      peso: "",
      valorPorKg: ""
    })
  }

  const resetVendaForm = () => {
    setVendaForm({
      animalId: "",
      pesoVenda: "",
      valorPorKg: ""
    })
  }

  const resetVacinacaoForm = () => {
    setVacinacaoForm({
      animalId: "",
      tipoVacina: "",
      dataAplicacao: "",
      dataVencimento: "",
      observacao: ""
    })
  }

  const resetTarefaForm = () => {
    setTarefaForm({
      tipo: "",
      descricao: "",
      data: "",
      observacao: ""
    })
  }

  const adicionarAnimalPesagem = () => {
    if (!pesagemForm.peso) {
      alert('Por favor, informe o peso do animal')
      return
    }

    let pesagemAnimal: PesagemAnimal

    if (pesagemForm.tipo === "cadastrado") {
      const animal = animais.find(a => a.id === pesagemForm.animalId)
      if (!animal) {
        alert('Selecione um animal cadastrado')
        return
      }

      if (pesagemAtual.find(p => p.numeroBrinco === animal.numeroBrinco)) {
        alert('Este animal já foi adicionado nesta pesagem')
        return
      }

      const ultimaPesagem = relatorios
        .flatMap(r => r.animais)
        .filter(a => a.numeroBrinco === animal.numeroBrinco)
        .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())[0]

      const pesoAtual = parseFloat(pesagemForm.peso)
      let gmd: number | undefined
      let diasEntrePesagens: number | undefined

      if (ultimaPesagem && ultimaPesagem.peso) {
        const ultimoRelatorio = relatorios.find(r => 
          r.animais.some(a => a.numeroBrinco === animal.numeroBrinco)
        )
        if (ultimoRelatorio) {
          const dataUltima = new Date(ultimoRelatorio.data)
          const dataAtual = new Date()
          diasEntrePesagens = Math.floor((dataAtual.getTime() - dataUltima.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diasEntrePesagens > 0) {
            const ganhoPeso = pesoAtual - ultimaPesagem.peso
            gmd = ganhoPeso / diasEntrePesagens
          }
        }
      }

      pesagemAnimal = {
        id: Date.now().toString(),
        numeroBrinco: animal.numeroBrinco,
        peso: pesoAtual,
        pesoAnterior: ultimaPesagem?.peso,
        diasEntrePesagens,
        gmd,
        isNovoCadastro: false
      }

      const updatedAnimais = animais.map(a => 
        a.id === animal.id ? { ...a, peso: pesagemForm.peso } : a
      )
      saveAnimais(updatedAnimais)

    } else {
      if (!pesagemForm.numeroBrinco) {
        alert('Por favor, informe o número do brinco')
        return
      }

      if (pesagemAtual.find(p => p.numeroBrinco === pesagemForm.numeroBrinco)) {
        alert('Este número de brinco já foi adicionado nesta pesagem')
        return
      }

      pesagemAnimal = {
        id: Date.now().toString(),
        numeroBrinco: pesagemForm.numeroBrinco,
        peso: parseFloat(pesagemForm.peso),
        isNovoCadastro: true
      }
    }

    setPesagemAtual([...pesagemAtual, pesagemAnimal])
    resetPesagemForm()
  }

  const removerAnimalPesagem = (id: string) => {
    setPesagemAtual(pesagemAtual.filter(p => p.id !== id))
  }

  const finalizarPesagem = () => {
    if (pesagemAtual.length === 0) {
      alert('Adicione pelo menos um animal para finalizar a pesagem')
      return
    }

    const pesoTotal = pesagemAtual.reduce((sum, p) => sum + p.peso, 0)
    const pesoMedio = pesoTotal / pesagemAtual.length

    const relatorio: RelatorioPesagem = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      animais: pesagemAtual,
      pesoTotal,
      pesoMedio,
      totalAnimais: pesagemAtual.length
    }

    const novosRelatorios = [relatorio, ...relatorios]
    saveRelatorios(novosRelatorios)
    
    setRelatorioAtual(relatorio)
    setRelatorioDialogOpen(true)
    setPesagemAtual([])
    setPesagemDialogOpen(false)
  }

  const adicionarAnimalCompra = () => {
    if (!compraForm.numeroBrinco || !compraForm.corBrinco || !compraForm.idade || 
        !compraForm.sexo || !compraForm.peso || !compraForm.valorPorKg) {
      alert('Por favor, preencha todos os campos do animal')
      return
    }

    if (compraAtual.find(a => a.numeroBrinco === compraForm.numeroBrinco)) {
      alert('Este número de brinco já foi adicionado nesta compra')
      return
    }

    const peso = parseFloat(compraForm.peso)
    const valorPorKg = parseFloat(compraForm.valorPorKg)
    const valorTotal = peso * valorPorKg

    const animalCompra: AnimalCompra = {
      id: Date.now().toString(),
      numeroBrinco: compraForm.numeroBrinco,
      corBrinco: compraForm.corBrinco,
      idade: compraForm.idade,
      sexo: compraForm.sexo,
      peso: compraForm.peso,
      valorPorKg: valorPorKg,
      valorTotal: valorTotal
    }

    setCompraAtual([...compraAtual, animalCompra])
    resetCompraForm()
  }

  const removerAnimalCompra = (id: string) => {
    setCompraAtual(compraAtual.filter(a => a.id !== id))
  }

  const finalizarCompra = () => {
    if (compraAtual.length === 0) {
      alert('Adicione pelo menos um animal para finalizar a compra')
      return
    }

    if (!compraInfoForm.fornecedor) {
      alert('Por favor, informe o fornecedor')
      return
    }

    const pesoTotal = compraAtual.reduce((sum, a) => sum + parseFloat(a.peso), 0)
    const pesoMedio = pesoTotal / compraAtual.length
    const valorTotal = compraAtual.reduce((sum, a) => sum + a.valorTotal, 0)

    const relatorioCompra: RelatorioCompra = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      animais: compraAtual,
      totalAnimais: compraAtual.length,
      pesoTotal,
      pesoMedio,
      valorTotal,
      fornecedor: compraInfoForm.fornecedor,
      observacao: compraInfoForm.observacao
    }

    const novosRelatoriosCompra = [relatorioCompra, ...relatoriosCompra]
    saveRelatoriosCompra(novosRelatoriosCompra)

    const novosAnimais = compraAtual.map(a => ({
      id: Date.now().toString() + Math.random(),
      numeroBrinco: a.numeroBrinco,
      corBrinco: a.corBrinco,
      idade: a.idade,
      sexo: a.sexo,
      status: "ativo",
      peso: a.peso,
      pesoCompra: a.peso,
      valorCompra: a.valorTotal,
      observacao: `Comprado de ${compraInfoForm.fornecedor} - R$ ${a.valorPorKg.toFixed(2)}/kg`,
      createdAt: new Date().toISOString()
    }))
    saveAnimais([...animais, ...novosAnimais])

    const despesa: Despesa = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "Compra de Animais",
      descricao: `Compra de ${compraAtual.length} animais - ${compraInfoForm.fornecedor}`,
      valor: valorTotal,
      relatorioId: relatorioCompra.id
    }
    saveDespesas([despesa, ...despesas])

    setRelatorioCompraAtual(relatorioCompra)
    setRelatorioCompraDialogOpen(true)
    
    setCompraAtual([])
    setCompraInfoForm({ fornecedor: "", observacao: "" })
    setCompraDialogOpen(false)
  }

  const adicionarAnimalVenda = () => {
    if (!vendaForm.animalId || !vendaForm.pesoVenda || !vendaForm.valorPorKg) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const animal = animais.find(a => a.id === vendaForm.animalId)
    if (!animal) {
      alert('Animal não encontrado')
      return
    }

    if (vendaAtual.find(v => v.numeroBrinco === animal.numeroBrinco)) {
      alert('Este animal já foi adicionado nesta venda')
      return
    }

    const pesoVenda = parseFloat(vendaForm.pesoVenda)
    const valorPorKg = parseFloat(vendaForm.valorPorKg)
    const valorTotal = pesoVenda * valorPorKg
    const valorCompra = animal.valorCompra || 0
    const lucro = valorTotal - valorCompra
    const pesoCompra = parseFloat(animal.pesoCompra || animal.peso)
    const ganhoPeso = pesoVenda - pesoCompra

    const dataCompra = new Date(animal.createdAt)
    const dataVenda = new Date()
    const diasPropriedade = Math.floor((dataVenda.getTime() - dataCompra.getTime()) / (1000 * 60 * 60 * 24))
    const gmd = diasPropriedade > 0 ? ganhoPeso / diasPropriedade : 0

    const animalVenda: AnimalVenda = {
      id: Date.now().toString(),
      numeroBrinco: animal.numeroBrinco,
      pesoVenda,
      valorPorKg,
      valorTotal,
      valorCompra,
      lucro,
      pesoCompra,
      ganhoPeso,
      diasPropriedade,
      gmd
    }

    setVendaAtual([...vendaAtual, animalVenda])
    resetVendaForm()
  }

  const removerAnimalVenda = (id: string) => {
    setVendaAtual(vendaAtual.filter(v => v.id !== id))
  }

  const finalizarVenda = () => {
    if (vendaAtual.length === 0) {
      alert('Adicione pelo menos um animal para finalizar a venda')
      return
    }

    if (!vendaInfoForm.comprador) {
      alert('Por favor, informe o comprador')
      return
    }

    const pesoTotal = vendaAtual.reduce((sum, v) => sum + v.pesoVenda, 0)
    const pesoMedio = pesoTotal / vendaAtual.length
    const valorTotal = vendaAtual.reduce((sum, v) => sum + v.valorTotal, 0)
    const valorMedio = valorTotal / vendaAtual.length
    const lucroTotal = vendaAtual.reduce((sum, v) => sum + v.lucro, 0)
    const lucroMedio = lucroTotal / vendaAtual.length

    const relatorioVenda: RelatorioVenda = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      animais: vendaAtual,
      totalAnimais: vendaAtual.length,
      pesoTotal,
      pesoMedio,
      valorTotal,
      valorMedio,
      lucroTotal,
      lucroMedio,
      comprador: vendaInfoForm.comprador,
      observacao: vendaInfoForm.observacao
    }

    const novosRelatoriosVenda = [relatorioVenda, ...relatoriosVenda]
    saveRelatoriosVenda(novosRelatoriosVenda)

    const animaisAtualizados = animais.map(a => {
      const vendido = vendaAtual.find(v => v.numeroBrinco === a.numeroBrinco)
      if (vendido) {
        return { ...a, status: "vendido" }
      }
      return a
    })
    saveAnimais(animaisAtualizados)

    const receita: Receita = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      tipo: "Venda de Animais",
      descricao: `Venda de ${vendaAtual.length} animais - ${vendaInfoForm.comprador}`,
      valor: valorTotal,
      relatorioId: relatorioVenda.id
    }
    saveReceitas([receita, ...receitas])

    setRelatorioVendaAtual(relatorioVenda)
    setRelatorioVendaDialogOpen(true)
    
    setVendaAtual([])
    setVendaInfoForm({ comprador: "", observacao: "" })
    setSearchVenda("")
    setVendaDialogOpen(false)
  }

  const registrarVacinacao = () => {
    if (!vacinacaoForm.animalId || !vacinacaoForm.tipoVacina || !vacinacaoForm.dataAplicacao) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    const animal = animais.find(a => a.id === vacinacaoForm.animalId)
    if (!animal) {
      alert('Animal não encontrado')
      return
    }

    const novaVacinacao: Vacinacao = {
      id: Date.now().toString(),
      animalId: vacinacaoForm.animalId,
      numeroBrinco: animal.numeroBrinco,
      tipoVacina: vacinacaoForm.tipoVacina,
      dataAplicacao: vacinacaoForm.dataAplicacao,
      dataVencimento: vacinacaoForm.dataVencimento || undefined,
      observacao: vacinacaoForm.observacao
    }

    saveVacinacoes([novaVacinacao, ...vacinacoes])
    resetVacinacaoForm()
    setVacinacaoDialogOpen(false)
    alert('Vacinação registrada com sucesso!')
  }

  const registrarTarefa = () => {
    if (!tarefaForm.tipo || !tarefaForm.descricao || !tarefaForm.data) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      tipo: tarefaForm.tipo,
      descricao: tarefaForm.descricao,
      data: tarefaForm.data,
      status: 'pendente',
      observacao: tarefaForm.observacao
    }

    saveTarefas([novaTarefa, ...tarefas])
    resetTarefaForm()
    setTarefaDialogOpen(false)
    alert('Tarefa registrada com sucesso!')
  }

  const toggleTarefaStatus = (id: string) => {
    const tarefasAtualizadas = tarefas.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'pendente' ? 'concluida' as const : 'pendente' as const }
        : t
    )
    saveTarefas(tarefasAtualizadas)
  }

  const deletarTarefa = (id: string) => {
    const tarefasFiltradas = tarefas.filter(t => t.id !== id)
    saveTarefas(tarefasFiltradas)
  }

  const handleLogout = () => {
    localStorage.removeItem('user_data')
    router.push('/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-500"
      case "vendido": return "bg-blue-500"
      case "doente": return "bg-red-500"
      case "tratamento": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const verificarVacinasVencendo = () => {
    const hoje = new Date()
    const diasAlerta = 30
    
    return vacinacoes.filter(v => {
      if (!v.dataVencimento) return false
      const dataVenc = new Date(v.dataVencimento)
      const diffDias = Math.floor((dataVenc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      return diffDias >= 0 && diffDias <= diasAlerta
    })
  }

  const abrirRelatorioVenda = (relatorio: RelatorioVenda) => {
    setRelatorioVendaAtual(relatorio)
    setRelatorioVendaDialogOpen(true)
  }

  const vacinasVencendo = verificarVacinasVencendo()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#CD853F] flex items-center justify-center">
        <div className="text-[#F5DEB3] text-xl">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const nomeProdutor = user.nome || user.email.split('@')[0]
  const nomeFazenda = user.fazenda || 'Fazenda'

  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0)
  const totalReceitas = receitas.reduce((sum, r) => sum + (r.valor || 0), 0)
  const saldoFinanceiro = totalReceitas - totalDespesas

  const animaisAtivos = animais.filter(a => a.status === 'ativo')
  
  const animaisAtivosFiltrados = animaisAtivos.filter(a => 
    a.numeroBrinco.toLowerCase().includes(searchVenda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#CD853F]">
      {/* Header */}
      <header className="bg-[#654321] border-b-4 border-[#D2691E] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/8327af33-c841-4554-9961-68b93dcd16a0.jpg" 
                alt="Logo Boi Gaúcho" 
                className="h-12 w-12 object-cover rounded-full border-2 border-[#D2691E]"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#F5DEB3]">Boi Gaúcho</h1>
                <p className="text-sm text-[#DEB887]">{nomeFazenda}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-[#F5DEB3] font-semibold">{nomeProdutor}</p>
                <p className="text-xs text-[#DEB887]">{user.email}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="bg-[#8B4513] hover:bg-[#A0522D] text-[#F5DEB3] border-2 border-[#D2691E]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Alertas de Vacinação */}
      {vacinasVencendo.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-yellow-50 border-2 border-yellow-500">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-2">
                    ⚠️ Atenção: {vacinasVencendo.length} vacina(s) vencendo em breve!
                  </h3>
                  <div className="space-y-1">
                    {vacinasVencendo.map(v => {
                      const diasRestantes = Math.floor((new Date(v.dataVencimento!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      return (
                        <p key={v.id} className="text-sm text-yellow-700">
                          • Brinco {v.numeroBrinco} - {v.tipoVacina} - Vence em {diasRestantes} dia(s)
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-[#654321] p-2 rounded-lg border-2 border-[#D2691E] w-full">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm">Painel</span>
            </TabsTrigger>
            <TabsTrigger 
              value="animais" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="text-lg">🐂</span>
              <span className="text-sm">Animais</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pesagem" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Scale className="h-4 w-4" />
              <span className="text-sm">Pesagem</span>
            </TabsTrigger>
            <TabsTrigger 
              value="compravenda" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Compra/Venda</span>
            </TabsTrigger>
            <TabsTrigger 
              value="vacinacao" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Syringe className="h-4 w-4" />
              <span className="text-sm">Vacinação</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lida" 
              className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3] text-[#DEB887] flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Lida</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-[#F5DEB3]">
                Bem-vindo, {nomeProdutor}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[#654321]">Total de Reses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#8B4513]">{animais.length}</div>
                  <p className="text-xs text-[#A0522D] mt-1">
                    {animais.length === 0 ? 'Cadastre seus animais' : 'Animais cadastrados'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[#654321]">Animais Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#228B22]">
                    {animais.filter(a => a.status === 'ativo').length}
                  </div>
                  <p className="text-xs text-[#A0522D] mt-1 flex items-center">
                    <span className="text-lg mr-1">🐂</span>
                    No rebanho
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[#654321]">Em Tratamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FFA500]">
                    {animais.filter(a => a.status === 'tratamento' || a.status === 'doente').length}
                  </div>
                  <p className="text-xs text-[#A0522D] mt-1">Requer atenção</p>
                </CardContent>
              </Card>

              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-[#654321]">Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#4169E1]">
                    {animais.filter(a => a.status === 'vendido').length}
                  </div>
                  <p className="text-xs text-[#A0522D] mt-1">Transações realizadas</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-[#654321]">Últimos Cadastros</CardTitle>
                  <CardDescription className="text-[#A0522D]">Animais recém-adicionados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {animais.length === 0 ? (
                    <div className="text-center py-8 text-[#A0522D]">
                      Nenhum animal cadastrado ainda
                    </div>
                  ) : (
                    animais.slice(-3).reverse().map(animal => (
                      <div key={animal.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#D2691E]">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(animal.status)}`} />
                          <div>
                            <p className="font-medium text-[#654321]">Brinco {animal.numeroBrinco}</p>
                            <p className="text-sm text-[#A0522D]">{animal.sexo} - {animal.idade}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(animal.status)} text-white`}>
                          {animal.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-[#654321]">Primeiros Passos</CardTitle>
                  <CardDescription className="text-[#A0522D]">Configure seu sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#D2691E]">
                    <span className="text-2xl">🐂</span>
                    <div>
                      <p className="font-medium text-[#654321]">Cadastre seus animais</p>
                      <p className="text-sm text-[#A0522D]">Comece registrando seu rebanho</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#D2691E]">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <p className="font-medium text-[#654321]">Registre pesagens</p>
                      <p className="text-sm text-[#A0522D]">Acompanhe o ganho de peso</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#D2691E]">
                    <span className="text-2xl">💉</span>
                    <div>
                      <p className="font-medium text-[#654321]">Configure vacinas</p>
                      <p className="text-sm text-[#A0522D]">Mantenha o calendário em dia</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Animais Tab */}
          <TabsContent value="animais" className="space-y-6">
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-2xl font-bold text-[#F5DEB3]">Gestão de Animais</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Animal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F5DEB3] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[#654321]">
                      {editingAnimal ? 'Editar Animal' : 'Cadastrar Novo Animal'}
                    </DialogTitle>
                    <DialogDescription className="text-[#A0522D]">
                      Preencha os dados do animal
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numeroBrinco" className="text-[#654321]">Número do Brinco *</Label>
                        <Input
                          id="numeroBrinco"
                          value={formData.numeroBrinco}
                          onChange={(e) => setFormData({...formData, numeroBrinco: e.target.value})}
                          required
                          className="bg-white border-[#D2691E]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="corBrinco" className="text-[#654321]">Cor do Brinco *</Label>
                        <Select 
                          value={formData.corBrinco} 
                          onValueChange={(value) => setFormData({...formData, corBrinco: value})}
                        >
                          <SelectTrigger className="bg-white border-[#D2691E]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amarelo">Amarelo</SelectItem>
                            <SelectItem value="azul">Azul</SelectItem>
                            <SelectItem value="verde">Verde</SelectItem>
                            <SelectItem value="vermelho">Vermelho</SelectItem>
                            <SelectItem value="branco">Branco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="idade" className="text-[#654321]">Idade *</Label>
                        <Input
                          id="idade"
                          value={formData.idade}
                          onChange={(e) => setFormData({...formData, idade: e.target.value})}
                          placeholder="Ex: 2 anos"
                          required
                          className="bg-white border-[#D2691E]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sexo" className="text-[#654321]">Sexo *</Label>
                        <Select 
                          value={formData.sexo} 
                          onValueChange={(value) => setFormData({...formData, sexo: value})}
                        >
                          <SelectTrigger className="bg-white border-[#D2691E]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Macho">Macho</SelectItem>
                            <SelectItem value="Fêmea">Fêmea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status" className="text-[#654321]">Status *</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value) => setFormData({...formData, status: value})}
                        >
                          <SelectTrigger className="bg-white border-[#D2691E]">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="vendido">Vendido</SelectItem>
                            <SelectItem value="doente">Doente</SelectItem>
                            <SelectItem value="tratamento">Em Tratamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="peso" className="text-[#654321]">Peso (kg) *</Label>
                        <Input
                          id="peso"
                          type="number"
                          value={formData.peso}
                          onChange={(e) => setFormData({...formData, peso: e.target.value})}
                          required
                          className="bg-white border-[#D2691E]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="observacao" className="text-[#654321]">Observações</Label>
                      <Textarea
                        id="observacao"
                        value={formData.observacao}
                        onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                        className="bg-white border-[#D2691E]"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setDialogOpen(false)
                          resetForm()
                        }}
                        className="border-[#D2691E] text-[#654321]"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                        {editingAnimal ? 'Atualizar' : 'Cadastrar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animais.length === 0 ? (
                <Card className="col-span-full bg-[#F5DEB3] border-2 border-[#8B4513]">
                  <CardContent className="pt-6 text-center">
                    <p className="text-[#A0522D] mb-4">Nenhum animal cadastrado ainda</p>
                    <Button 
                      onClick={() => setDialogOpen(true)}
                      className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Primeiro Animal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                animais.map(animal => (
                  <Card key={animal.id} className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full ${getStatusColor(animal.status)}`} />
                          <CardTitle className="text-lg text-[#654321]">
                            Brinco {animal.numeroBrinco}
                          </CardTitle>
                        </div>
                        <Badge className={`${getStatusColor(animal.status)} text-white`}>
                          {animal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-[#A0522D]">Cor do Brinco:</p>
                          <p className="font-semibold text-[#654321]">{animal.corBrinco}</p>
                        </div>
                        <div>
                          <p className="text-[#A0522D]">Idade:</p>
                          <p className="font-semibold text-[#654321]">{animal.idade}</p>
                        </div>
                        <div>
                          <p className="text-[#A0522D]">Sexo:</p>
                          <p className="font-semibold text-[#654321]">{animal.sexo}</p>
                        </div>
                        <div>
                          <p className="text-[#A0522D]">Peso:</p>
                          <p className="font-semibold text-[#654321]">{animal.peso} kg</p>
                        </div>
                      </div>
                      {animal.observacao && (
                        <div className="pt-2 border-t border-[#D2691E]">
                          <p className="text-xs text-[#A0522D]">{animal.observacao}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(animal)}
                          className="flex-1 border-[#D2691E] text-[#654321] hover:bg-[#DEB887]"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(animal.id)}
                          className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Pesagem Tab */}
          <TabsContent value="pesagem" className="space-y-6">
            <div className="flex justify-between items-center mt-8">
              <h2 className="text-2xl font-bold text-[#F5DEB3]">Controle de Pesagem</h2>
              <Dialog open={pesagemDialogOpen} onOpenChange={setPesagemDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                    <Scale className="h-4 w-4 mr-2" />
                    Nova Pesagem
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F5DEB3] max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#654321]">Registrar Pesagem</DialogTitle>
                    <DialogDescription className="text-[#A0522D]">
                      Adicione os animais e seus pesos
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Card className="bg-white border-2 border-[#D2691E]">
                      <CardContent className="pt-4 space-y-4">
                        <div>
                          <Label className="text-[#654321]">Tipo de Registro</Label>
                          <Select 
                            value={pesagemForm.tipo} 
                            onValueChange={(value) => setPesagemForm({...pesagemForm, tipo: value, animalId: "", numeroBrinco: ""})}
                          >
                            <SelectTrigger className="bg-white border-[#D2691E]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cadastrado">Animal Já Cadastrado</SelectItem>
                              <SelectItem value="novo">Novo Animal (Apenas Pesagem)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {pesagemForm.tipo === "cadastrado" ? (
                          <div>
                            <Label className="text-[#654321]">Selecione o Animal</Label>
                            <Select 
                              value={pesagemForm.animalId} 
                              onValueChange={(value) => setPesagemForm({...pesagemForm, animalId: value})}
                            >
                              <SelectTrigger className="bg-white border-[#D2691E]">
                                <SelectValue placeholder="Escolha um animal" />
                              </SelectTrigger>
                              <SelectContent>
                                {animais.map(animal => (
                                  <SelectItem key={animal.id} value={animal.id}>
                                    Brinco {animal.numeroBrinco} - {animal.sexo} - {animal.idade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div>
                            <Label className="text-[#654321]">Número do Brinco</Label>
                            <Input
                              value={pesagemForm.numeroBrinco}
                              onChange={(e) => setPesagemForm({...pesagemForm, numeroBrinco: e.target.value})}
                              placeholder="Digite o número do brinco"
                              className="bg-white border-[#D2691E]"
                            />
                          </div>
                        )}

                        <div>
                          <Label className="text-[#654321]">Peso (kg)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={pesagemForm.peso}
                            onChange={(e) => setPesagemForm({...pesagemForm, peso: e.target.value})}
                            placeholder="Digite o peso"
                            className="bg-white border-[#D2691E]"
                          />
                        </div>

                        <Button 
                          onClick={adicionarAnimalPesagem}
                          className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar à Pesagem
                        </Button>
                      </CardContent>
                    </Card>

                    {pesagemAtual.length > 0 && (
                      <Card className="bg-white border-2 border-[#D2691E]">
                        <CardHeader>
                          <CardTitle className="text-[#654321]">Animais Adicionados ({pesagemAtual.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {pesagemAtual.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-[#F5DEB3] rounded-lg">
                              <div className="flex-1">
                                <p className="font-semibold text-[#654321]">Brinco {p.numeroBrinco}</p>
                                <div className="flex gap-4 text-sm text-[#A0522D]">
                                  <span>Peso: {p.peso} kg</span>
                                  {p.pesoAnterior && (
                                    <>
                                      <span>Anterior: {p.pesoAnterior} kg</span>
                                      {p.gmd && <span className="text-green-600 font-semibold">GMD: {p.gmd.toFixed(3)} kg/dia</span>}
                                    </>
                                  )}
                                  {p.isNovoCadastro && <Badge className="bg-blue-500">Novo</Badge>}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removerAnimalPesagem(p.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}

                          <div className="pt-4 border-t border-[#D2691E]">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                <p className="text-sm text-[#A0522D]">Peso Total</p>
                                <p className="text-2xl font-bold text-[#654321]">
                                  {pesagemAtual.reduce((sum, p) => sum + p.peso, 0).toFixed(1)} kg
                                </p>
                              </div>
                              <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                <p className="text-sm text-[#A0522D]">Peso Médio</p>
                                <p className="text-2xl font-bold text-[#654321]">
                                  {(pesagemAtual.reduce((sum, p) => sum + p.peso, 0) / pesagemAtual.length).toFixed(1)} kg
                                </p>
                              </div>
                            </div>
                            <Button 
                              onClick={finalizarPesagem}
                              className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                            >
                              Finalizar Pesagem
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {relatorios.length === 0 ? (
                <Card className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                  <CardContent className="pt-6 text-center">
                    <p className="text-[#A0522D] mb-4">Nenhuma pesagem registrada ainda</p>
                    <Button 
                      onClick={() => setPesagemDialogOpen(true)}
                      className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      Registrar Primeira Pesagem
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                relatorios.map(relatorio => (
                  <Card key={relatorio.id} className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#654321]">
                            Pesagem - {new Date(relatorio.data).toLocaleDateString('pt-BR')}
                          </CardTitle>
                          <CardDescription className="text-[#A0522D]">
                            {relatorio.totalAnimais} animais pesados
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#A0522D]">Peso Total</p>
                          <p className="text-2xl font-bold text-[#654321]">{relatorio.pesoTotal.toFixed(1)} kg</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {relatorio.animais.map(animal => (
                          <div key={animal.id} className="p-3 bg-white rounded-lg border border-[#D2691E]">
                            <p className="font-semibold text-[#654321]">Brinco {animal.numeroBrinco}</p>
                            <p className="text-sm text-[#A0522D]">Peso: {animal.peso} kg</p>
                            {animal.pesoAnterior && (
                              <p className="text-sm text-[#A0522D]">Anterior: {animal.pesoAnterior} kg</p>
                            )}
                            {animal.gmd && (
                              <p className="text-sm font-semibold text-green-600">
                                GMD: {animal.gmd.toFixed(3)} kg/dia ({animal.diasEntrePesagens} dias)
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Compra/Venda Tab */}
          <TabsContent value="compravenda" className="space-y-6">
            <Tabs defaultValue="compra" className="space-y-4">
              <TabsList className="grid grid-cols-2 bg-[#654321]">
                <TabsTrigger value="compra" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3]">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Compra
                </TabsTrigger>
                <TabsTrigger value="venda" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-[#F5DEB3]">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Venda
                </TabsTrigger>
              </TabsList>

              {/* Compra */}
              <TabsContent value="compra" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#F5DEB3]">Registro de Compras</h3>
                  <Dialog open={compraDialogOpen} onOpenChange={setCompraDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Compra
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#F5DEB3] max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-[#654321]">Registrar Compra de Animais</DialogTitle>
                        <DialogDescription className="text-[#A0522D]">
                          Adicione os animais comprados
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <Card className="bg-white border-2 border-[#D2691E]">
                          <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#654321]">Número do Brinco</Label>
                                <Input
                                  value={compraForm.numeroBrinco}
                                  onChange={(e) => setCompraForm({...compraForm, numeroBrinco: e.target.value})}
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                              <div>
                                <Label className="text-[#654321]">Cor do Brinco</Label>
                                <Select 
                                  value={compraForm.corBrinco} 
                                  onValueChange={(value) => setCompraForm({...compraForm, corBrinco: value})}
                                >
                                  <SelectTrigger className="bg-white border-[#D2691E]">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="amarelo">Amarelo</SelectItem>
                                    <SelectItem value="azul">Azul</SelectItem>
                                    <SelectItem value="verde">Verde</SelectItem>
                                    <SelectItem value="vermelho">Vermelho</SelectItem>
                                    <SelectItem value="branco">Branco</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#654321]">Idade</Label>
                                <Input
                                  value={compraForm.idade}
                                  onChange={(e) => setCompraForm({...compraForm, idade: e.target.value})}
                                  placeholder="Ex: 2 anos"
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                              <div>
                                <Label className="text-[#654321]">Sexo</Label>
                                <Select 
                                  value={compraForm.sexo} 
                                  onValueChange={(value) => setCompraForm({...compraForm, sexo: value})}
                                >
                                  <SelectTrigger className="bg-white border-[#D2691E]">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Macho">Macho</SelectItem>
                                    <SelectItem value="Fêmea">Fêmea</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#654321]">Peso (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={compraForm.peso}
                                  onChange={(e) => setCompraForm({...compraForm, peso: e.target.value})}
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                              <div>
                                <Label className="text-[#654321]">Valor por Kg (R$)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={compraForm.valorPorKg}
                                  onChange={(e) => setCompraForm({...compraForm, valorPorKg: e.target.value})}
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                            </div>

                            {compraForm.peso && compraForm.valorPorKg && (
                              <div className="p-3 bg-[#F5DEB3] rounded-lg">
                                <p className="text-sm text-[#A0522D]">Valor Total do Animal</p>
                                <p className="text-2xl font-bold text-[#654321]">
                                  R$ {(parseFloat(compraForm.peso) * parseFloat(compraForm.valorPorKg)).toFixed(2)}
                                </p>
                              </div>
                            )}

                            <Button 
                              onClick={adicionarAnimalCompra}
                              className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Animal
                            </Button>
                          </CardContent>
                        </Card>

                        {compraAtual.length > 0 && (
                          <Card className="bg-white border-2 border-[#D2691E]">
                            <CardHeader>
                              <CardTitle className="text-[#654321]">Animais Adicionados ({compraAtual.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                {compraAtual.map(a => (
                                  <div key={a.id} className="flex items-center justify-between p-3 bg-[#F5DEB3] rounded-lg">
                                    <div>
                                      <p className="font-semibold text-[#654321]">Brinco {a.numeroBrinco}</p>
                                      <p className="text-sm text-[#A0522D]">
                                        {a.peso} kg × R$ {a.valorPorKg.toFixed(2)}/kg = R$ {a.valorTotal.toFixed(2)}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removerAnimalCompra(a.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-3 pt-4 border-t border-[#D2691E]">
                                <div>
                                  <Label className="text-[#654321]">Fornecedor *</Label>
                                  <Input
                                    value={compraInfoForm.fornecedor}
                                    onChange={(e) => setCompraInfoForm({...compraInfoForm, fornecedor: e.target.value})}
                                    placeholder="Nome do fornecedor"
                                    className="bg-white border-[#D2691E]"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[#654321]">Observações</Label>
                                  <Textarea
                                    value={compraInfoForm.observacao}
                                    onChange={(e) => setCompraInfoForm({...compraInfoForm, observacao: e.target.value})}
                                    className="bg-white border-[#D2691E]"
                                    rows={2}
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Total Animais</p>
                                    <p className="text-2xl font-bold text-[#654321]">{compraAtual.length}</p>
                                  </div>
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Peso Total</p>
                                    <p className="text-2xl font-bold text-[#654321]">
                                      {compraAtual.reduce((sum, a) => sum + parseFloat(a.peso), 0).toFixed(1)} kg
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Valor Total</p>
                                    <p className="text-2xl font-bold text-[#654321]">
                                      R$ {compraAtual.reduce((sum, a) => sum + a.valorTotal, 0).toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                <Button 
                                  onClick={finalizarCompra}
                                  className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                                >
                                  Finalizar Compra
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {relatoriosCompra.length === 0 ? (
                    <Card className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                      <CardContent className="pt-6 text-center">
                        <p className="text-[#A0522D] mb-4">Nenhuma compra registrada ainda</p>
                        <Button 
                          onClick={() => setCompraDialogOpen(true)}
                          className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Registrar Primeira Compra
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    relatoriosCompra.map(relatorio => (
                      <Card key={relatorio.id} className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-[#654321]">
                                Compra - {new Date(relatorio.data).toLocaleDateString('pt-BR')}
                              </CardTitle>
                              <CardDescription className="text-[#A0522D]">
                                Fornecedor: {relatorio.fornecedor}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-[#A0522D]">Valor Total</p>
                              <p className="text-2xl font-bold text-[#654321]">R$ {relatorio.valorTotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-sm text-[#A0522D]">Animais</p>
                              <p className="text-xl font-bold text-[#654321]">{relatorio.totalAnimais}</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-sm text-[#A0522D]">Peso Total</p>
                              <p className="text-xl font-bold text-[#654321]">{relatorio.pesoTotal.toFixed(1)} kg</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-sm text-[#A0522D]">Peso Médio</p>
                              <p className="text-xl font-bold text-[#654321]">{relatorio.pesoMedio.toFixed(1)} kg</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-sm text-[#A0522D]">Valor Médio</p>
                              <p className="text-xl font-bold text-[#654321]">
                                R$ {(relatorio.valorTotal / relatorio.totalAnimais).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          {relatorio.observacao && (
                            <p className="text-sm text-[#A0522D] italic">Obs: {relatorio.observacao}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Venda */}
              <TabsContent value="venda" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#F5DEB3]">Registro de Vendas</h3>
                  <Dialog open={vendaDialogOpen} onOpenChange={setVendaDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Nova Venda
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#F5DEB3] max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-[#654321]">Registrar Venda de Animais</DialogTitle>
                        <DialogDescription className="text-[#A0522D]">
                          Selecione os animais vendidos
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <Card className="bg-white border-2 border-[#D2691E]">
                          <CardContent className="pt-4 space-y-4">
                            <div>
                              <Label className="text-[#654321]">Buscar Animal</Label>
                              <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-[#A0522D]" />
                                <Input
                                  value={searchVenda}
                                  onChange={(e) => setSearchVenda(e.target.value)}
                                  placeholder="Digite o número do brinco"
                                  className="pl-10 bg-white border-[#D2691E]"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-[#654321]">Selecione o Animal</Label>
                              <Select 
                                value={vendaForm.animalId} 
                                onValueChange={(value) => setVendaForm({...vendaForm, animalId: value})}
                              >
                                <SelectTrigger className="bg-white border-[#D2691E]">
                                  <SelectValue placeholder="Escolha um animal ativo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {animaisAtivosFiltrados.map(animal => (
                                    <SelectItem key={animal.id} value={animal.id}>
                                      Brinco {animal.numeroBrinco} - {animal.sexo} - {animal.peso} kg
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-[#654321]">Peso de Venda (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={vendaForm.pesoVenda}
                                  onChange={(e) => setVendaForm({...vendaForm, pesoVenda: e.target.value})}
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                              <div>
                                <Label className="text-[#654321]">Valor por Kg (R$)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={vendaForm.valorPorKg}
                                  onChange={(e) => setVendaForm({...vendaForm, valorPorKg: e.target.value})}
                                  className="bg-white border-[#D2691E]"
                                />
                              </div>
                            </div>

                            {vendaForm.pesoVenda && vendaForm.valorPorKg && (
                              <div className="p-3 bg-[#F5DEB3] rounded-lg">
                                <p className="text-sm text-[#A0522D]">Valor Total da Venda</p>
                                <p className="text-2xl font-bold text-[#654321]">
                                  R$ {(parseFloat(vendaForm.pesoVenda) * parseFloat(vendaForm.valorPorKg)).toFixed(2)}
                                </p>
                              </div>
                            )}

                            <Button 
                              onClick={adicionarAnimalVenda}
                              className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar à Venda
                            </Button>
                          </CardContent>
                        </Card>

                        {vendaAtual.length > 0 && (
                          <Card className="bg-white border-2 border-[#D2691E]">
                            <CardHeader>
                              <CardTitle className="text-[#654321]">Animais Adicionados ({vendaAtual.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                {vendaAtual.map(v => (
                                  <div key={v.id} className="p-3 bg-[#F5DEB3] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="font-semibold text-[#654321]">Brinco {v.numeroBrinco}</p>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removerAnimalVenda(v.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-[#A0522D]">
                                      <div>Peso Venda: {v.pesoVenda} kg</div>
                                      <div>Valor: R$ {v.valorTotal.toFixed(2)}</div>
                                      <div>Ganho Peso: {v.ganhoPeso.toFixed(1)} kg</div>
                                      <div>GMD: {v.gmd.toFixed(3)} kg/dia</div>
                                      <div className={v.lucro >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                        Lucro: R$ {v.lucro.toFixed(2)}
                                      </div>
                                      <div>Dias: {v.diasPropriedade}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="space-y-3 pt-4 border-t border-[#D2691E]">
                                <div>
                                  <Label className="text-[#654321]">Comprador *</Label>
                                  <Input
                                    value={vendaInfoForm.comprador}
                                    onChange={(e) => setVendaInfoForm({...vendaInfoForm, comprador: e.target.value})}
                                    placeholder="Nome do comprador"
                                    className="bg-white border-[#D2691E]"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[#654321]">Observações</Label>
                                  <Textarea
                                    value={vendaInfoForm.observacao}
                                    onChange={(e) => setVendaInfoForm({...vendaInfoForm, observacao: e.target.value})}
                                    className="bg-white border-[#D2691E]"
                                    rows={2}
                                  />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Animais</p>
                                    <p className="text-2xl font-bold text-[#654321]">{vendaAtual.length}</p>
                                  </div>
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Peso Total</p>
                                    <p className="text-2xl font-bold text-[#654321]">
                                      {vendaAtual.reduce((sum, v) => sum + v.pesoVenda, 0).toFixed(1)} kg
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Valor Total</p>
                                    <p className="text-2xl font-bold text-[#654321]">
                                      R$ {vendaAtual.reduce((sum, v) => sum + v.valorTotal, 0).toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="text-center p-3 bg-[#F5DEB3] rounded-lg">
                                    <p className="text-sm text-[#A0522D]">Lucro Total</p>
                                    <p className={`text-2xl font-bold ${vendaAtual.reduce((sum, v) => sum + v.lucro, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      R$ {vendaAtual.reduce((sum, v) => sum + v.lucro, 0).toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                <Button 
                                  onClick={finalizarVenda}
                                  className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
                                >
                                  Finalizar Venda
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {relatoriosVenda.length === 0 ? (
                    <Card className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                      <CardContent className="pt-6 text-center">
                        <p className="text-[#A0522D] mb-4">Nenhuma venda registrada ainda</p>
                        <Button 
                          onClick={() => setVendaDialogOpen(true)}
                          className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Registrar Primeira Venda
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    relatoriosVenda.map(relatorio => (
                      <Card 
                        key={relatorio.id} 
                        className="bg-[#F5DEB3] border-2 border-[#8B4513] shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => abrirRelatorioVenda(relatorio)}
                      >
                        <CardContent className="flex flex-col gap-6 rounded-xl py-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-lg font-bold text-[#654321]">
                                Venda - {new Date(relatorio.data).toLocaleDateString('pt-BR')}
                              </p>
                              <p className="text-sm text-[#A0522D]">
                                Comprador: {relatorio.comprador}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-[#A0522D]">Lucro Total</p>
                              <p className={`text-2xl font-bold ${relatorio.lucroTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                R$ {relatorio.lucroTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Vacinação Tab */}
          <TabsContent value="vacinacao" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#F5DEB3]">Controle de Vacinação</h2>
              <Dialog open={vacinacaoDialogOpen} onOpenChange={setVacinacaoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                    <Syringe className="h-4 w-4 mr-2" />
                    Registrar Vacinação
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F5DEB3] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[#654321]">Registrar Vacinação</DialogTitle>
                    <DialogDescription className="text-[#A0522D]">
                      Registre a aplicação de vacina em um animal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#654321]">Animal *</Label>
                      <Select 
                        value={vacinacaoForm.animalId} 
                        onValueChange={(value) => setVacinacaoForm({...vacinacaoForm, animalId: value})}
                      >
                        <SelectTrigger className="bg-white border-[#D2691E]">
                          <SelectValue placeholder="Selecione o animal" />
                        </SelectTrigger>
                        <SelectContent>
                          {animais.map(animal => (
                            <SelectItem key={animal.id} value={animal.id}>
                              Brinco {animal.numeroBrinco} - {animal.sexo} - {animal.idade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#654321]">Tipo de Vacina *</Label>
                      <Select 
                        value={vacinacaoForm.tipoVacina} 
                        onValueChange={(value) => setVacinacaoForm({...vacinacaoForm, tipoVacina: value})}
                      >
                        <SelectTrigger className="bg-white border-[#D2691E]">
                          <SelectValue placeholder="Selecione a vacina" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aftosa">Febre Aftosa</SelectItem>
                          <SelectItem value="Brucelose">Brucelose</SelectItem>
                          <SelectItem value="Raiva">Raiva</SelectItem>
                          <SelectItem value="Clostridioses">Clostridioses</SelectItem>
                          <SelectItem value="Carbúnculo">Carbúnculo</SelectItem>
                          <SelectItem value="IBR/BVD">IBR/BVD</SelectItem>
                          <SelectItem value="Leptospirose">Leptospirose</SelectItem>
                          <SelectItem value="Outra">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#654321]">Data de Aplicação *</Label>
                        <Input
                          type="date"
                          value={vacinacaoForm.dataAplicacao}
                          onChange={(e) => setVacinacaoForm({...vacinacaoForm, dataAplicacao: e.target.value})}
                          className="bg-white border-[#D2691E]"
                        />
                      </div>
                      <div>
                        <Label className="text-[#654321]">Data de Vencimento</Label>
                        <Input
                          type="date"
                          value={vacinacaoForm.dataVencimento}
                          onChange={(e) => setVacinacaoForm({...vacinacaoForm, dataVencimento: e.target.value})}
                          className="bg-white border-[#D2691E]"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#654321]">Observações</Label>
                      <Textarea
                        value={vacinacaoForm.observacao}
                        onChange={(e) => setVacinacaoForm({...vacinacaoForm, observacao: e.target.value})}
                        className="bg-white border-[#D2691E]"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setVacinacaoDialogOpen(false)}
                        className="border-[#D2691E] text-[#654321]"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={registrarVacinacao}
                        className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                      >
                        Registrar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {vacinacoes.length === 0 ? (
                <Card className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                  <CardContent className="pt-6 text-center">
                    <p className="text-[#A0522D] mb-4">Nenhuma vacinação registrada ainda</p>
                    <Button 
                      onClick={() => setVacinacaoDialogOpen(true)}
                      className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                    >
                      <Syringe className="h-4 w-4 mr-2" />
                      Registrar Primeira Vacinação
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vacinacoes.map(vacinacao => {
                    const diasRestantes = vacinacao.dataVencimento 
                      ? Math.floor((new Date(vacinacao.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : null
                    const vencendo = diasRestantes !== null && diasRestantes >= 0 && diasRestantes <= 30

                    return (
                      <Card key={vacinacao.id} className={`border-2 ${vencendo ? 'bg-yellow-50 border-yellow-500' : 'bg-[#F5DEB3] border-[#8B4513]'}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-[#654321] flex items-center justify-between">
                            <span>Brinco {vacinacao.numeroBrinco}</span>
                            {vencendo && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <p className="text-sm text-[#A0522D]">Vacina:</p>
                            <p className="font-semibold text-[#654321]">{vacinacao.tipoVacina}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[#A0522D]">Aplicação:</p>
                            <p className="font-semibold text-[#654321]">
                              {new Date(vacinacao.dataAplicacao).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {vacinacao.dataVencimento && (
                            <div>
                              <p className="text-sm text-[#A0522D]">Vencimento:</p>
                              <p className={`font-semibold ${vencendo ? 'text-yellow-700' : 'text-[#654321]'}`}>
                                {new Date(vacinacao.dataVencimento).toLocaleDateString('pt-BR')}
                                {diasRestantes !== null && diasRestantes >= 0 && (
                                  <span className="text-xs ml-2">({diasRestantes} dias)</span>
                                )}
                              </p>
                            </div>
                          )}
                          {vacinacao.observacao && (
                            <div className="pt-2 border-t border-[#D2691E]">
                              <p className="text-xs text-[#A0522D]">{vacinacao.observacao}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lida Tab */}
          <TabsContent value="lida" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#F5DEB3]">Lida Diária</h2>
              <Dialog open={tarefaDialogOpen} onOpenChange={setTarefaDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#228B22] hover:bg-[#32CD32] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Tarefa
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#F5DEB3] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[#654321]">Registrar Tarefa</DialogTitle>
                    <DialogDescription className="text-[#A0522D]">
                      Adicione uma nova tarefa à lida
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[#654321]">Tipo de Tarefa *</Label>
                      <Select 
                        value={tarefaForm.tipo} 
                        onValueChange={(value) => setTarefaForm({...tarefaForm, tipo: value})}
                      >
                        <SelectTrigger className="bg-white border-[#D2691E]">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Limpeza">Limpeza</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Tratamento">Tratamento</SelectItem>
                          <SelectItem value="Vacinação">Vacinação</SelectItem>
                          <SelectItem value="Pesagem">Pesagem</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[#654321]">Descrição *</Label>
                      <Input
                        value={tarefaForm.descricao}
                        onChange={(e) => setTarefaForm({...tarefaForm, descricao: e.target.value})}
                        placeholder="Descreva a tarefa"
                        className="bg-white border-[#D2691E]"
                      />
                    </div>

                    <div>
                      <Label className="text-[#654321]">Data *</Label>
                      <Input
                        type="date"
                        value={tarefaForm.data}
                        onChange={(e) => setTarefaForm({...tarefaForm, data: e.target.value})}
                        className="bg-white border-[#D2691E]"
                      />
                    </div>

                    <div>
                      <Label className="text-[#654321]">Observações</Label>
                      <Textarea
                        value={tarefaForm.observacao}
                        onChange={(e) => setTarefaForm({...tarefaForm, observacao: e.target.value})}
                        className="bg-white border-[#D2691E]"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setTarefaDialogOpen(false)}
                        className="border-[#D2691E] text-[#654321]"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={registrarTarefa}
                        className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                      >
                        Registrar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {tarefas.length === 0 ? (
                <Card className="bg-[#F5DEB3] border-2 border-[#8B4513]">
                  <CardContent className="pt-6 text-center">
                    <p className="text-[#A0522D] mb-4">Nenhuma tarefa registrada ainda</p>
                    <Button 
                      onClick={() => setTarefaDialogOpen(true)}
                      className="bg-[#228B22] hover:bg-[#32CD32] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Primeira Tarefa
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tarefas.map(tarefa => (
                    <Card key={tarefa.id} className={`border-2 ${tarefa.status === 'concluida' ? 'bg-green-50 border-green-500' : 'bg-[#F5DEB3] border-[#8B4513]'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-[#654321]">{tarefa.tipo}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleTarefaStatus(tarefa.id)}
                              className={tarefa.status === 'concluida' ? 'text-green-600' : 'text-[#A0522D]'}
                            >
                              {tarefa.status === 'concluida' ? '✓ Concluída' : 'Pendente'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletarTarefa(tarefa.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-[#A0522D]">Descrição:</p>
                          <p className="font-semibold text-[#654321]">{tarefa.descricao}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Data:</p>
                          <p className="font-semibold text-[#654321]">
                            {new Date(tarefa.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {tarefa.observacao && (
                          <div className="pt-2 border-t border-[#D2691E]">
                            <p className="text-xs text-[#A0522D]">{tarefa.observacao}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-[#654321] border-t-4 border-[#D2691E] mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-[#DEB887]">Boi Gaúcho - Gestão do Rebanho para o Homem do Campo</p>
          <p className="text-sm text-[#F5DEB3] mt-2">Feito com dedicação para os pecuaristas do Rio Grande do Sul</p>
        </div>
      </footer>

      {/* Dialogs de Relatórios */}
      <Dialog open={relatorioDialogOpen} onOpenChange={setRelatorioDialogOpen}>
        <DialogContent className="bg-[#F5DEB3] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#654321]">Relatório de Pesagem</DialogTitle>
          </DialogHeader>
          {relatorioAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Total de Animais</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioAtual.totalAnimais}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Peso Total</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioAtual.pesoTotal.toFixed(1)} kg</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Peso Médio</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioAtual.pesoMedio.toFixed(1)} kg</p>
                </div>
              </div>
              <Button 
                onClick={() => setRelatorioDialogOpen(false)}
                className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={relatorioCompraDialogOpen} onOpenChange={setRelatorioCompraDialogOpen}>
        <DialogContent className="bg-[#F5DEB3] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#654321]">Relatório de Compra</DialogTitle>
          </DialogHeader>
          {relatorioCompraAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Animais</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioCompraAtual.totalAnimais}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Peso Total</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioCompraAtual.pesoTotal.toFixed(1)} kg</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Peso Médio</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioCompraAtual.pesoMedio.toFixed(1)} kg</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Valor Total</p>
                  <p className="text-3xl font-bold text-[#654321]">R$ {relatorioCompraAtual.valorTotal.toFixed(2)}</p>
                </div>
              </div>
              <Button 
                onClick={() => setRelatorioCompraDialogOpen(false)}
                className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={relatorioVendaDialogOpen} onOpenChange={setRelatorioVendaDialogOpen}>
        <DialogContent className="bg-[#F5DEB3] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#654321]">Relatório Completo de Venda</DialogTitle>
            <DialogDescription className="text-[#A0522D]">
              {relatorioVendaAtual && `${new Date(relatorioVendaAtual.data).toLocaleDateString('pt-BR')} - ${relatorioVendaAtual.comprador}`}
            </DialogDescription>
          </DialogHeader>
          {relatorioVendaAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Animais</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioVendaAtual.totalAnimais}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Peso Total</p>
                  <p className="text-3xl font-bold text-[#654321]">{relatorioVendaAtual.pesoTotal.toFixed(1)} kg</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Valor Total</p>
                  <p className="text-3xl font-bold text-[#654321]">R$ {relatorioVendaAtual.valorTotal.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-[#A0522D]">Lucro Total</p>
                  <p className={`text-3xl font-bold ${relatorioVendaAtual.lucroTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {relatorioVendaAtual.lucroTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#654321] text-lg border-b-2 border-[#D2691E] pb-2">
                  Detalhes por Animal
                </h3>
                {relatorioVendaAtual.animais.map((animal, index) => (
                  <Card key={animal.id} className="bg-white border-2 border-[#D2691E]">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-[#654321] text-lg">
                          Animal {index + 1} - Brinco {animal.numeroBrinco}
                        </h4>
                        <Badge className={animal.lucro >= 0 ? 'bg-green-500' : 'bg-red-500'}>
                          {animal.lucro >= 0 ? 'Lucro' : 'Prejuízo'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-[#A0522D]">Peso Compra</p>
                          <p className="font-bold text-[#654321]">{animal.pesoCompra.toFixed(1)} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Peso Venda</p>
                          <p className="font-bold text-[#654321]">{animal.pesoVenda.toFixed(1)} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Ganho de Peso</p>
                          <p className="font-bold text-green-600">{animal.ganhoPeso.toFixed(1)} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Valor Compra</p>
                          <p className="font-bold text-[#654321]">R$ {animal.valorCompra.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Valor Venda</p>
                          <p className="font-bold text-[#654321]">R$ {animal.valorTotal.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Lucro</p>
                          <p className={`font-bold ${animal.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {animal.lucro.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">R$/kg Venda</p>
                          <p className="font-bold text-[#654321]">R$ {animal.valorPorKg.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">Dias na Propriedade</p>
                          <p className="font-bold text-[#654321]">{animal.diasPropriedade} dias</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#A0522D]">GMD</p>
                          <p className="font-bold text-blue-600">{animal.gmd.toFixed(3)} kg/dia</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {relatorioVendaAtual.observacao && (
                <div className="p-4 bg-white rounded-lg border-2 border-[#D2691E]">
                  <p className="text-sm text-[#A0522D] mb-1">Observações:</p>
                  <p className="text-[#654321]">{relatorioVendaAtual.observacao}</p>
                </div>
              )}

              <Button 
                onClick={() => setRelatorioVendaDialogOpen(false)}
                className="w-full bg-[#228B22] hover:bg-[#32CD32] text-white"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
