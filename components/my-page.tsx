"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Clock, Trophy, Star, Calendar, Coins, Target, Award, Eye } from "lucide-react"
import DeveloperInfoModal from "@/components/developer-info-modal"

interface MyPageProps {
  isOpen: boolean
  onClose: () => void
  userCoins: number
  consecutiveLoginDays: number
}

export default function MyPage({ isOpen, onClose, userCoins, consecutiveLoginDays }: MyPageProps) {
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState("")

  const [playedGames] = useState([
    {
      id: 1,
      title: "Space Adventure",
      category: "액션",
      playTime: 245,
      playCount: 15,
      firstPlayReward: 200,
      bestScore: 15420,
      currentRank: 15,
      totalPlayers: 5420,
      lastPlayed: "2024-01-15",
      achievements: ["첫 플레이", "스코어 10000+", "연속 플레이 7일"],
      developer: "GameMaster Studio",
    },
    {
      id: 2,
      title: "Puzzle Master",
      category: "퍼즐",
      playTime: 180,
      playCount: 8,
      firstPlayReward: 200,
      bestScore: 8950,
      currentRank: 23,
      totalPlayers: 3240,
      lastPlayed: "2024-01-14",
      achievements: ["퍼즐 마스터", "완벽한 클리어"],
      developer: "PuzzleWorks",
    },
    {
      id: 3,
      title: "Racing Fever",
      category: "레이싱",
      playTime: 320,
      playCount: 12,
      firstPlayReward: 200,
      bestScore: 23450,
      currentRank: 8,
      totalPlayers: 6760,
      lastPlayed: "2024-01-13",
      achievements: ["스피드 킹", "1위 달성", "완주 10회"],
      developer: "SpeedDev",
    },
  ])

  // 선호 카테고리 계산 (플레이 시간 기준)
  const categoryStats = playedGames.reduce(
    (acc, game) => {
      acc[game.category] = (acc[game.category] || 0) + game.playTime
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const [userStats] = useState({
    totalPlayTime: 745,
    gamesPlayed: 3,
    averageRank: playedGames.reduce((sum, game) => sum + game.currentRank, 0) / playedGames.length,
    totalAchievements: 8,
    favoriteCategories: sortedCategories,
    joinDate: "2024-01-01",
  })

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  const getRankBadge = (rank: number, total: number) => {
    const percentage = (rank / total) * 100
    if (percentage <= 10) return { color: "bg-yellow-500", text: "상위 10%" }
    if (percentage <= 30) return { color: "bg-blue-500", text: "상위 30%" }
    if (percentage <= 50) return { color: "bg-green-500", text: "상위 50%" }
    return { color: "bg-gray-500", text: "하위 50%" }
  }

  const handleDeveloperView = (developerName: string) => {
    setSelectedDeveloper(developerName)
    setIsDeveloperInfoOpen(true)
  }

  const handleCategoryClick = (category: string) => {
    // 부모 컴포넌트에 카테고리 선택 이벤트 전달
    onClose()
    // 메인 페이지로 이동하면서 카테고리 필터 적용
    const event = new CustomEvent("categoryFilter", { detail: category })
    window.dispatchEvent(event)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            마이 페이지
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="games">플레이한 게임</TabsTrigger>
            <TabsTrigger value="achievements">업적</TabsTrigger>
            <TabsTrigger value="rewards">보상 현황</TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">보유 MPcoin</CardTitle>
                  <Coins className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{userCoins.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">연속 로그인 {consecutiveLoginDays}일</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 플레이 시간</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPlayTime(userStats.totalPlayTime)}</div>
                  <p className="text-xs text-muted-foreground">{userStats.gamesPlayed}개 게임</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 순위</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.averageRank.toFixed(1)}위</div>
                  <p className="text-xs text-muted-foreground">전체 게임 평균</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>플레이 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">선호 카테고리</span>
                  <div className="flex gap-2 flex-wrap">
                    {userStats.favoriteCategories.map(([category, playTime], index) => (
                      <Badge
                        key={category}
                        variant={index === 0 ? "default" : "secondary"}
                        className={`cursor-pointer transition-colors ${
                          index === 0
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : index === 1
                              ? "bg-gray-400 hover:bg-gray-500 text-white"
                              : "bg-orange-400 hover:bg-orange-500 text-white"
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {index + 1}순위: {category} ({formatPlayTime(playTime)})
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">획득 업적</span>
                  <span className="font-semibold">{userStats.totalAchievements}개</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">가입일</span>
                  <span className="text-sm text-gray-600">{userStats.joinDate}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 플레이한 게임 탭 */}
          <TabsContent value="games" className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {playedGames.map((game) => {
                const rankBadge = getRankBadge(game.currentRank, game.totalPlayers)
                return (
                  <Card key={game.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{game.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {game.category}
                            </Badge>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors bg-blue-50 text-blue-600 border-blue-200"
                            onClick={() => handleDeveloperView(game.developer)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            개발자 보기
                          </Badge>
                        </div>
                        <Badge className={`${rankBadge.color} text-white ml-2 cursor-default`}>{rankBadge.text}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{formatPlayTime(game.playTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <span>
                            {game.currentRank}위 / {game.totalPlayers.toLocaleString()}명
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          <span>최고점수: {game.bestScore.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>최근 접속일: {game.lastPlayed}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">순위 진행률</div>
                        <Progress
                          value={((game.totalPlayers - game.currentRank) / game.totalPlayers) * 100}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* 업적 탭 */}
          <TabsContent value="achievements" className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playedGames.map((game) => (
                <Card key={game.id}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {game.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 보상 현황 탭 */}
          <TabsContent value="rewards" className="flex-1 overflow-y-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  일일 로그인 보상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold">연속 로그인 보너스</div>
                      <div className="text-sm text-gray-600">{consecutiveLoginDays}일 연속</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">+{100 + consecutiveLoginDays * 10} MPcoin</div>
                      <div className="text-xs text-gray-500">내일 보상</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>기본 로그인 보상:</span>
                      <span>100 MPcoin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>연속 로그인 보너스:</span>
                      <span>+{consecutiveLoginDays * 10} MPcoin</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  게임 플레이 보상
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span>🎮 첫 플레이 보너스</span>
                      <span className="font-semibold text-blue-600">+200 MPcoin</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>• Space Adventure:</span>
                        <span>첫 플레이 (+200 MP)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Puzzle Master:</span>
                        <span>첫 플레이 (+200 MP)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Racing Fever:</span>
                        <span>첫 플레이 (+200 MP)</span>
                      </div>
                      <div className="flex justify-between font-medium text-blue-700 pt-1 border-t border-blue-200">
                        <span>총 첫 플레이 보상:</span>
                        <span>+600 MP</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span>💰 플레이 비용</span>
                      <span className="font-semibold text-red-600">-50 MPcoin</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>• Space Adventure:</span>
                        <span>15회 플레이 (-750 MP)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Puzzle Master:</span>
                        <span>8회 플레이 (-400 MP)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Racing Fever:</span>
                        <span>12회 플레이 (-600 MP)</span>
                      </div>
                      <div className="flex justify-between font-medium text-red-700 pt-1 border-t border-red-200">
                        <span>총 플레이 비용:</span>
                        <span>-1,750 MP</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    * 첫 플레이 시에만 200 MPcoin 보상, 이후 플레이 시 50 MPcoin 차감
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 개발자 정보 모달 */}
        <DeveloperInfoModal
          isOpen={isDeveloperInfoOpen}
          onClose={() => setIsDeveloperInfoOpen(false)}
          developerName={selectedDeveloper}
        />
      </DialogContent>
    </Dialog>
  )
}
