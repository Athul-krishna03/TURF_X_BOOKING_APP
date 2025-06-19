"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Badge } from "../../ui/badge"
import { Plus, X, Trophy } from "lucide-react"

interface GamesSelectorProps {
    selectedGames: string[]
    onGamesChange: (games: string[]) => void
    showCard?: boolean
    title?: string
}

const popularGames = [
    "Cricket",
    "Football"
]

export default function GamesSelector({
    selectedGames,
    onGamesChange,
    showCard = true,
    title = "Available courts",
}: GamesSelectorProps) {
    const [customGame, setCustomGame] = useState("")

    const toggleGame = (game: string) => {
        if (selectedGames.includes(game)) {
            onGamesChange(selectedGames.filter((g) => g !== game))
        } else {
            onGamesChange([...selectedGames, game])
        }
    }

    const addCustomGame = () => {
        if (customGame.trim() && !selectedGames.includes(customGame.trim())) {
            onGamesChange([...selectedGames, customGame.trim()])
            setCustomGame("")
        }
    }

    const removeGame = (game: string) => {
        onGamesChange(selectedGames.filter((g) => g !== game))
    }

    const gamesContent = (
        <div className="space-y-6">
            {/* Popular Games */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Available courts(Click to add/remove)
                </Label>
                <div className="flex flex-wrap gap-2">
                    {popularGames.map((game) => (
                        <Badge
                            key={game}
                            variant={selectedGames.includes(game) ? "default" : "outline"}
                            className={`cursor-pointer transition-all ${
                                selectedGames.includes(game)
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "hover:bg-blue-50 hover:border-blue-300"
                            }`}
                            onClick={() => toggleGame(game)}
                        >
                            {game}
                            {selectedGames.includes(game) && <X className="w-3 h-3 ml-1" />}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Custom Game Input */}
            <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Add Custom Game/Sport</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={customGame}
                        onChange={(e) => setCustomGame(e.target.value)}
                        className="flex-1 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Futsal, Kabaddi, Box Cricket"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomGame())}
                    />
                    <Button
                        type="button"
                        onClick={addCustomGame}
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
                        disabled={!customGame.trim()}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Selected Games */}
            {selectedGames.length > 0 && (
                <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Selected Games ({selectedGames.length})
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {selectedGames.map((game, index) => (
                            <Badge 
                                key={index} 
                                variant="secondary" 
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1"
                            >
                                {game}
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeGame(game)}
                                    className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    if (!showCard) {
        return gamesContent
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl text-gray-800">
                    <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>{gamesContent}</CardContent>
        </Card>
    )
}