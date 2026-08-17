'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { childService } from '@/lib/api/child'
import { MiniGameContentDto, MiniGameContentDetailDto } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function GamesPage() {
  const { user } = useAuth()
  const [selectedGame, setSelectedGame] = useState<MiniGameContentDetailDto | null>(null)
  const [gameActive, setGameActive] = useState(false)
  const [gameScore, setGameScore] = useState(0)

  const { data: games, isLoading, error } = useQuery({
    queryKey: ['minigames'],
    queryFn: () => childService.listMiniGames(),
    enabled: !!user && user.userType === 3
  })

  const { data: gameDetails } = useQuery({
    queryKey: ['minigame', selectedGame?.id],
    queryFn: () => childService.getMiniGameDetails(selectedGame!.id),
    enabled: !!selectedGame
  })

  const logGameMutation = useMutation({
    mutationFn: (data: { gameType: string; score: number; durationMinutes: number; coinsEarned: number }) =>
      childService.logGameActivity(data.gameType, data.score, data.durationMinutes, data.coinsEarned)
  })

  const handleGameStart = (game: MiniGameContentDto) => {
    if (gameDetails && gameDetails.id === game.id) {
      setSelectedGame(gameDetails)
      setGameActive(true)
      setGameScore(0)
    }
  }

  const handleGameComplete = async (durationMinutes: number) => {
    const coinsEarned = Math.min(Math.round(gameScore / 10), 50)

    try {
      await logGameMutation.mutateAsync({
        gameType: selectedGame!.gameType,
        score: gameScore,
        durationMinutes,
        coinsEarned
      })

      alert(`🎮 Game complete! Score: ${gameScore}, +${coinsEarned} coins!`)
      setGameActive(false)
      setSelectedGame(null)
      setGameScore(0)
    } catch (error) {
      alert('Failed to log game activity')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load games</div>
      </div>
    )
  }

  if (selectedGame && gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => {
                setGameActive(false)
                setSelectedGame(null)
                setGameScore(0)
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              ← Back to Games
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold mb-4 text-green-800">{selectedGame.title}</h1>

            <p className="text-gray-600 mb-6">{selectedGame.description}</p>

            {selectedGame.thumbnailUrl && (
              <img
                src={selectedGame.thumbnailUrl}
                alt={selectedGame.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎮 Game Active!</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Score
                </label>
                <input
                  type="number"
                  value={gameScore}
                  onChange={(e) => setGameScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your score"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Played (minutes)
                </label>
                <input
                  type="number"
                  id="gameDuration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="How long did you play?"
                  min="1"
                />
              </div>

              <button
                onClick={() => {
                  const duration = parseInt((document.getElementById('gameDuration') as HTMLInputElement).value) || 1
                  handleGameComplete(duration)
                }}
                disabled={gameScore <= 0}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Score & Earn Coins 🏆
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💰 Coin Rewards</h4>
              <p className="text-sm text-gray-600">
                Earn 1 coin for every 10 points scored (max 50 coins per game)!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-800">
          🎮 Game Zone
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games?.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                childService.getMiniGameDetails(game.id).then(details => {
                  setSelectedGame(details)
                })
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              {game.thumbnailUrl ? (
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                  <span className="text-6xl">🎮</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {game.gameType}
                  </span>
                  <span className={game.status === 1 ? 'text-green-600' : 'text-yellow-600'}>
                    {game.status === 1 ? '✅ Active' : '🔧 Coming Soon'}
                  </span>
                </div>

                {game.status === 1 && (
                  <button className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600">
                    Play Now 🎮
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {games?.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-xl">No games available yet!</p>
            <p className="mt-2">Check back soon for fun games!</p>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6">
          <h3 className="text-xl font-bold text-orange-800 mb-2">🏆 How to Earn Coins</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• Play games and submit your score</li>
            <li>• Earn 1 coin for every 10 points scored</li>
            <li>• Maximum 50 coins per game session</li>
            <li>• Complete games to unlock store items!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}