import { AuctionView } from '../../../hooks';
import { useInstantSaleState } from './useInstantSaleState';

export const useActionButtonContent = (auctionView: AuctionView): string => {
  const {
    isInstantSale,
    canClaimItem,
    canClaimPurchasedItem,
    canEndInstantSale,
  } = useInstantSaleState(auctionView);

  if (!isInstantSale) {
    return 'Đặt giá thầu';
  }

  if (canClaimPurchasedItem) {
    return 'Yêu cầu mua';
  }

  if (canClaimItem) {
    return 'Yêu cầu mặt hàng';
  }

  if (canEndInstantSale) {
    return 'Kết thúc và nhận lại sản phẩm';
  }

  return 'Mua ngay';
};
