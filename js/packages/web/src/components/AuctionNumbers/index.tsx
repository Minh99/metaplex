import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';

import {
  formatTokenAmount,
  useMint,
  fromLamports,
  CountdownState,
  PriceFloorType,
} from '@oyster/common';
import { AuctionView, AuctionViewState, useBidsForAuction } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { useAuctionCountdown } from '../../hooks/useAuctionCountdown';
import { useTokenList } from '../../contexts/tokenList';

export const AuctionCountdown = (props: {
  auctionView: AuctionView;
  labels: boolean;
}) => {
  const { auctionView } = props;
  // console.log(auctionView);
  
  const state = useAuctionCountdown(auctionView);
  const ended = isEnded(state);
  // const ended = isEnded(state);
  
  if (state?.seconds !== undefined && state.minutes == 0 && state.seconds <= 5 && state.seconds >= 1) {
    window.location.reload();
  }
  // const stop = () => {
  //   const a =  setEndNow(1,2,3,4);
  //   isEnded();
  // }

  if (!props.labels) {
    return <Countdown state={state} />;
  }
  return (
    <Col span={ended ? 24 : 10}>
      <LabeledCountdown state={state} />
    </Col>
  );
};

export const AuctionNumbers = (props: {
  auctionView: AuctionView;
  hideCountdown?: boolean;
  showAsRow?: boolean;
  displaySymbol?: boolean;
}) => {
  const { auctionView } = props;
  const state = useAuctionCountdown(auctionView);
  const bids = useBidsForAuction(auctionView.auction.pubkey);
  const mintInfo = useMint(auctionView.auction.info.tokenMint);
  const participationFixedPrice =
    auctionView.auctionManager.participationConfig?.fixedPrice || 0;
  const participationOnly =
    auctionView.auctionManager.numWinners.toNumber() === 0;
  const priceFloor =
    auctionView.auction.info.priceFloor.type === PriceFloorType.Minimum
      ? auctionView.auction.info.priceFloor.minPrice?.toNumber() || 0
      : 0;
  const isUpcoming = auctionView.state === AuctionViewState.Upcoming;
  const isStarted = auctionView.state === AuctionViewState.Live;

  const tokenInfo = useTokenList().mainnetTokens.filter(m=>m.address == auctionView.auction.info.tokenMint)[0]
  const ended = isEnded(state);
  return (
    <div style={{ maxWidth: 350 }}>
      {(!ended || auctionView.isInstantSale) && (
        <>
          {(isUpcoming || bids.length === 0 || auctionView.isInstantSale) && (
            <AmountLabel
              displaySymbol={tokenInfo?.symbol || "CUSTOM"}
              style={{ marginBottom: props.showAsRow ? 0 : 10 }}
              title={auctionView.isInstantSale ? 'Giá' : 'Giá khởi điểm'}
              tokenInfo = {tokenInfo}
              amount={fromLamports(
                participationOnly ? participationFixedPrice : priceFloor,
                mintInfo,
              )}
              width='55px'
              height='55px'
            />
          )}
          {!auctionView.isInstantSale && isStarted && bids.length > 0 && (
            <AmountLabel
            displaySymbol={tokenInfo?.symbol || "CUSTOM"}
              style={{ marginBottom: props.showAsRow ? 0 : 10 }}
              containerStyle={{
                flexDirection: props.showAsRow ? ' row' : 'column',
              }}
              title="GIÁ CAO NHẤT HIỆN TẠI"
              tokenInfo = {tokenInfo}
              amount={formatTokenAmount(bids[0].info.lastBid, mintInfo)}
              width='55px'
              height='55px'
            />
          )}
        </>
      )}
      {!ended && !props.hideCountdown ? (
        <AuctionCountdown auctionView={auctionView} labels={true} />
      ) : null}
    </div>
  );
};

const isEnded = (state?: CountdownState) =>
  state?.days === 0 &&
  state?.hours === 0 &&
  state?.minutes === 0 &&
  state?.seconds === 0;

const Countdown = ({ state }: { state?: CountdownState }) => {
  let localState = state;
  if (!localState) {
    localState = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  return (
    <Row
      style={{ width: '100%', flexWrap: 'nowrap' }}
      className={'no-label-cd'}
    >
      {localState.days > 0 && (
        <Col>
          <div className="cd-number">
            {localState.days}
            <span style={{ opacity: 0.5, paddingLeft: '0.3rem' }}>Ngày</span>
          </div>
        </Col>
      )}
      <Col>
        <div className="cd-number">
          {localState.hours}
          <span style={{ opacity: 0.5, paddingLeft: '0.3rem' }}>Giờ</span>
        </div>
      </Col>
      <Col>
        <div className="cd-number">
          {localState.minutes}
          <span style={{ opacity: 0.5, paddingLeft: '0.3rem' }}>Phút</span>
        </div>
      </Col>
      {!localState.days && (
        <Col>
          <div className="cd-number">
            {localState.seconds}
            <span style={{ opacity: 0.5, paddingLeft: '0.3rem' }}>Giây</span>
          </div>
        </Col>
      )}
    </Row>
  );
};

const LabeledCountdown = ({ state }: { state?: CountdownState }) => {
  return (
    <>
      <div style={{ width: '100%' }}>
        <>
          <div
            className="info-header"
            style={{
              margin: '12px 0',
              fontSize: 18,
            }}
          >
            Time left
          </div>
          {state &&
            (isEnded(state) ? (
              <Row style={{ width: '100%' }}>
                <div className="cd-number">This auction has ended</div>
              </Row>
            ) : (
              <Row style={{ width: '100%', flexWrap: 'nowrap' }}>
                {state && state.days > 0 && (
                  <Col>
                    <div className="cd-number">
                      {state.days}
                      <span style={{ opacity: 0.5 }}>:</span>
                    </div>
                    <div className="cd-label">days</div>
                  </Col>
                )}
                <Col>
                  <div className="cd-number">
                    {state.hours}
                    <span style={{ opacity: 0.5 }}>:</span>
                  </div>
                  <div className="cd-label">hour</div>
                </Col>
                <Col>
                  <div className="cd-number">
                    {state.minutes}
                    {state.days === 0 && (
                      <span style={{ opacity: 0.5 }}>:</span>
                    )}
                  </div>
                  <div className="cd-label">mins</div>
                </Col>
                {!state.days && (
                  <Col>
                    <div className="cd-number">{state.seconds}</div>
                    <div className="cd-label">secs</div>
                  </Col>
                )}
              </Row>
            ))}
        </>
      </div>
    </>
  );
};
