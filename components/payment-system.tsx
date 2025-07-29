"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, CreditCard, AlertCircle, History, Search, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentSystemProps {
  isOpen: boolean
  onClose: () => void
  userCoins: number
  onCoinsUpdate: (newAmount: number) => void
}

interface ChargeHistory {
  id: string
  date: string
  amount: number
  coins: number
  bonus: number
  method: string
  status: string
}

export default function PaymentSystem({ isOpen, onClose, userCoins, onCoinsUpdate }: PaymentSystemProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const chargeOptions = [
    { won: 1000, bonus: 3 },
    { won: 3000, bonus: 4 },
    { won: 10000, bonus: 5 },
    { won: 50000, bonus: 6 },
    { won: 100000, bonus: 7 },
    { won: 5990, bonus: 0 },
  ]

  // 샘플 충전 내역
  const [chargeHistory] = useState<ChargeHistory[]>([
    {
      id: "1",
      date: "2024-01-15 14:30",
      amount: 10000,
      coins: 1050,
      bonus: 5,
      method: "신용카드",
      status: "완료",
    },
    {
      id: "2",
      date: "2024-01-10 09:15",
      amount: 3000,
      coins: 312,
      bonus: 4,
      method: "카카오페이",
      status: "완료",
    },
    {
      id: "3",
      date: "2024-01-05 16:45",
      amount: 1000,
      coins: 103,
      bonus: 3,
      method: "신용카드",
      status: "완료",
    },
    {
      id: "4",
      date: "2024-01-01 11:20",
      amount: 5990,
      coins: 599,
      bonus: 0,
      method: "토스페이",
      status: "완료",
    },
  ])

  const calculateCoins = (won: number, bonus: number) => {
    const baseCoins = won / 10 // 기본 비율: 10원 = 1 MPcoin
    const bonusCoins = (baseCoins * bonus) / 100
    return Math.ceil(baseCoins + bonusCoins) // 올림 계산
  }

  const handleCharge = async (won: number, bonus: number) => {
    setIsProcessing(true)
    const coins = calculateCoins(won, bonus)
    // 결제 처리 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onCoinsUpdate(userCoins + coins)
    setIsProcessing(false)
    alert(`${won.toLocaleString()}원 결제가 완료되었습니다! ${coins} MPcoin이 충전되었습니다.`)
  }

  const filteredHistory = chargeHistory.filter((item) => {
    const matchesSearch =
      item.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount.toString().includes(searchTerm) ||
      item.coins.toString().includes(searchTerm)

    if (selectedPeriod === "all") return matchesSearch

    const itemDate = new Date(item.date)
    const now = new Date()

    switch (selectedPeriod) {
      case "week":
        return matchesSearch && now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000
      case "month":
        return matchesSearch && now.getTime() - itemDate.getTime() <= 30 * 24 * 60 * 60 * 1000
      case "3months":
        return matchesSearch && now.getTime() - itemDate.getTime() <= 90 * 24 * 60 * 60 * 1000
      default:
        return matchesSearch
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            MPcoin 충전
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="charge" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charge">충전하기</TabsTrigger>
            <TabsTrigger value="history">충전 내역</TabsTrigger>
          </TabsList>

          {/* 충전하기 탭 */}
          <TabsContent value="charge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  현재 보유 MPcoin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{userCoins.toLocaleString()} MP</div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>충전 비율: 10원 = 1 MPcoin</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chargeOptions.map((option) => {
                const coins = calculateCoins(option.won, option.bonus)
                return (
                  <Card key={option.won} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{option.won.toLocaleString()}원</div>
                      <div className="text-lg text-yellow-600 mb-1">{coins} MPcoin</div>
                      <div className="text-sm text-green-600 mb-3">
                        {option.bonus > 0 ? `보너스 ${option.bonus}% 포함` : "보너스 0%"}
                      </div>
                      <Button
                        onClick={() => handleCharge(option.won, option.bonus)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? "처리중..." : "충전하기"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 충전 내역 탭 */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  충전 내역 조회
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 검색 및 필터 */}
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="결제수단, 금액, 코인으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 기간</option>
                    <option value="week">최근 1주일</option>
                    <option value="month">최근 1개월</option>
                    <option value="3months">최근 3개월</option>
                  </select>
                </div>

                {/* 충전 내역 리스트 */}
                <div className="space-y-3">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Coins className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{item.amount.toLocaleString()}원 충전</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {item.date} • {item.method}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{item.coins} MP</div>
                          <div className="text-xs text-gray-500">{item.bonus > 0 && `보너스 ${item.bonus}% 포함`}</div>
                          <div className="text-xs text-blue-600">{item.status}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>검색 결과가 없습니다.</p>
                    </div>
                  )}
                </div>

                {/* 통계 요약 */}
                {filteredHistory.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">충전 요약</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg">
                          {filteredHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                        </div>
                        <div className="text-gray-600">총 충전 금액</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-yellow-600">
                          {filteredHistory.reduce((sum, item) => sum + item.coins, 0).toLocaleString()} MP
                        </div>
                        <div className="text-gray-600">총 획득 코인</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{filteredHistory.length}회</div>
                        <div className="text-gray-600">충전 횟수</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
