import React from 'react';
import { Card, CardProps } from 'antd';
import { ArtContent } from '../ArtContent';
import { AuctionView, AuctionViewState, useArt, useCreators } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { MetaAvatar } from '../MetaAvatar';
import { AuctionCountdown } from '../AuctionNumbers';

import { useAuctionStatus } from './hooks/useAuctionStatus';
import { useTokenList } from '../../contexts/tokenList';
import { LiveAuctionViewState } from '../../views/home/components/SalesList';

export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
}

export const AuctionRenderCard = (props: AuctionCard) => {
  const { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const creators = useCreators(auctionView);
  const name = art?.title || ' ';
  const state = auctionView.state;
  const tokenInfo = useTokenList().mainnetTokens.filter(m => m.address == auctionView.auction.info.tokenMint)[0]
  const { status, amount } = useAuctionStatus(auctionView);

  const card = (
    <Card hoverable={true} className={`auction-render-card`} bordered={false}>
      <div className={'card-art-info'}>
        <div className={'card-artist-info'}>
          <MetaAvatar creators={creators.length ? [creators[0]] : undefined} />
          <span className={'artist-name'}>
            {state === AuctionViewState.Ended ?
              'Xem kết quả' : state === AuctionViewState.Upcoming ? 'Chi tiết' :
                'Tham gia'
            }
          </span>
        </div>
        <div className={'art-content-wrapper'}>
          <ArtContent
            className="auction-image no-events"
            preview={false}
            pubkey={id}
            allowMeshRender={false}
          />
        </div>
        <div className={'art-name'}>{name}</div>
        <div className={'art-auction-info'}>

          <span className={'info-message'}>{auctionView.auction.info.endedAt !== undefined ? 'Thời gian còn lại' : ''}</span>
          {auctionView.auction.info.endedAt !== undefined ?
            <AuctionCountdown auctionView={auctionView} labels={false} /> : <div style={{ height: '60.67px' }}></div>
          }
        </div>
      </div>
      <div className="card-bid-info text-center">
        <AmountLabel
          containerStyle={{ flexDirection: 'row', }}
          amount={amount}
          iconSize={24}
          tokenInfo={tokenInfo}
        />
      </div>
    </Card>
  );

  return card;
};
