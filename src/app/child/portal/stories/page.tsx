'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { childService } from '@/lib/api/child'
import { StoryDto } from '@/types/api'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function StoriesPage() {
  const { user } = useAuth()
  const [selectedStory, setSelectedStory] = useState<StoryDto | null>(null)

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => childService.getStories(),
    enabled: !!user && user.userType === 3
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load stories</div>
      </div>
    )
  }

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <button
          onClick={() => setSelectedStory(null)}
          className="mb-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          ← Back to Stories
        </button>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold mb-6 text-purple-800">{selectedStory.title}</h1>

          {selectedStory.coverImageUrl && (
            <img
              src={selectedStory.coverImageUrl}
              alt={selectedStory.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedStory.contentPayload}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={async () => {
                try {
                  const result = await childService.logStoryActivity({ storyId: selectedStory.id, coinsEarned: 10 })
                  alert(`🎉 Story completed! +${result.coinsEarned} coins!`)
                } catch (error) {
                  alert('Failed to log activity')
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600"
            >
              ✅ Mark as Complete (+10 coins)
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">
          📚 Story Library
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories?.map((story) => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              {story.coverImageUrl ? (
                <img
                  src={story.coverImageUrl}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-6xl">📖</span>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {story.title}
                </h3>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {story.status === 1 ? '✅ Published' : '📝 Draft'}
                  </span>
                  <span className="text-purple-600 font-semibold">
                    Read →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stories?.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl">No stories available yet!</p>
            <p className="mt-2">Check back soon for new adventures.</p>
          </div>
        )}
      </div>
    </div>
  )
}