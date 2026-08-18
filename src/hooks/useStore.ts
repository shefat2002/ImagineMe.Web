import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { childService } from '@/lib/api/child';
import {
  StoreItemDto,
  PurchaseDto,
  PurchaseRequest,
} from '@/types/api';

export const useStore = () => {
  const queryClient = useQueryClient();

  // Store items
  const {
    data: storeItems = [],
    isLoading: storeItemsLoading,
    error: storeItemsError,
  } = useQuery<StoreItemDto[]>({
    queryKey: ['child', 'store', 'items'],
    queryFn: () => childService.getStoreItems(),
  });

  // My purchases
  const {
    data: myPurchases = [],
    isLoading: myPurchasesLoading,
    error: myPurchasesError,
  } = useQuery<PurchaseDto[]>({
    queryKey: ['child', 'store', 'my-items'],
    queryFn: () => childService.getMyPurchases(),
  });

  // Request purchase mutation
  const requestPurchaseMutation = useMutation<PurchaseDto, Error, PurchaseRequest>({
    mutationFn: (data) => childService.requestPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['child', 'store', 'my-items'] });
    },
  });

  // Get owned items (approved purchases)
  const ownedItems = myPurchases.filter(
    (purchase) => purchase.status === 1 // Approved
  );

  // Get pending purchases
  const pendingPurchases = myPurchases.filter(
    (purchase) => purchase.status === 0 // Pending
  );

  // Get rejected purchases
  const rejectedPurchases = myPurchases.filter(
    (purchase) => purchase.status === 2 // Rejected
  );

  return {
    // Data
    storeItems,
    myPurchases,
    ownedItems,
    pendingPurchases,
    rejectedPurchases,

    // Loading states
    storeItemsLoading,
    myPurchasesLoading,

    // Error states
    storeItemsError,
    myPurchasesError,

    // Mutations
    requestPurchase: requestPurchaseMutation.mutateAsync,

    // Mutation states
    isRequesting: requestPurchaseMutation.isPending,
  };
};