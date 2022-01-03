import { InstructionsModal } from '../InstructionsModal';
import React from 'react';
import { LABELS } from '../../constants';
import { ConnectButton } from '@oyster/common';

interface HowToBuyModalProps {
  buttonClassName: string;
  onClick?: any;
}

export const HowToBuyModal: React.FC<HowToBuyModalProps> = ({
  buttonClassName,
  onClick,
}) => {
  return (
    <InstructionsModal
      buttonClassName={buttonClassName}
      buttonText="Xem cách sử dụng"
      modalTitle={`Mua NFT như thế nào?`}
      cardProps={[
        {
          title: 'Tạo ví SOL',
          imgSrc: '/modals/how-to-buy-1.svg',
          description: `SOL là tiền điện tử mà chúng tôi sử dụng để mua hàng trên nền tảng Solana. Để giữ SOL của bạn an toàn, bạn sẽ cần một ví tiền điện tử — chúng tôi khuyên bạn nên sử dụng một ví có tên là Phantom. Chỉ cần truy cập trang web của Phantom, cài đặt tiện ích mở rộng Chrome và tạo tài khoản..`,
        },
        {
          title: 'Nạp tiền vào ví của bạn',
          imgSrc: '/modals/how-to-buy-2.svg',
          description: `Để nạp tiền vào ví của bạn, bạn sẽ cần mua SOL. Cách dễ nhất là sử dụng thẻ tín dụng trên FTX Pay — một dịch vụ đã là một phần của ví Phantom mới của bạn. Mở ví của bạn, chạm vào “Gửi tiền SOL” và chọn “Gửi tiền từ FTX”. Một cửa sổ mới sẽ mở ra, nơi bạn có thể tạo tài khoản FTX và mua SOL.`,
        },
        {
          title: `Kết nối ví của bạn`,
          imgSrc: '/modals/how-to-buy-3.jpg',
          description: `Để kết nối ví của bạn, hãy nhấn vào “kết nối ví” tại đây trên trang web. Chọn tùy chọn Phantom và ví của bạn sẽ kết nối. Sau đó, bạn có thể bắt đầu tham gia các hoạt động của chúng tôi đã cung cấp.`,
          endElement: <ConnectButton className={'secondary-btn'} />,
        },
      ]}
      onClick={onClick}
    />
  );
};
