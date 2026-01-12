"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Circle, LogIn, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nome, setNome] = useState("")
  const [fazenda, setFazenda] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Busca usuário no localStorage
      const usersData = localStorage.getItem('users_database')
      const users = usersData ? JSON.parse(usersData) : []
      
      const user = users.find((u: any) => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Email ou senha incorretos')
      }

      // Salva dados do usuário autenticado
      localStorage.setItem('user_data', JSON.stringify({
        id: user.id,
        email: user.email,
        nome: user.nome,
        fazenda: user.fazenda
      }))

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Valida campos
      if (!nome || !fazenda) {
        throw new Error('Por favor, preencha todos os campos')
      }

      // Busca usuários existentes
      const usersData = localStorage.getItem('users_database')
      const users = usersData ? JSON.parse(usersData) : []
      
      // Verifica se email já existe
      if (users.find((u: any) => u.email === email)) {
        throw new Error('Este email já está cadastrado')
      }

      // Cria novo usuário
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password,
        nome,
        fazenda,
        createdAt: new Date().toISOString()
      }

      // Salva no banco de usuários
      users.push(newUser)
      localStorage.setItem('users_database', JSON.stringify(users))

      // Salva dados do usuário autenticado
      localStorage.setItem('user_data', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        nome: newUser.nome,
        fazenda: newUser.fazenda
      }))

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B4513] via-[#A0522D] to-[#CD853F] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#F5DEB3] border-4 border-[#8B4513] shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-[#8B4513] p-4 rounded-full border-4 border-[#D2691E]">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/8327af33-c841-4554-9961-68b93dcd16a0.jpg" 
                alt="Logo Boi Gaúcho" 
                className="h-16 w-16 object-cover rounded-full"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-4xl font-bold text-[#654321]">Boi Gaúcho</CardTitle>
            <CardDescription className="text-[#A0522D] text-xl mt-2">
              {isSignUp ? "Criar Conta" : "Entrar no Sistema"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-[#654321] font-semibold">
                    Seu Nome *
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="João da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="bg-white border-2 border-[#8B4513] focus:border-[#D2691E]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fazenda" className="text-[#654321] font-semibold">
                    Nome da Fazenda *
                  </Label>
                  <Input
                    id="fazenda"
                    type="text"
                    placeholder="Fazenda São José"
                    value={fazenda}
                    onChange={(e) => setFazenda(e.target.value)}
                    required
                    className="bg-white border-2 border-[#8B4513] focus:border-[#D2691E]"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#654321] font-semibold">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-2 border-[#8B4513] focus:border-[#D2691E]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#654321] font-semibold">
                Senha *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white border-2 border-[#8B4513] focus:border-[#D2691E]"
              />
            </div>

            {error && (
              <div className="bg-[#DC143C] text-white p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-[#F5DEB3] border-2 border-[#D2691E] text-lg py-6"
            >
              {loading ? (
                "Carregando..."
              ) : isSignUp ? (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError("")
              }}
              className="text-[#8B4513] hover:text-[#654321] font-semibold underline"
            >
              {isSignUp
                ? "Já tem conta? Fazer login"
                : "Não tem conta? Criar agora"}
            </button>
          </div>

          <div className="mt-6 text-center text-[#A0522D] text-sm">
            <p>Sistema de gestão para pecuaristas</p>
            <p className="mt-2 text-xs">Seus dados ficam salvos apenas no seu dispositivo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
