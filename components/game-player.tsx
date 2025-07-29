"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Maximize2, Minimize2, X, Coins } from "lucide-react"

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
}

interface GamePlayerProps {
  isOpen: boolean
  onClose: () => void
  game: Game | null
  onRankingOpen?: () => void
  userCoins: number
  onCoinsUpdate: (newAmount: number) => void
  playedGames: number[]
  onGamePlayed: (gameId: number) => void
}

export default function GamePlayer({
  isOpen,
  onClose,
  game,
  onRankingOpen,
  userCoins,
  onCoinsUpdate,
  playedGames,
  onGamePlayed,
}: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  if (!game) return null

  const isFirstPlay = !playedGames.includes(game.id)
  const canAffordToPlay = userCoins >= 50

  const handleGameStart = () => {
    if (isFirstPlay) {
      // 첫 플레이 - 200 MPcoin 보상
      onCoinsUpdate(userCoins + 200)
      onGamePlayed(game.id)
      setGameStarted(true)
      // alert 제거
    } else {
      // 재플레이 - 50 MPcoin 차감
      if (!canAffordToPlay) {
        return
      }
      onCoinsUpdate(userCoins - 50)
      setGameStarted(true)
      // alert 제거
    }
  }

  const handleGameInput = () => {
    // 사용자가 첫 입력을 했을 때 호출되는 함수
    if (!isFirstPlay && !gameStarted) {
      handleGameStart()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? "max-w-full h-full" : "max-w-4xl"} p-0`}>
        {/* Header - 고정 높이 */}
        <DialogHeader className={`border-b flex-shrink-0 ${isFullscreen ? "p-1 h-8" : "p-3 h-14"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} className={isFullscreen ? "h-6 w-6 p-0" : ""}>
                <ArrowLeft className={isFullscreen ? "w-3 h-3" : "w-4 h-4"} />
              </Button>
              <DialogTitle className={isFullscreen ? "text-xs font-medium" : ""}>{game.title}</DialogTitle>
              <div className={`flex items-center gap-1 ml-2 ${isFullscreen ? "text-xs" : "text-sm"}`}>
                <Coins className={isFullscreen ? "w-3 h-3" : "w-4 h-4"} />
                <span className="text-yellow-500">{userCoins.toLocaleString()} MP</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={`md:hidden ${isFullscreen ? "h-6 w-6 p-0" : ""}`}
            >
              <X className={isFullscreen ? "w-3 h-3" : "w-4 h-4"} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* 게임 플레이 영역 */}
          <div className={`bg-gray-900 flex items-center justify-center relative ${isFullscreen ? "flex-1" : "h-96"}`}>
            {/* 전체화면 버튼 - 우측 상단 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            <div className="text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-300 mb-4">게임이 여기에 로드됩니다</p>

              {/* 보상/비용 안내 */}
              {isFirstPlay ? (
                <div
                  className="mb-4 p-3 bg-green-600/20 rounded-lg border border-green-500/30 cursor-pointer hover:bg-green-600/30 transition-colors"
                  onClick={handleGameStart}
                >
                  <div className="flex items-center justify-center gap-2 text-green-300 mb-1">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">첫 플레이 보너스!</span>
                  </div>
                  <div className="text-sm">+200 MPcoin 획득</div>
                  <div className="text-xs text-green-200 mt-1">클릭하여 게임 시작</div>
                </div>
              ) : (
                <div
                  className={`mb-4 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30 transition-colors ${
                    canAffordToPlay ? "cursor-pointer hover:bg-orange-600/30" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={canAffordToPlay ? handleGameStart : undefined}
                >
                  <div className="flex items-center justify-center gap-2 text-orange-300 mb-1">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">플레이 비용</span>
                  </div>
                  <div className="text-sm">-50 MPcoin</div>
                  {canAffordToPlay ? (
                    <div className="text-xs text-orange-200 mt-1">클릭하여 게임 시작</div>
                  ) : (
                    <div className="text-xs text-red-300 mt-1">MPcoin이 부족합니다</div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-center">
                {onRankingOpen && (
                  <Button
                    variant="outline"
                    onClick={onRankingOpen}
                    className="text-white border-white hover:bg-white hover:text-black bg-transparent"
                  >
                    랭킹 보기
                  </Button>
                )}
              </div>

              {!canAffordToPlay && !isFirstPlay && (
                <div className="mt-3 text-red-300 text-sm">MPcoin이 부족합니다. 충전이 필요합니다.</div>
              )}
            </div>
          </div>

          {/* 광고 영역 - 고정 높이 */}
          <div className={`border-t bg-gray-50 flex-shrink-0 ${isFullscreen ? "p-2 h-16" : "p-3 h-24"}`}>
            <div
              className={`grid gap-3 h-full ${isFullscreen ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1 md:grid-cols-3"}`}
            >
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-gray-400 ${isFullscreen ? "text-xs" : "text-xs"}`}>광고 영역 1</div>
                  <div className={`text-gray-300 ${isFullscreen ? "text-xs" : "text-xs"}`}>Google Ads</div>
                </div>
              </div>
              {isFullscreen && (
                <>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 2</div>
                      <div className="text-gray-300 text-xs">Google Ads</div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 3</div>
                      <div className="text-gray-300 text-xs">Google Ads</div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 4</div>
                      <div className="text-gray-300 text-xs">Google Ads</div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 5</div>
                      <div className="text-gray-300 text-xs">Google Ads</div>
                    </div>
                  </div>
                </>
              )}
              {!isFullscreen && (
                <>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 2</div>
                      <div className="text-xs text-gray-300">Google Ads</div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 text-xs">광고 영역 3</div>
                      <div className="text-xs text-gray-300">Google Ads</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
