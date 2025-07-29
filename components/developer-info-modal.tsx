"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, ExternalLink, User } from "lucide-react"

interface DeveloperInfoModalProps {
  isOpen: boolean
  onClose: () => void
  developerName: string
}

export default function DeveloperInfoModal({ isOpen, onClose, developerName }: DeveloperInfoModalProps) {
  // 샘플 개발자 정보
  const developerInfo = {
    name: "GameMaster Studio",
    email: "contact@gamemaster.com",
    bio: "창의적이고 재미있는 게임을 만드는 인디 게임 개발팀입니다.",
    linkedGames: [
      { id: "1", url: "https://example.com/game1", title: "My Other Game", description: "또 다른 재미있는 게임입니다" },
      {
        id: "2",
        url: "https://steam.com/mygame",
        title: "Steam Adventure",
        description: "스팀에서 출시한 어드벤처 게임",
      },
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            개발자 정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 개발자 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                개발자 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="dev-name-view">개발자명</Label>
                <Input id="dev-name-view" value={developerInfo.name} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dev-email-view">이메일</Label>
                <Input id="dev-email-view" value={developerInfo.email} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dev-bio-view">소개</Label>
                <Input id="dev-bio-view" value={developerInfo.bio} readOnly className="bg-gray-50" />
              </div>
            </CardContent>
          </Card>

          {/* 개발자가 만든 다른 게임 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                개발자가 만든 다른 게임
              </CardTitle>
              <p className="text-sm text-gray-600">이 개발자가 다른 플랫폼에서 출시한 게임들</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {developerInfo.linkedGames.map((game) => (
                  <div
                    key={game.id}
                    className="h-24 bg-gray-100 rounded-lg border border-gray-300 flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => window.open(game.url, "_blank")}
                  >
                    <div className="text-center">
                      <ExternalLink className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs font-medium text-gray-700 truncate w-full">{game.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{game.description}</div>
                    </div>
                  </div>
                ))}
                {/* 빈 슬롯 표시 */}
                {Array.from({ length: 6 - developerInfo.linkedGames.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-400">등록된 게임 없음</div>
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
