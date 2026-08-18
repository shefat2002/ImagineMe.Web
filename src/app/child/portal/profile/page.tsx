'use client';

import { useState, useEffect } from 'react';
import { childService } from '@/lib/api/child';
import { ChildProfileDto, ChildStatsDto } from '@/types/api';

export default function ChildProfilePage() {
  const [profile, setProfile] = useState<ChildProfileDto | null>(null);
  const [stats, setStats] = useState<ChildStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [rewardResult, setRewardResult] = useState<{ coins: number; streak: number; message: string } | null>(null);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, statsData] = await Promise.all([
          childService.getProfile(),
          childService.getStats(),
        ]);
        setProfile(profileData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const claimDailyReward = async () => {
    setClaiming(true);
    try {
      const result = await childService.claimDailyReward();
      setRewardResult({
        coins: result.coinsAwarded,
        streak: result.currentStreak,
        message: result.message,
      });

      // Update profile and stats after claiming reward
      const [updatedProfile, updatedStats] = await Promise.all([
        childService.getProfile(),
        childService.getStats(),
      ]);
      setProfile(updatedProfile);
      setStats(updatedStats);
    } catch (error: any) {
      console.error('Failed to claim daily reward:', error);
      setRewardResult({
        coins: 0,
        streak: profile?.currentStreak || 0,
        message: error.response?.data?.message || 'Failed to claim reward. Try again tomorrow!',
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🌟 My Profile 🌟</h1>
        <p className="text-gray-600 text-lg">Welcome back, {profile?.username}!</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-6xl shadow-lg">
              {profile?.avatarState ? '🎭' : '👤'}
            </div>
            <button
              onClick={() => setShowAvatarEditor(!showAvatarEditor)}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
            >
              ✏️
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{profile?.username}</h2>
              <p className="text-gray-600">Member since {new Date(profile?.createdAt || '').toLocaleDateString()}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-1">🪙</div>
                <div className="text-2xl font-bold text-yellow-600">{profile?.coins}</div>
                <div className="text-sm text-gray-600">Coins</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-orange-600">{profile?.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-center">
                <div className="text-3xl mb-1">📖</div>
                <div className="text-2xl font-bold text-blue-600">{stats?.storiesRead}</div>
                <div className="text-sm text-gray-600">Stories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Reward Claim */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🎁 Daily Reward 🎁</h3>
          <p className="text-gray-700 mb-6">Come back every day to build your streak and earn bonus coins!</p>

          {!rewardResult ? (
            <button
              onClick={claimDailyReward}
              disabled={claiming}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 hover:scale-105 disabled:scale-95 shadow-lg"
            >
              {claiming ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin">⏳</span>
                  <span>Claiming...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>🪙 +10 Coins</span>
                  <span>|</span>
                  <span>🔥 +1 Streak</span>
                </span>
              )}
            </button>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-2">
                {rewardResult.coins > 0 ? '🎉' : '😊'}
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">{rewardResult.message}</p>
              <p className="text-gray-600">
                {rewardResult.coins > 0 && `You earned ${rewardResult.coins} coins! `}
                Current streak: {rewardResult.streak} days 🔥
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 My Statistics 📊</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-blue-600">{stats?.storiesRead}</div>
            <div className="text-gray-600">Stories Read</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🧠</div>
            <div className="text-3xl font-bold text-purple-600">{stats?.quizzesTaken}</div>
            <div className="text-gray-600">Quizzes Taken</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎮</div>
            <div className="text-3xl font-bold text-green-600">{stats?.gamesPlayed}</div>
            <div className="text-gray-600">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold text-yellow-600">{stats?.totalCoinsSpent}</div>
            <div className="text-gray-600">Coins Spent</div>
          </div>
        </div>
      </div>

      {/* Avatar Editor (Simple placeholder) */}
      {showAvatarEditor && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">🎨 Customize Avatar 🎨</h3>
          <p className="text-gray-600 mb-4">Choose your avatar style:</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {['👤', '😀', '😎', '🤩', '🦊', '🐱', '🐶', '🦁', '🐸', '🦋', '🌈', '⭐', '🎭', '🚀', '🎮', '🎯'].map((emoji, index) => (
              <button
                key={index}
                onClick={async () => {
                  try {
                    await childService.updateAvatar({ avatarState: emoji });
                    const updatedProfile = await childService.getProfile();
                    setProfile(updatedProfile);
                    setShowAvatarEditor(false);
                  } catch (error) {
                    console.error('Failed to update avatar:', error);
                  }
                }}
                className={`text-4xl p-4 rounded-xl transition-all duration-200 hover:scale-110 ${
                  profile?.avatarState === emoji ? 'bg-purple-200 ring-4 ring-purple-400' : 'bg-gray-100 hover:bg-purple-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}