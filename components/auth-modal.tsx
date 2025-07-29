"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock, GamepadIcon } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: () => void
  onPlayWithoutLogin: () => void
  action: "play" | "upload"
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onPlayWithoutLogin, action }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    // 로그인 로직 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onAuthSuccess()
  }

  const handleSignup = async () => {
    setIsLoading(true)
    // 회원가입 로직 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onAuthSuccess()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GamepadIcon className="w-5 h-5" />
            {action === "play" ? "게임 플레이" : "게임 업로드"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="login-email" type="email" placeholder="이메일을 입력하세요" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="login-password" type="password" placeholder="비밀번호를 입력하세요" className="pl-10" />
              </div>
            </div>
            <Button onClick={handleLogin} disabled={isLoading} className="w-full">
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-username">사용자명</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="signup-username" placeholder="사용자명을 입력하세요" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="signup-email" type="email" placeholder="이메일을 입력하세요" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="signup-password" type="password" placeholder="비밀번호를 입력하세요" className="pl-10" />
              </div>
            </div>
            <Button onClick={handleSignup} disabled={isLoading} className="w-full">
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </TabsContent>
        </Tabs>

        {action === "play" && (
          <div className="border-t pt-4">
            <Button variant="outline" onClick={onPlayWithoutLogin} className="w-full bg-transparent">
              로그인 없이 하기
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
