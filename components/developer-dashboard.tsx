"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Users,
  Play,
  Coins,
  Settings,
  TrendingUp,
  Upload,
  RefreshCw,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react"
import GameLinkModal from "@/components/game-link-modal"

interface DeveloperDashboardProps {
  isOpen: boolean
  onClose: () => void
  developerId: string
}

interface Achievement {
  id: string
  name: string
  description: string
  reward: number
  condition: string
}

interface LinkedGame {
  id: string
  url: string
  title: string
  description: string
  image?: string
}

interface CustomReward {
  id: string
  type: "range" | "specific"
  startRank?: number
  endRank?: number
  specificRanks?: number[]
  reward: number
}

export default function DeveloperDashboard({ isOpen, onClose, developerId }: DeveloperDashboardProps) {
  const [rewards, setRewards] = useState({
    first: 1000,
    second: 500,
    third: 250,
    top100: 100,
    basic: 50,
  })

  const [customRewards, setCustomRewards] = useState<CustomReward[]>([])
  const [developerCoins] = useState(15000) // 개발자 보유 MPcoin

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", name: "첫 플레이", description: "게임을 처음 플레이했습니다", reward: 100, condition: "첫 게임 시작" },
    { id: "2", name: "스코어 마스터", description: "10000점 이상 달성", reward: 200, condition: "점수 10000 이상" },
  ])

  const [linkedGames, setLinkedGames] = useState<LinkedGame[]>([
    { id: "1", url: "https://example.com/game1", title: "My Other Game", description: "또 다른 재미있는 게임입니다" },
  ])

  const [uploadType, setUploadType] = useState<"new" | "update">("new")
  const [selectedGameForUpdate, setSelectedGameForUpdate] = useState("")
  const [updateNotice, setUpdateNotice] = useState("")
  const [isGameLinkModalOpen, setIsGameLinkModalOpen] = useState(false)
  const [editingGameLink, setEditingGameLink] = useState<LinkedGame | null>(null)
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set())

  // 새 게임 업로드 폼 데이터
  const [newGameData, setNewGameData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  })

  // 기존 게임 업데이트 폼 데이터
  const [updateGameData, setUpdateGameData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  })

  // 샘플 통계 데이터
  const stats = {
    totalPlayers: 15420,
    totalPlays: 89340,
    weeklyPlayers: 3240,
    weeklyPlays: 12450,
    averageRating: 4.5,
    totalEarnings: 25000,
  }

  const gameStats = [
    {
      id: "1",
      name: "Space Adventure",
      players: 5420,
      plays: 23450,
      rating: 4.5,
      earnings: 8500,
      category: "액션",
      description: "우주를 배경으로 한 스릴 넘치는 액션 게임입니다.",
      weeklyUsers: 1200,
      weeklyPlaysPerUser: 3.2,
      weeklyRating: 4.6,
      weeklyRank: 3,
      retention: 78,
      newUsers: 340,
    },
    {
      id: "2",
      name: "Puzzle Master",
      players: 3240,
      plays: 15420,
      rating: 4.2,
      earnings: 6200,
      category: "퍼즐",
      description: "두뇌를 자극하는 창의적인 퍼즐 게임입니다.",
      weeklyUsers: 890,
      weeklyPlaysPerUser: 2.8,
      weeklyRating: 4.3,
      weeklyRank: 7,
      retention: 85,
      newUsers: 180,
    },
    {
      id: "3",
      name: "Racing Fever",
      players: 6760,
      plays: 50470,
      rating: 4.7,
      earnings: 10300,
      category: "레이싱",
      description: "고속도로에서 펼쳐지는 짜릿한 레이싱 게임입니다.",
      weeklyUsers: 1850,
      weeklyPlaysPerUser: 4.1,
      weeklyRating: 4.8,
      weeklyRank: 1,
      retention: 92,
      newUsers: 520,
    },
  ]

  // MPcoin 계산 함수들
  const calculateWeeklyRewardTotal = () => {
    const basicTotal = rewards.first + rewards.second + rewards.third + rewards.top100 * 97 + rewards.basic * 400 // 101-500위는 400명
    const customTotal = customRewards.reduce((sum, reward) => {
      if (reward.type === "range" && reward.startRank && reward.endRank) {
        return sum + reward.reward * (reward.endRank - reward.startRank + 1)
      } else if (reward.type === "specific" && reward.specificRanks) {
        return sum + reward.reward * reward.specificRanks.length
      }
      return sum
    }, 0)
    return basicTotal + customTotal
  }

  const calculateAchievementTotal = () => {
    const baseTotal = achievements.reduce((sum, achievement) => sum + achievement.reward * 100, 0) // 예상 달성자 100명
    return baseTotal + baseTotal * 0.1 // 업적 보상 + 업적 보상*0.1
  }

  const totalNeededCoins = calculateWeeklyRewardTotal() + calculateAchievementTotal()
  const isOverBudget = totalNeededCoins > developerCoins

  const handleRewardUpdate = () => {
    if (isOverBudget) {
      alert("보유 MPcoin을 초과했습니다. 보상을 조정해주세요.")
      return
    }
    console.log("보상 업데이트:", rewards)
    alert("보상 설정이 저장되었습니다!")
  }

  const handleGameUpload = () => {
    if (uploadType === "new") {
      console.log("새 게임 업로드 완료")
      alert("새 게임이 업로드되었습니다! 1000 MPcoin이 지급되었습니다.")
    } else {
      console.log("게임 업데이트 완료:", { gameId: selectedGameForUpdate, notice: updateNotice })
      alert("게임이 업데이트되었습니다! 사용자들에게 공지가 전송됩니다.")
    }
  }

  const copyExistingContent = () => {
    const selectedGame = gameStats.find((game) => game.id === selectedGameForUpdate)
    if (selectedGame) {
      setUpdateGameData({
        title: selectedGame.name,
        description: selectedGame.description,
        image: null,
      })
    }
  }

  const handleGameTitleClick = () => {
    setUpdateGameData({ ...updateGameData, title: "" })
  }

  const handleAddAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      name: "",
      description: "",
      reward: 100,
      condition: "",
    }
    setAchievements([...achievements, newAchievement])
  }

  const handleUpdateAchievement = (id: string, field: keyof Achievement, value: string | number) => {
    setAchievements(
      achievements.map((achievement) => (achievement.id === id ? { ...achievement, [field]: value } : achievement)),
    )
  }

  const handleDeleteAchievement = (id: string) => {
    setAchievements(achievements.filter((achievement) => achievement.id !== id))
  }

  const handleAddCustomReward = () => {
    const newReward: CustomReward = {
      id: Date.now().toString(),
      type: "range",
      startRank: 501,
      endRank: 1000,
      reward: 10,
    }
    setCustomRewards([...customRewards, newReward])
  }

  const handleUpdateCustomReward = (id: string, field: keyof CustomReward, value: any) => {
    setCustomRewards(customRewards.map((reward) => (reward.id === id ? { ...reward, [field]: value } : reward)))
  }

  const handleDeleteCustomReward = (id: string) => {
    setCustomRewards(customRewards.filter((reward) => reward.id !== id))
  }

  const toggleGameExpansion = (gameId: string) => {
    const newExpanded = new Set<string>()
    if (!expandedGames.has(gameId)) {
      newExpanded.add(gameId)
    }
    setExpandedGames(newExpanded)
  }

  const handleAddGameLink = () => {
    setEditingGameLink(null)
    setIsGameLinkModalOpen(true)
  }

  const handleEditGameLink = (game: LinkedGame) => {
    setEditingGameLink(game)
    setIsGameLinkModalOpen(true)
  }

  const handleSaveGameLink = (gameData: Omit<LinkedGame, "id">) => {
    if (editingGameLink) {
      setLinkedGames(
        linkedGames.map((game) => (game.id === editingGameLink.id ? { ...gameData, id: editingGameLink.id } : game)),
      )
    } else {
      const newGame: LinkedGame = {
        ...gameData,
        id: Date.now().toString(),
      }
      setLinkedGames([...linkedGames, newGame])
    }
    setIsGameLinkModalOpen(false)
  }

  const handleDeleteGameLink = (id: string) => {
    setLinkedGames(linkedGames.filter((game) => game.id !== id))
  }

  const selectedGameInfo = gameStats.find((game) => game.id === selectedGameForUpdate)

  // 빈 슬롯 생성 (총 6개 - 2줄 × 3개)
  const emptySlots = Array.from({ length: 6 - linkedGames.length }, (_, index) => index)

  const handleOpenChart = (game: any) => {
    // 52주 데이터 생성
    const weeklyData = Array.from({ length: 52 }, (_, i) => ({
      week: i + 1,
      users: Math.floor(Math.random() * 500) + game.weeklyUsers - 200,
      playsPerUser: (Math.random() * 2 + game.weeklyPlaysPerUser - 1).toFixed(1),
      rating: (Math.random() * 1 + game.weeklyRating - 0.5).toFixed(1),
      rank: Math.floor(Math.random() * 10) + game.weeklyRank - 5,
      retention: Math.floor(Math.random() * 20) + game.retention - 10,
    }))

    const chartWindow = window.open("", "_blank", "width=1600,height=800")
    if (chartWindow) {
      chartWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${game.name} - 연간 통계</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              background: #f5f5f5; 
              margin: 0;
              overflow: hidden;
            }
            .container { 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              width: 1540px;
              height: 740px;
              position: fixed;
              top: 10px;
              left: 10px;
            }
            h1 { 
              color: #333; 
              text-align: center; 
              margin: 0 0 15px 0; 
              font-size: 24px;
            }
            .chart-container { 
              position: relative; 
              height: 320px; 
              width: 100%;
              margin-bottom: 20px;
            }
            .chart-title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              color: #555;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${game.name} - 연간 통계 (52주)</h1>
            
            <div class="chart-title">주간 이용자수 / 1인당 플레이 횟수 / 사용자 유지율</div>
            <div class="chart-container">
              <canvas id="statsChart1"></canvas>
            </div>
            
            <div class="chart-title">주간 평점 / 주간 순위</div>
            <div class="chart-container">
              <canvas id="statsChart2"></canvas>
            </div>
          </div>
          <script>
            const data = ${JSON.stringify(weeklyData)};
            
            // 첫 번째 그래프 - 큰 값들 (이용자수, 플레이횟수, 유지율)
            const ctx1 = document.getElementById('statsChart1').getContext('2d');
            new Chart(ctx1, {
              type: 'line',
              data: {
                labels: data.map(d => '주 ' + d.week),
                datasets: [
                  {
                    label: '주간 이용자수',
                    data: data.map(d => d.users),
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 2,
                    pointRadius: 1,
                    yAxisID: 'y'
                  },
                  {
                    label: '1인당 플레이 횟수',
                    data: data.map(d => parseFloat(d.playsPerUser)),
                    borderColor: '#00C851',
                    backgroundColor: 'rgba(0, 200, 81, 0.1)',
                    borderWidth: 2,
                    pointRadius: 1,
                    yAxisID: 'y1'
                  },
                  {
                    label: '사용자 유지율 (%)',
                    data: data.map(d => d.retention),
                    borderColor: '#E74C3C',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 1,
                    yAxisID: 'y2'
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: {
                    display: true,
                    title: { 
                      display: true, 
                      text: '주차',
                      font: { size: 12, weight: 'bold' }
                    },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { 
                      display: true, 
                      text: '이용자수',
                      font: { size: 11, weight: 'bold' },
                      color: '#FF6B35'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#FF6B35', font: { size: 10 } }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { 
                      display: true, 
                      text: '플레이 횟수',
                      font: { size: 11, weight: 'bold' },
                      color: '#00C851'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#00C851', font: { size: 10 } }
                  },
                  y2: {
                    type: 'linear',
                    display: false,
                    min: 0,
                    max: 100
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: { size: 11, weight: 'bold' }
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 11 }
                  }
                }
              }
            });

            // 두 번째 그래프 - 작은 값들 (평점, 순위)
            const ctx2 = document.getElementById('statsChart2').getContext('2d');
            new Chart(ctx2, {
              type: 'line',
              data: {
                labels: data.map(d => '주 ' + d.week),
                datasets: [
                  {
                    label: '주간 평점',
                    data: data.map(d => parseFloat(d.rating)),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 2,
                    pointRadius: 1,
                    yAxisID: 'y'
                  },
                  {
                    label: '주간 순위',
                    data: data.map(d => d.rank),
                    borderColor: '#8E44AD',
                    backgroundColor: 'rgba(142, 68, 173, 0.1)',
                    borderWidth: 2,
                    pointRadius: 1,
                    yAxisID: 'y1'
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: {
                    display: true,
                    title: { 
                      display: true, 
                      text: '주차',
                      font: { size: 12, weight: 'bold' }
                    },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { 
                      display: true, 
                      text: '평점',
                      font: { size: 11, weight: 'bold' },
                      color: '#FFD700'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#FFD700', font: { size: 10 } },
                    min: 0,
                    max: 5
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { 
                      display: true, 
                      text: '순위',
                      font: { size: 11, weight: 'bold' },
                      color: '#8E44AD'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#8E44AD', font: { size: 10 } },
                    min: 1,
                    max: 20
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: { size: 11, weight: 'bold' }
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    titleFont: { size: 12, weight: 'bold' },
                    bodyFont: { size: 11 }
                  }
                }
              }
            });
          </script>
        </body>
        </html>
      `)
      chartWindow.document.close()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            개발자 대시보드
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="statistics" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
            <TabsTrigger value="statistics">통계</TabsTrigger>
            <TabsTrigger value="upload">게임 관리</TabsTrigger>
            <TabsTrigger value="rewards">보상 설정</TabsTrigger>
            <TabsTrigger value="earnings">수익</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          {/* 통계 탭 */}
          <TabsContent value="statistics" className="flex-1 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 플레이어</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPlayers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">이번 주 +{stats.weeklyPlayers.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 플레이 횟수</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPlays.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">이번 주 +{stats.weeklyPlays.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageRating}</div>
                  <p className="text-xs text-muted-foreground">5점 만점</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>게임별 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameStats.map((game) => (
                    <div key={game.id} className="border rounded-lg">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleGameExpansion(game.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            {expandedGames.has(game.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                          <div>
                            <h3 className="font-semibold text-blue-600 hover:text-blue-800">{game.name}</h3>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>플레이어: {game.players.toLocaleString()}</span>
                              <span>플레이: {game.plays.toLocaleString()}</span>
                              <span>평점: {game.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenChart(game)
                            }}
                            className="flex items-center gap-1 bg-transparent text-xs h-7"
                          >
                            <BarChart className="w-3 h-3" />
                            그래프로 보기
                          </Button>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{game.earnings.toLocaleString()} MP</div>
                            <div className="text-sm text-gray-500">수익</div>
                          </div>
                        </div>
                      </div>

                      {expandedGames.has(game.id) && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{game.weeklyUsers}</div>
                              <div className="text-sm text-gray-600">주간 이용자수</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{game.weeklyPlaysPerUser}</div>
                              <div className="text-sm text-gray-600">1인당 플레이 횟수</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">{game.weeklyRating}</div>
                              <div className="text-sm text-gray-600">주간 평점</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{game.weeklyRank}위</div>
                              <div className="text-sm text-gray-600">주간 순위</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>사용자 유지율</span>
                                <span>{game.retention}%</span>
                              </div>
                              <Progress value={game.retention} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>신규 사용자</span>
                                <span>{game.newUsers}명</span>
                              </div>
                              <Progress value={(game.newUsers / game.weeklyUsers) * 100} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>평점 만족도</span>
                                <span>{((game.weeklyRating / 5) * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={(game.weeklyRating / 5) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 게임 관리 탭 */}
          <TabsContent value="upload" className="flex-1 overflow-y-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  게임 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    variant={uploadType === "new" ? "default" : "outline"}
                    onClick={() => setUploadType("new")}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />새 게임 업로드
                  </Button>
                  <Button
                    variant={uploadType === "update" ? "default" : "outline"}
                    onClick={() => setUploadType("update")}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    기존 게임 업데이트
                  </Button>
                </div>

                {uploadType === "new" && (
                  <Alert className="bg-green-50 border-green-200">
                    <Upload className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      새 게임을 업로드하면 1000 MPcoin을 받고 "NEW" 타이틀이 부여됩니다.
                    </AlertDescription>
                  </Alert>
                )}

                {uploadType === "update" && (
                  <div className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        기존 게임을 업데이트하고 사용자들에게 업데이트 공지를 보낼 수 있습니다.
                      </AlertDescription>
                    </Alert>

                    {/* 한 줄 배치 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="select-game">업데이트할 게임 선택</Label>
                        <Select value={selectedGameForUpdate} onValueChange={setSelectedGameForUpdate}>
                          <SelectTrigger>
                            <SelectValue placeholder="게임을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {gameStats.map((game) => (
                              <SelectItem key={game.id} value={game.id}>
                                {game.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="game-title">게임 타이틀</Label>
                          {selectedGameForUpdate && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyExistingContent}
                              className="flex items-center gap-1 bg-transparent text-xs h-6"
                            >
                              <Copy className="w-3 h-3" />
                              기존 내용 복사
                            </Button>
                          )}
                        </div>
                        <Input
                          id="game-title"
                          placeholder="게임 타이틀을 입력하세요"
                          value={updateGameData.title || selectedGameInfo?.name || ""}
                          onChange={(e) => setUpdateGameData({ ...updateGameData, title: e.target.value })}
                          onClick={handleGameTitleClick}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="game-category">카테고리</Label>
                        <div className="h-10 flex items-center px-3 bg-gray-100 rounded border text-gray-600">
                          {selectedGameInfo?.category || "게임을 선택하세요"} {selectedGameInfo && "(변경 불가)"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="update-notice">업데이트 공지사항</Label>
                      <Textarea
                        id="update-notice"
                        placeholder="사용자들에게 전달할 업데이트 내용을 입력하세요"
                        value={updateNotice}
                        onChange={(e) => setUpdateNotice(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  {uploadType === "new" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="game-title">게임 타이틀</Label>
                        <Input
                          id="game-title"
                          placeholder="게임 타이틀을 입력하세요"
                          value={newGameData.title}
                          onChange={(e) => setNewGameData({ ...newGameData, title: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="game-category">카테고리</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="action">액션</SelectItem>
                            <SelectItem value="puzzle">퍼즐</SelectItem>
                            <SelectItem value="racing">레이싱</SelectItem>
                            <SelectItem value="rpg">RPG</SelectItem>
                            <SelectItem value="arcade">아케이드</SelectItem>
                            <SelectItem value="strategy">전략</SelectItem>
                            <SelectItem value="simulation">시뮬레이션</SelectItem>
                            <SelectItem value="adventure">어드벤처</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="game-detail-description">게임 상세 내용 설명 (70자 내외)</Label>
                    <Textarea
                      id="game-detail-description"
                      placeholder="게임의 상세한 내용과 특징을 설명해주세요 (70자 내외)"
                      maxLength={70}
                      value={uploadType === "new" ? newGameData.description : updateGameData.description}
                      onChange={(e) => {
                        if (uploadType === "new") {
                          setNewGameData({ ...newGameData, description: e.target.value })
                        } else {
                          setUpdateGameData({ ...updateGameData, description: e.target.value })
                        }
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="game-file">게임 파일</Label>
                    <Input id="game-file" type="file" accept=".zip,.html,.js,.swf" />
                    <p className="text-xs text-gray-500">지원 형식: .zip, .html, .js, .swf</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="game-image">게임 이미지</Label>
                    <Input
                      id="game-image"
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        if (uploadType === "new") {
                          setNewGameData({ ...newGameData, image: file })
                        } else {
                          setUpdateGameData({ ...updateGameData, image: file })
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500">지원 형식: .jpg, .jpeg, .png, .gif, .webp</p>
                  </div>
                </div>
                <Button onClick={handleGameUpload} className="w-full">
                  {uploadType === "new" ? (
                    <>
                      <Upload className="w-4 h-4 mr-2" />새 게임 업로드 (+1000 MPcoin)
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      게임 업데이트 & 공지 발송
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 보상 설정 탭 */}
          <TabsContent value="rewards" className="flex-1 overflow-y-auto space-y-4">
            {/* MPcoin 현황 - 크기 축소 */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-800">사용 가능한 MPcoin</h3>
                  </div>
                  <div className="text-xl font-bold text-blue-600">{developerCoins.toLocaleString()} MP</div>
                </CardContent>
              </Card>

              <Card className={`${isOverBudget ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {isOverBudget ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Coins className="w-4 h-4 text-green-600" />
                    )}
                    <h3 className={`text-sm font-medium ${isOverBudget ? "text-red-800" : "text-green-800"}`}>
                      필요한 MPcoin
                    </h3>
                  </div>
                  <div className={`text-xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                    {totalNeededCoins.toLocaleString()} MP
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    주간 랭킹 보상의 합 + (업적 보상의 합 + 업적 보상의 합×0.1)
                  </div>
                  {isOverBudget && (
                    <div className="text-xs text-red-600 mt-1 flex items-center justify-between">
                      <span>{(totalNeededCoins - developerCoins).toLocaleString()} MP 초과</span>
                      <span className="text-xs text-gray-500">
                        (주간: {calculateWeeklyRewardTotal().toLocaleString()} + 업적:{" "}
                        {calculateAchievementTotal().toLocaleString()})
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {isOverBudget && (
              <Alert className="bg-red-50 border-red-200 py-4">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  보상 설정이 보유 MPcoin을 초과했습니다. 보상을 조정해주세요.
                </AlertDescription>
              </Alert>
            )}

            {/* 보상 설정 탭 */}
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">주간 랭킹 보상</TabsTrigger>
                <TabsTrigger value="achievements">업적 보상</TabsTrigger>
              </TabsList>

              {/* 주간 랭킹 보상 탭 */}
              <TabsContent value="weekly" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-800">주간 랭킹 보상 설정</CardTitle>
                    <p className="text-sm text-gray-600">각 순위별 MPcoin 보상을 설정하세요</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* 5개 보상을 1줄로 배치 */}
                    <div className="grid grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="first-reward" className="text-xs font-medium text-gray-700">
                          🥇 1위
                        </Label>
                        <Input
                          id="first-reward"
                          type="number"
                          value={rewards.first}
                          onChange={(e) => setRewards({ ...rewards, first: Number.parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="second-reward" className="text-xs font-medium text-gray-700">
                          🥈 2위
                        </Label>
                        <Input
                          id="second-reward"
                          type="number"
                          value={rewards.second}
                          onChange={(e) => setRewards({ ...rewards, second: Number.parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="third-reward" className="text-xs font-medium text-gray-700">
                          🥉 3위
                        </Label>
                        <Input
                          id="third-reward"
                          type="number"
                          value={rewards.third}
                          onChange={(e) => setRewards({ ...rewards, third: Number.parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="top100-reward" className="text-xs font-medium text-gray-700">
                          🏆 4-100위
                        </Label>
                        <Input
                          id="top100-reward"
                          type="number"
                          value={rewards.top100}
                          onChange={(e) => setRewards({ ...rewards, top100: Number.parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="basic-reward" className="text-xs font-medium text-gray-700">
                          📊 101-500위
                        </Label>
                        <Input
                          id="basic-reward"
                          type="number"
                          value={rewards.basic}
                          onChange={(e) => setRewards({ ...rewards, basic: Number.parseInt(e.target.value) || 0 })}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    {/* 직접 설정 - 최대 2개 제한 */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-800">직접 설정</h4>
                        <Button
                          onClick={handleAddCustomReward}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 bg-transparent h-7 text-xs"
                          disabled={customRewards.length >= 2}
                        >
                          <Plus className="w-3 h-3" />
                          추가 ({customRewards.length}/2)
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {customRewards.map((reward) => (
                          <div key={reward.id} className="p-2 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-6 gap-2 items-end">
                              <div>
                                <Label className="text-xs">타입</Label>
                                <Select
                                  value={reward.type}
                                  onValueChange={(value: "range" | "specific") =>
                                    handleUpdateCustomReward(reward.id, "type", value)
                                  }
                                >
                                  <SelectTrigger className="h-7 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="range">구간</SelectItem>
                                    <SelectItem value="specific">특정</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {reward.type === "range" ? (
                                <>
                                  <div>
                                    <Label className="text-xs">시작</Label>
                                    <Input
                                      type="number"
                                      value={reward.startRank || ""}
                                      onChange={(e) =>
                                        handleUpdateCustomReward(
                                          reward.id,
                                          "startRank",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">끝</Label>
                                    <Input
                                      type="number"
                                      value={reward.endRank || ""}
                                      onChange={(e) =>
                                        handleUpdateCustomReward(reward.id, "endRank", Number.parseInt(e.target.value))
                                      }
                                      className="h-7 text-xs"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="col-span-2">
                                  <Label className="text-xs">순위 (쉼표구분)</Label>
                                  <Input
                                    placeholder="예: 5,10,15"
                                    onChange={(e) => {
                                      const ranks = e.target.value
                                        .split(",")
                                        .map((r) => Number.parseInt(r.trim()))
                                        .filter((r) => !isNaN(r))
                                      handleUpdateCustomReward(reward.id, "specificRanks", ranks)
                                    }}
                                    className="h-7 text-xs"
                                  />
                                </div>
                              )}

                              <div>
                                <Label className="text-xs">보상</Label>
                                <Input
                                  type="number"
                                  value={reward.reward}
                                  onChange={(e) =>
                                    handleUpdateCustomReward(reward.id, "reward", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="h-7 text-xs bg-yellow-50 border-yellow-300 focus:border-yellow-500"
                                />
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomReward(reward.id)}
                                className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleRewardUpdate}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isOverBudget}
                    >
                      보상 설정 저장
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 업적 보상 탭 */}
              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-800">업적 보상 설정</CardTitle>
                        <p className="text-sm text-gray-600">게임 내 업적과 보상을 설정하세요</p>
                      </div>
                      <Button
                        onClick={handleAddAchievement}
                        size="sm"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4" />
                        업적 추가
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="p-3 border border-gray-200 rounded-lg space-y-2 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-800">업적 설정</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAchievement(achievement.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">업적 이름</Label>
                              <Input
                                value={achievement.name}
                                onChange={(e) => handleUpdateAchievement(achievement.id, "name", e.target.value)}
                                placeholder="업적 이름"
                                className="h-7 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">보상 (MPcoin)</Label>
                              <Input
                                type="number"
                                value={achievement.reward}
                                onChange={(e) =>
                                  handleUpdateAchievement(
                                    achievement.id,
                                    "reward",
                                    Number.parseInt(e.target.value) || 0,
                                  )
                                }
                                placeholder="보상"
                                className="h-7 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">업적 설명</Label>
                              <Textarea
                                value={achievement.description}
                                onChange={(e) => handleUpdateAchievement(achievement.id, "description", e.target.value)}
                                placeholder="설명"
                                className="text-sm resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={1}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">달성 조건</Label>
                              <Input
                                value={achievement.condition}
                                onChange={(e) => handleUpdateAchievement(achievement.id, "condition", e.target.value)}
                                placeholder="조건"
                                className="h-7 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {achievements.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        <p>설정된 업적이 없습니다.</p>
                        <p className="text-sm">업적 추가 버튼을 클릭하여 새로운 업적을 만들어보세요.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* 수익 탭 */}
          <TabsContent value="earnings" className="flex-1 overflow-y-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  MPcoin 수익 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {stats.totalEarnings.toLocaleString()} MPcoin
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>게임 업로드 보너스:</span>
                    <span>3,000 MP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best 게임 보너스:</span>
                    <span>4,000 MP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>플레이어 활동 보상:</span>
                    <span>18,000 MP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 설정 탭 */}
          <TabsContent value="settings" className="flex-1 overflow-y-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  개발자 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="dev-name">개발자명</Label>
                  <Input id="dev-name" placeholder="개발자명을 입력하세요" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dev-email">이메일</Label>
                  <Input id="dev-email" type="email" placeholder="이메일을 입력하세요" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dev-bio">소개</Label>
                  <Input id="dev-bio" placeholder="간단한 소개를 입력하세요" />
                </div>
                <Button className="w-full">설정 저장</Button>
              </CardContent>
            </Card>

            {/* 개발자가 만든 다른 게임 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  개발자가 만든 다른 게임
                </CardTitle>
                <p className="text-sm text-gray-600">다른 플랫폼의 게임을 링크할 수 있습니다</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {/* 기존 링크된 게임들 */}
                  {linkedGames.map((game) => (
                    <div
                      key={game.id}
                      className="h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-gray-50 transition-colors group relative"
                      onClick={() => handleEditGameLink(game)}
                    >
                      <div className="text-center">
                        <ExternalLink className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-700 truncate w-full">{game.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{game.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGameLink(game.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 h-5 w-5 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}

                  {/* 빈 슬롯들 */}
                  {emptySlots.map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={handleAddGameLink}
                    >
                      <div className="text-center">
                        <Plus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">게임 링크 추가</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 게임 링크 모달 */}
        <GameLinkModal
          isOpen={isGameLinkModalOpen}
          onClose={() => setIsGameLinkModalOpen(false)}
          onSave={handleSaveGameLink}
          editingGame={editingGameLink}
        />
      </DialogContent>
    </Dialog>
  )
}
