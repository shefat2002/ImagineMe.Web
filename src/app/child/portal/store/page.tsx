'use client';

import { useState, useEffect } from 'react';
import { childService } from '@/lib/api/child';
import { StoreItemDto, PurchaseDto } from '@/types/api';

export default function ChildStorePage() {
  const [storeItems, setStoreItems] = useState<StoreItemDto[]>([]);
  const [myPurchases, setMyPurchases] = useState<PurchaseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'store' | 'owned'>('store');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [items, purchases, profile] = await Promise.all([
          childService.getStoreItems(),
          childService.getMyPurchases(),
          childService.getProfile(),
        ]);
        setStoreItems(items);
        setMyPurchases(purchases);
        setUserCoins(profile.coins);
      } catch (error) {
        console.error('Failed to load store data:', error);
        setMessage({ type: 'error', text: 'Failed to load store items. Please try again!' });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePurchaseRequest = async (itemId: string, itemName: string, price: number) => {
    if (userCoins < price) {
      setMessage({ type: 'error', text: `Not enough coins! You need ${price} coins but only have ${userCoins}.` });
      return;
    }

    setPurchasing(itemId);
    try {
      const purchase = await childService.requestPurchase({ storeItemId: itemId });

      // Refresh data
      const [updatedPurchases, updatedProfile] = await Promise.all([
        childService.getMyPurchases(),
        childService.getProfile(),
      ]);
      setMyPurchases(updatedPurchases);
      setUserCoins(updatedProfile.coins);

      setMessage({
        type: 'success',
        text: `Purchase request sent for "${itemName}"! Waiting for parent approval. 🎁`
      });
    } catch (error: any) {
      console.error('Failed to request purchase:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to request purchase. Please try again!'
      });
    } finally {
      setPurchasing(null);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return '⏳ Pending';
      case 1: return '✅ Approved';
      case 2: return '❌ Rejected';
      default: return '❓ Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Reward Store 🛒</h1>
        <p className="text-gray-600 text-lg">Spend your coins on awesome rewards!</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-yellow-100 px-6 py-3 rounded-full shadow-md">
          <span className="text-3xl animate-bounce">🪙</span>
          <span className="text-2xl font-bold text-yellow-700">{userCoins} Coins</span>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-xl shadow-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{message.type === 'success' ? '✅' : '❌'}</span>
            <p className="font-medium">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto hover:scale-110 transition-transform"
            >
              ✖️
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white rounded-xl p-2 shadow-md">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
            activeTab === 'store'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          🏪 Store Items
        </button>
        <button
          onClick={() => setActiveTab('owned')}
          className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
            activeTab === 'owned'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          🎁 My Items
        </button>
      </div>

      {/* Store Items Tab */}
      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Item Image/Preview */}
              <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                {item.assetUrl ? (
                  <img
                    src={item.assetUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">🎁</div>
                )}
              </div>

              {/* Item Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🪙</span>
                    <span className="text-2xl font-bold text-yellow-600">{item.priceInCoins}</span>
                  </div>
                  <button
                    onClick={() => handlePurchaseRequest(item.id, item.name, item.priceInCoins)}
                    disabled={purchasing === item.id || userCoins < item.priceInCoins}
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                      purchasing === item.id || userCoins < item.priceInCoins
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105'
                    }`}
                  >
                    {purchasing === item.id ? (
                      <span className="flex items-center space-x-2">
                        <span className="animate-spin">⏳</span>
                        <span>Requesting...</span>
                      </span>
                    ) : userCoins < item.priceInCoins ? (
                      '❌ Not Enough Coins'
                    ) : (
                      '🛍️ Request Purchase'
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {userCoins < item.priceInCoins
                    ? `You need ${item.priceInCoins - userCoins} more coins!`
                    : 'You have enough coins! 🎉'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owned Items Tab */}
      {activeTab === 'owned' && (
        <div className="space-y-6">
          {myPurchases.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Items Yet</h3>
              <p className="text-gray-600 mb-6">You haven't purchased any items. Start earning coins by reading stories and taking quizzes!</p>
              <button
                onClick={() => setActiveTab('store')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-all duration-200"
              >
                🏪 Browse Store
              </button>
            </div>
          ) : (
            <>
              {/* Pending Requests */}
              {myPurchases.filter(p => p.status === 0).length > 0 && (
                <div className="bg-yellow-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">⏳ Pending Requests</h3>
                  <div className="space-y-3">
                    {myPurchases
                      .filter(p => p.status === 0)
                      .map((purchase) => (
                        <div
                          key={purchase.id}
                          className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            {purchase.storeItemAssetUrl ? (
                              <img
                                src={purchase.storeItemAssetUrl}
                                alt={purchase.storeItemName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-3xl">
                                🎁
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-800">{purchase.storeItemName}</h4>
                              <p className="text-sm text-gray-600">
                                Requested on {new Date(purchase.requestedAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium text-yellow-700">
                                Price: {purchase.priceInCoins} coins
                              </p>
                            </div>
                          </div>
                          <div className="text-yellow-600 font-medium">
                            ⏳ Waiting for parent approval
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Approved Items */}
              {myPurchases.filter(p => p.status === 1).length > 0 && (
                <div className="bg-green-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4">✅ My Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myPurchases
                      .filter(p => p.status === 1)
                      .map((purchase) => (
                        <div
                          key={purchase.id}
                          className="bg-white rounded-xl p-4 shadow flex items-center space-x-4"
                        >
                          {purchase.storeItemAssetUrl ? (
                            <img
                              src={purchase.storeItemAssetUrl}
                              alt={purchase.storeItemName}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-3xl">
                              🎁
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-800">{purchase.storeItemName}</h4>
                            <p className="text-sm text-green-600">
                              Approved on {purchase.completedAt ? new Date(purchase.completedAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Rejected Items */}
              {myPurchases.filter(p => p.status === 2).length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 shadow-lg border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-800 mb-4">❌ Declined Requests</h3>
                  <div className="space-y-3">
                    {myPurchases
                      .filter(p => p.status === 2)
                      .map((purchase) => (
                        <div
                          key={purchase.id}
                          className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            {purchase.storeItemAssetUrl ? (
                              <img
                                src={purchase.storeItemAssetUrl}
                                alt={purchase.storeItemName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-3xl">
                                🎁
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-800">{purchase.storeItemName}</h4>
                              <p className="text-sm text-gray-600">
                                Requested on {new Date(purchase.requestedAt).toLocaleDateString()}
                              </p>
                              {purchase.rejectionReason && (
                                <p className="text-sm text-red-600 mt-1">
                                  Reason: {purchase.rejectionReason}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-red-600 font-medium">
                            ❌ Rejected
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}