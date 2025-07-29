"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Gift, History } from "lucide-react"

interface CoinSystemProps {
  isOpen: boolean
  onClose: () => void
  userCoins: number
}

export default function CoinSystem({ isOpen, onClose, userCoins }: CoinSystemProps) {
  const [transactions] = useState([
    { id: 1, type: "earn", amount: 1000, description: "게임 업로드 보너스", date: "2024-01-15" },
    { id: 2, type: "earn", amount: 500, description: "주간 랭킹 3위", date: "2024-01-14" },
    { id: 3, type: "earn", amount: 1000, description: "Best 게임 선정", date: "2024-01-10" },
    { id: 4, type: "spend", amount: 200, description: "아이템 구매", date: "2024-01-08" },
  ])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            MPcoin 지갑
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 현재 보유 코인 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>보유 MPcoin</span>
                <Coins className="w-6 h-6 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">{userCoins.toLocaleString()}</div>
              <p className="text-sm text-gray-600 mt-2">MiniPlay 전용 가상화폐</p>
            </CardContent>
          </Card>

          {/* 코인 획득 방법 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                코인 획득 방법
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>🎮 게임 업로드</span>
                  <span className="font-semibold text-green-600">+1,000 MP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span>🏆 Best 게임 선정</span>
                  <span className="font-semibold text-yellow-600">+1,000 MP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span>🥇 주간 랭킹 1위</span>
                  <span className="font-semibold text-purple-600">+설정된 보상</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span>🎯 게임 플레이</span>
                  <span className="font-semibold text-blue-600">+랭킹 보상</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 거래 내역 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                최근 거래 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                    <div className={`font-semibold ${transaction.type === "earn" ? "text-green-600" : "text-red-600"}`}>
                      {transaction.type === "earn" ? "+" : "-"}
                      {transaction.amount.toLocaleString()} MP
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
