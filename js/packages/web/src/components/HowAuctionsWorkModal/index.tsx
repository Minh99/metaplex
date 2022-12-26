import { InstructionsModal } from '../InstructionsModal';
import React from 'react';
import { LABELS } from '../../constants';

interface HowAuctionsWorkModalProps {
  buttonClassName: string;
}

export const HowAuctionsWorkModal: React.FC<HowAuctionsWorkModalProps> = ({
  buttonClassName,
}) => {
  return (
    <InstructionsModal
      buttonClassName={buttonClassName}
      buttonText="Cách đấu giá hoạt động"
      modalTitle="Cách đấu giá hoạt động"
      cardProps={[
        {
          title: 'Đặt giá thầu',
          description: `Khi bạn tìm thấy NFT bạn muốn sở hữu, hãy đặt giá thầu trên trang của phiên đấu giá đó. Số  Sol mà bạn đấu giá sẽ được lưu lại trong phiên đấu giá. Nếu bạn thắng số  Sol đó sẽ mất và bạn được NFT, ngược lại nếu bạn thua cuộc bạn sẽ mất phí tham gia đấu giá và được hoàn lại số  Sol đã tham gia trong phiên đấu giá đó.`,
          imgSrc: '/modals/how-auctions-work-1.jpg',
        },
        {
          title: 'Thắng một phiên đấu giá',
          description: `Hãy theo dõi xem phiên đấu giá đó diễn ra như thế nào, để nắm bắt nhanh tình hình xem có ai trả giá cao hơn mình không.`,
          imgSrc: '/modals/how-auctions-work-2.jpg',
        },
        {
          title: 'Đổi NFT',
          description: `Nếu bạn may mắn trở thành người chiến thắng trong phiên đấu giá, bạn sẽ phải đối NFT đó với số tiền mà bạn đã đấu giá, sản phẩm (NFT) sẽ được ủy quyền hoàn toàn cho bạn.`,
          imgSrc: '/modals/how-auctions-work-3.jpg',
        },
      ]}
    />
  );
};
