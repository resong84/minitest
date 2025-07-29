"use client"

import { useState, useEffect } from "react"
import { Heart, Search, Star, Play, Coins, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuthModal from "@/components/auth-modal"
import GamePlayer from "@/components/game-player"
import RankingSystem from "@/components/ranking-system"
import DeveloperDashboard from "@/components/developer-dashboard"
import PaymentSystem from "@/components/payment-system"
import MyPage from "@/components/my-page"

interface Game {
  id: number
  title: string
  image: string
  likes: number
  category: string
  rating: number
  plays: number
  isLiked: boolean
  description: string
  developerId: string
  weeklyRanking: { userId: string; score: number; username: string }[]
  rewards: {
    first: number
    second: number
    third: number
    top100: number
    other: number
  }
  isNew: boolean
  isBest: boolean
  createdAt: Date
}

export default function MinigamePortal() {
  // git 변경 감지 테스트. //
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Space Adventure",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1247,
      category: "액션",
      rating: 4.7,
      plays: 15420,
      isLiked: false,
      description: "우주를 배경으로 한 스릴 넘치는 액션 게임입니다. 외계인들과 싸우며 은하계를 구해보세요.",
      developerId: "dev1",
      weeklyRanking: [],
      rewards: { first: 100, second: 50, third: 25, top100: 5, other: 1 },
      isNew: false,
      isBest: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Racing Fever",
      image: "/placeholder.svg?height=180&width=280",
      likes: 2156,
      category: "레이싱",
      rating: 4.6,
      plays: 23450,
      isLiked: false,
      description:
        "고속도로에서 펼쳐지는 짜릿한 레이싱 게임입니다. 다양한 자동차와 트랙에서 최고 속도의 스릴을 경험해보세요.",
      developerId: "dev3",
      weeklyRanking: [],
      rewards: { first: 120, second: 60, third: 30, top100: 6, other: 1 },
      isNew: false,
      isBest: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Tower Defense",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1923,
      category: "전략",
      rating: 4.5,
      plays: 18920,
      isLiked: false,
      description: "전략적 사고가 필요한 타워 디펜스 게임입니다. 다양한 타워와 업그레이드로 적의 침입을 막아내세요.",
      developerId: "dev6",
      weeklyRanking: [],
      rewards: { first: 110, second: 55, third: 27, top100: 5, other: 1 },
      isNew: false,
      isBest: true,
      createdAt: new Date(),
    },
    {
      id: 4,
      title: "Magic Quest",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1678,
      category: "RPG",
      rating: 4.4,
      plays: 12340,
      isLiked: false,
      description:
        "마법의 세계에서 펼쳐지는 판타지 RPG입니다. 다양한 마법과 스킬을 배우며 악의 세력을 물리치는 모험을 떠나보세요.",
      developerId: "dev4",
      weeklyRanking: [],
      rewards: { first: 90, second: 45, third: 22, top100: 4, other: 1 },
      isNew: false,
      isBest: true,
      createdAt: new Date(),
    },
    {
      id: 5,
      title: "Ninja Run",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1334,
      category: "액션",
      rating: 4.3,
      plays: 11230,
      isLiked: false,
      description:
        "닌자가 되어 장애물을 피하며 달리는 무한 러닝 게임입니다. 다양한 닌자 기술과 아이템으로 더 멀리 달려보세요.",
      developerId: "dev8",
      weeklyRanking: [],
      rewards: { first: 85, second: 42, third: 21, top100: 4, other: 1 },
      isNew: true,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 6,
      title: "Puzzle Master",
      image: "/placeholder.svg?height=180&width=280",
      likes: 892,
      category: "퍼즐",
      rating: 4.2,
      plays: 8930,
      isLiked: true,
      description:
        "두뇌를 자극하는 창의적인 퍼즐 게임입니다. 100개 이상의 레벨과 다양한 난이도로 구성되어 있어 누구나 즐길 수 있습니다.",
      developerId: "dev2",
      weeklyRanking: [],
      rewards: { first: 80, second: 40, third: 20, top100: 4, other: 1 },
      isNew: true,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 7,
      title: "Block Breaker",
      image: "/placeholder.svg?height=180&width=280",
      likes: 743,
      category: "아케이드",
      rating: 4.1,
      plays: 6780,
      isLiked: true,
      description:
        "클래식한 벽돌깨기 게임의 현대적 버전입니다. 특수 파워업과 보너스 스테이지로 더욱 재미있게 즐길 수 있습니다.",
      developerId: "dev5",
      weeklyRanking: [],
      rewards: { first: 70, second: 35, third: 17, top100: 3, other: 1 },
      isNew: true,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 8,
      title: "Memory Game",
      image: "/placeholder.svg?height=180&width=280",
      likes: 567,
      category: "퍼즐",
      rating: 3.9,
      plays: 4560,
      isLiked: false,
      description: "기억력을 향상시키는 두뇌 훈련 게임입니다. 점점 어려워지는 패턴을 기억하며 집중력을 기르세요.",
      developerId: "dev7",
      weeklyRanking: [],
      rewards: { first: 60, second: 30, third: 15, top100: 3, other: 1 },
      isNew: true,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 9,
      title: "Sky Fighter",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1456,
      category: "액션",
      rating: 4.0,
      plays: 9870,
      isLiked: false,
      description: "하늘을 날며 적기를 격추하는 슈팅 게임입니다.",
      developerId: "dev9",
      weeklyRanking: [],
      rewards: { first: 75, second: 37, third: 18, top100: 3, other: 1 },
      isNew: false,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 10,
      title: "Word Master",
      image: "/placeholder.svg?height=180&width=280",
      likes: 823,
      category: "퍼즐",
      rating: 3.8,
      plays: 5430,
      isLiked: false,
      description: "단어를 맞추는 재미있는 퍼즐 게임입니다.",
      developerId: "dev10",
      weeklyRanking: [],
      rewards: { first: 65, second: 32, third: 16, top100: 3, other: 1 },
      isNew: false,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 11,
      title: "Farm Simulator",
      image: "/placeholder.svg?height=180&width=280",
      likes: 1234,
      category: "시뮬레이션",
      rating: 4.2,
      plays: 7890,
      isLiked: false,
      description: "농장을 운영하며 작물을 키우는 시뮬레이션 게임입니다.",
      developerId: "dev11",
      weeklyRanking: [],
      rewards: { first: 80, second: 40, third: 20, top100: 4, other: 1 },
      isNew: false,
      isBest: false,
      createdAt: new Date(),
    },
    {
      id: 12,
      title: "Ocean Adventure",
      image: "/placeholder.svg?height=180&width=280",
      likes: 987,
      category: "어드벤처",
      rating: 3.7,
      plays: 6540,
      isLiked: false,
      description: "바다 속 모험을 떠나는 어드벤처 게임입니다.",
      developerId: "dev12",
      weeklyRanking: [],
      rewards: { first: 70, second: 35, third: 17, top100: 3, other: 1 },
      isNew: false,
      isBest: false,
      createdAt: new Date(),
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authAction, setAuthAction] = useState<"play" | "upload">("play")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isGameOpen, setIsGameOpen] = useState(false)
  const [isRankingOpen, setIsRankingOpen] = useState(false)
  const [isDeveloperDashboardOpen, setIsDeveloperDashboardOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isMyPageOpen, setIsMyPageOpen] = useState(false)
  const [userCoins, setUserCoins] = useState(5000)
  const [playedGames, setPlayedGames] = useState<number[]>([])
  const [consecutiveLoginDays, setConsecutiveLoginDays] = useState(7)
  const [lastLoginDate, setLastLoginDate] = useState<string | null>(null)

  const categories = ["전체", "액션", "퍼즐", "레이싱", "RPG", "아케이드", "전략", "시뮬레이션", "어드벤처"]

  // 로그인 보상 처리
  useEffect(() => {
    const today = new Date().toDateString()
    const storedLastLogin = localStorage.getItem("lastLoginDate")
    const storedConsecutiveDays = localStorage.getItem("consecutiveLoginDays")

    if (storedLastLogin !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      let newConsecutiveDays = 1
      if (storedLastLogin === yesterday.toDateString()) {
        newConsecutiveDays = Number.parseInt(storedConsecutiveDays || "1") + 1
      }

      const loginReward = 100 + (newConsecutiveDays - 1) * 10
      setUserCoins((prev) => prev + loginReward)
      setConsecutiveLoginDays(newConsecutiveDays)
      setLastLoginDate(today)

      localStorage.setItem("lastLoginDate", today)
      localStorage.setItem("consecutiveLoginDays", newConsecutiveDays.toString())

      alert(`🎉 로그인 보상! ${loginReward} MPcoin을 받았습니다! (연속 ${newConsecutiveDays}일)`)
    } else {
      setConsecutiveLoginDays(Number.parseInt(storedConsecutiveDays || "1"))
    }
  }, [])

  // 카테고리 필터 이벤트 리스너
  useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent) => {
      setSelectedCategory(event.detail)
    }

    window.addEventListener("categoryFilter", handleCategoryFilter as EventListener)

    return () => {
      window.removeEventListener("categoryFilter", handleCategoryFilter as EventListener)
    }
  }, [])

  const handleLike = (gameId: number) => {
    setGames(
      games.map((game) =>
        game.id === gameId
          ? {
              ...game,
              isLiked: !game.isLiked,
              likes: game.isLiked ? game.likes - 1 : game.likes + 1,
            }
          : game,
      ),
    )
  }

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "전체" || game.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 상위 4개는 BEST, 중간 4개는 NEW, 나머지 4개는 일반
  const displayGames = filteredGames.slice(0, 12)
  const bestGames = displayGames.slice(0, 4).map((game) => ({ ...game, isBest: true, isNew: false }))
  const newGames = displayGames.slice(4, 8).map((game) => ({ ...game, isNew: true, isBest: false }))
  const regularGames = displayGames.slice(8, 12).map((game) => ({ ...game, isNew: false, isBest: false }))
  const finalGames = [...bestGames, ...newGames, ...regularGames]

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const handlePlayClick = (game: Game) => {
    setSelectedGame(game)
    setAuthAction("play")
    setIsAuthOpen(true)
  }

  const handleDeveloperDashboardClick = () => {
    setAuthAction("upload")
    setIsAuthOpen(true)
  }

  const handleAuthSuccess = () => {
    setIsAuthOpen(false)
    if (authAction === "play" && selectedGame) {
      setIsGameOpen(true)
    } else if (authAction === "upload") {
      setIsDeveloperDashboardOpen(true)
    }
  }

  const handlePlayWithoutLogin = () => {
    setIsAuthOpen(false)
    if (selectedGame) {
      setIsGameOpen(true)
    }
  }

  const handleGamePlayed = (gameId: number) => {
    if (!playedGames.includes(gameId)) {
      setPlayedGames([...playedGames, gameId])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* 웹 타이틀 */}
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MiniPlay
              </h1>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>

            {/* 게임 검색 */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="게임 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 검색 카테고리 */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 내 MPcoin */}
            <Button variant="outline" onClick={() => setIsPaymentOpen(true)} className="whitespace-nowrap">
              <Coins className="w-4 h-4 mr-2 text-yellow-500" />내 MPcoin: {userCoins.toLocaleString()}
            </Button>

            {/* 마이 페이지 */}
            <Button
              variant="outline"
              onClick={() => setIsMyPageOpen(true)}
              className="whitespace-nowrap bg-transparent"
            >
              <User className="w-4 h-4 mr-2" />
              마이 페이지
            </Button>

            {/* 개발자 대시보드 */}
            <Button
              variant="outline"
              onClick={handleDeveloperDashboardClick}
              className="whitespace-nowrap bg-transparent"
            >
              개발자 대시보드
            </Button>
          </div>
        </div>
      </header>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {finalGames.map((game) => (
            <Card
              key={game.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md"
            >
              <div className="relative">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    onClick={() => handlePlayClick(game)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-black hover:bg-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    플레이
                  </Button>
                </div>
                <Badge className="absolute top-2 left-2 bg-black/70 text-white">{game.category}</Badge>
              </div>

              <CardContent className="p-3 relative">
                {/* 기본 상태 */}
                <div className="group-hover:opacity-0 transition-opacity duration-300">
                  {/* 타이틀과 배지 */}
                  <div className="mb-2">
                    {game.isBest && (
                      <div className="mb-1">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-1.5 py-0.5 animate-pulse font-bold">
                          👍 BEST
                        </Badge>
                      </div>
                    )}
                    {game.isNew && (
                      <div className="mb-1">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-1.5 py-0.5 animate-pulse font-bold">
                          ⭐ NEW
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg truncate flex-1 mr-2">{game.title}</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleLike(game.id)} className="p-1 h-auto">
                        <Heart
                          className={`w-5 h-5 ${
                            game.isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {formatNumber(game.likes)}
                    </div>
                    <div className="flex items-center">
                      <Play className="w-4 h-4 mr-1" />
                      {formatNumber(game.plays)}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(game.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{game.rating}</span>
                  </div>
                </div>

                {/* 호버 상태 */}
                <div className="absolute inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="mb-2">
                    {game.isBest && (
                      <div className="mb-1">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-1.5 py-0.5 animate-pulse font-bold">
                          👍 BEST
                        </Badge>
                      </div>
                    )}
                    {game.isNew && (
                      <div className="mb-1">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-1.5 py-0.5 animate-pulse font-bold">
                          ⭐ NEW
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg truncate flex-1 mr-2">{game.title}</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleLike(game.id)} className="p-1 h-auto">
                        <Heart
                          className={`w-5 h-5 ${
                            game.isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-tight line-clamp-4">{game.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {finalGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 검색어나 카테고리를 시도해보세요</p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onPlayWithoutLogin={handlePlayWithoutLogin}
        action={authAction}
      />

      {/* Game Player Modal */}
      <GamePlayer
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        game={selectedGame}
        onRankingOpen={() => setIsRankingOpen(true)}
        userCoins={userCoins}
        onCoinsUpdate={setUserCoins}
        playedGames={playedGames}
        onGamePlayed={handleGamePlayed}
      />

      {/* Ranking System Modal */}
      {selectedGame && (
        <RankingSystem isOpen={isRankingOpen} onClose={() => setIsRankingOpen(false)} game={selectedGame} />
      )}

      {/* Developer Dashboard Modal */}
      <DeveloperDashboard
        isOpen={isDeveloperDashboardOpen}
        onClose={() => setIsDeveloperDashboardOpen(false)}
        developerId="current-user"
      />

      {/* My Page Modal */}
      <MyPage
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        userCoins={userCoins}
        consecutiveLoginDays={consecutiveLoginDays}
      />

      {/* Payment System Modal */}
      <PaymentSystem
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        userCoins={userCoins}
        onCoinsUpdate={setUserCoins}
      />
    </div>
  )
}
