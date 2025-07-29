"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Coins } from "lucide-react"

interface Game {
  id: number
  title: string
  rewards?: {
    first: number
    second: number
    third: number
    top100: number
    other: number
  }
}

interface RankingEntry {
  userId: string
  username: string
  score: number
  rank: number
  reward: number
}

interface RankingSystemProps {
  isOpen: boolean
  onClose: () => void
  game: Game | null
}

export default function RankingSystem({ isOpen, onClose, game }: RankingSystemProps) {
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [timeUntilReset, setTimeUntilReset] = useState("")
  const [userRank, setUserRank] = useState<number | null>(null)
  const rewards = game?.rewards || { first: 100, second: 50, third: 25, top100: 10, other: 5 }

  useEffect(() => {
    if (!game) return

    const sampleRankings: RankingEntry[] = [
      { userId: "1", username: "게임마스터", score: 15420, rank: 1, reward: rewards.first },
      { userId: "2", username: "프로게이머", score: 14230, rank: 2, reward: rewards.second },
      { userId: "3", username: "스킬러", score: 13890, rank: 3, reward: rewards.third },
      { userId: "4", username: "챌린저", score: 12450, rank: 4, reward: rewards.top100 },
      { userId: "5", username: "엘리트", score: 11230, rank: 5, reward: rewards.top100 },
      { userId: "6", username: "현재사용자", score: 8950, rank: 15, reward: rewards.top100 },
    ]
    setRankings(sampleRankings)
    setUserRank(15)
  }, [game, rewards])

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const nextSunday = new Date()
      nextSunday.setDate(now.getDate() + (7 - now.getDay()))
      nextSunday.setHours(23, 59, 59, 999)

      const diff = nextSunday.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilReset(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1위</Badge>
    if (rank === 2) return <Badge className="bg-gray-400">2위</Badge>
    if (rank === 3) return <Badge className="bg-amber-600">3위</Badge>
    if (rank <= 100) return <Badge variant="secondary">TOP 100</Badge>
    return <Badge variant="outline">기타</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {game?.title} - 주간 랭킹
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          {/* 초기화 타이머 */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
            <div className="text-center">
              <h3 className="font-semibold mb-2">랭킹 초기화까지</h3>
              <div className="text-2xl font-bold text-purple-600">{timeUntilReset}</div>
              <p className="text-sm text-gray-600 mt-1">매주 일요일 23:59:59에 초기화됩니다</p>
            </div>
          </div>

          {/* 내 랭킹 */}
          {userRank && (
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankIcon(userRank)}
                  <div>
                    <div className="font-semibold">내 순위</div>
                    <div className="text-sm text-gray-600">현재사용자</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">8,950점</div>
                  {getRankBadge(userRank)}
                </div>
              </div>
            </div>
          )}

          {/* 랭킹 리스트 */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">전체 랭킹</h3>
            {rankings.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  entry.userId === "6" ? "bg-blue-50 border-blue-200" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(entry.rank)}
                  <div>
                    <div className="font-medium">{entry.username}</div>
                    <div className="text-sm text-gray-600">{entry.score.toLocaleString()}점</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span>{entry.reward} MP</span>
                  </div>
                  {getRankBadge(entry.rank)}
                </div>
              </div>
            ))}
          </div>

          {/* 보상 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">주간 보상</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>🥇 1위:</span>
                <span className="font-medium">{rewards.first} MPcoin</span>
              </div>
              <div className="flex justify-between">
                <span>🥈 2위:</span>
                <span className="font-medium">{rewards.second} MPcoin</span>
              </div>
              <div className="flex justify-between">
                <span>🥉 3위:</span>
                <span className="font-medium">{rewards.third} MPcoin</span>
              </div>
              <div className="flex justify-between">
                <span>🏆 4-100위:</span>
                <span className="font-medium">{rewards.top100} MPcoin</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span>📊 기타:</span>
                <span className="font-medium">{rewards.other} MPcoin</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
