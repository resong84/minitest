"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink } from "lucide-react"

interface LinkedGame {
  id: string
  url: string
  title: string
  description: string
  image?: string
}

interface GameLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (gameData: Omit<LinkedGame, "id">) => void
  editingGame: LinkedGame | null
}

export default function GameLinkModal({ isOpen, onClose, onSave, editingGame }: GameLinkModalProps) {
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
  })

  const [errors, setErrors] = useState({
    url: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (editingGame) {
      setFormData({
        url: editingGame.url,
        title: editingGame.title,
        description: editingGame.description,
      })
    } else {
      setFormData({
        url: "",
        title: "",
        description: "",
      })
    }
    setErrors({ url: "", title: "", description: "" })
  }, [editingGame, isOpen])

  const validateForm = () => {
    const newErrors = { url: "", title: "", description: "" }
    let isValid = true

    if (!formData.url.trim()) {
      newErrors.url = "URL을 입력해주세요"
      isValid = false
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = "올바른 URL 형식을 입력해주세요"
      isValid = false
    }

    if (!formData.title.trim()) {
      newErrors.title = "게임 제목을 입력해주세요"
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description = "게임 설명을 입력해주세요"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            {editingGame ? "게임 링크 수정" : "게임 링크 추가"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="game-url">게임 URL *</Label>
            <Input
              id="game-url"
              type="url"
              placeholder="https://example.com/my-game"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              className={errors.url ? "border-red-500" : ""}
            />
            {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="game-title">게임 제목 *</Label>
            <Input
              id="game-title"
              placeholder="게임 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="game-description">게임 설명 *</Label>
            <Textarea
              id="game-description"
              placeholder="게임에 대한 간단한 설명을 입력하세요"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingGame ? "수정" : "추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
