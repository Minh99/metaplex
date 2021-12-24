import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Carousel, Col, List, Row, Skeleton } from 'antd';
import { AuctionCard } from '../../components/AuctionCard';
import { Connection } from '@solana/web3.js';
import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import {
  AuctionView as Auction,
  useArt,
  useAuction,
  useBidsForAuction,
  useCreators,
  useExtendedArt,
} from '../../hooks';
import { ArtContent } from '../../components/ArtContent';

import { format } from 'timeago.js';

import {
  AuctionState,
  formatTokenAmount,
  Identicon,
  MetaplexModal,
  shortenAddress,
  StringPublicKey,
  toPublicKey,
  useConnection,
  useConnectionConfig,
  useMint,
  useMeta,
  BidStateType,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintInfo, Token } from '@solana/spl-token';
import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import useWindowDimensions from '../../utils/layout';
import { CheckOutlined } from '@ant-design/icons';
import { ArtType } from '../../types';
import { MetaAvatar, MetaAvatarDetailed } from '../../components/MetaAvatar';
import { AmountLabel } from '../../components/AmountLabel';
import { ClickToCopy } from '../../components/ClickToCopy';
import { useTokenList } from '../../contexts/tokenList';
import { Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { CardLoader, ThreeDots } from '../../components/MyLoader';
import { ArtCard } from '../../components/ArtCard';


export const AuctionItem = ({
  item,
  index,
  size,
  active,
}: {
  item: AuctionViewItem;
  index: number;
  size: number;
  active?: boolean;
}) => {
  const id = item.metadata.pubkey;
  const style: React.CSSProperties = {
    transform:
      index === 0
        ? ''
        : `translate(${index * 15}px, ${-40 * index}px) scale(${Math.max(
          1 - 0.2 * index,
          0,
        )})`,
    transformOrigin: 'right bottom',
    position: index !== 0 ? 'absolute' : 'static',
    zIndex: -1 * index,
    marginLeft: size > 1 && index === 0 ? '0px' : 'auto',
    background: 'black',
    boxShadow: 'rgb(0 0 0 / 10%) 12px 2px 20px 14px',
    aspectRatio: '1/1',
  };
  return (
    <ArtContent
      pubkey={id}
      className="artwork-image stack-item"
      style={style}
      active={active}
      allowMeshRender={true}
    />
  );
};

export const AuctionView = () => {
  const { width } = useWindowDimensions();
  const { id } = useParams<{ id: string }>();
  const { endpoint } = useConnectionConfig();
  const auction = useAuction(id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const creators = useCreators(auction);
  const { pullAuctionPage } = useMeta();
  const wallet = useWallet();
  useEffect(() => {
    if (!auction?.auction.info.ended()){
      const timer = setTimeout(() => {
        pullAuctionPage(id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  let edition = '';
  if (art.type === ArtType.NFT) {
    edition = 'Unique';
  } else if (art.type === ArtType.Master) {
    edition = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    edition = `${art.edition} of ${art.supply}`;
  }
  const nftCount = auction?.items.flat().length;
  const winnerCount = auction?.items.length;
  const isOpen =
    auction?.auction.info.bidState.type === BidStateType.OpenEdition;
  const hasDescription = data === undefined || data.description === undefined;
  const description = data?.description;
  const attributes = data?.attributes;
  const [isLoading, setIsLoading] = useState(false);
  const tokenInfo = useTokenList()?.mainnetTokens.filter(
    m => m.address == auction?.auction.info.tokenMint,
  )[0];

  const items = [
    ...(auction?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auction?.participationItem,
  ].map((item, index, arr) => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return (
      <AuctionItem
        key={item.metadata.pubkey}
        item={item}
        index={index}
        size={arr.length}
        active={index === currentIndex}
      />
    );
  });
  // console.log(wallet.publicKey?.toBase58());

  // console.log(creators[0].address);

  var taker = auction?.auction?.info?.bidState?.bids[0]?.key;
  // creators[0].address


  if (width < 768) {
    return (
      <Row
        justify="center"
        gutter={[48, 0]}
        className="auction-mobile-container"
      >
        <Col span={24} className={'img-cont-500'}>
          <div className="auction-view" style={{ minHeight: 300 }}>
            <Carousel
              autoplay={false}
              afterChange={index => setCurrentIndex(index)}
            >
              {items}
            </Carousel>
          </div>
        </Col>
        <Col className="auction-mobile-section">
          <h2 className="art-title">
            {art.title || <Skeleton paragraph={{ rows: 0 }} />}
          </h2>

          <div className="info-container">
            <div className={'info-component'}>
              <h6 className={'info-title'}>Phiên bản</h6>
              <span>
                {(auction?.items.length || 0) > 1 ? 'Multiple' : edition}
              </span>
            </div>
            {/* <div className={'info-component'}>
              <h6 className={'info-title'}>Số người thắng</h6>
              <span>
                {winnerCount === undefined ? (
                  <Skeleton paragraph={{ rows: 0 }} />
                ) : isOpen ? (
                  'Unlimited'
                ) : (
                  winnerCount
                )}
              </span>
            </div> */}
            <div className={'info-component'}>
              <h6 className={'info-title'}>NFTS</h6>
              <span>
                {nftCount === undefined ? (
                  <Skeleton paragraph={{ rows: 0 }} />
                ) : isOpen ? (
                  'Open'
                ) : (
                  nftCount
                )}
              </span>
            </div>
          </div>
        </Col>

        <Col className="auction-mobile-section" span={24}>
          {!auction && <Skeleton paragraph={{ rows: 6 }} />}
          {auction && (
            <AuctionCard auctionView={auction} hideDefaultAction={false} />
          )}
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <h6 className={'info-title'}>Details</h6>
          <div className="description">
            <p className={'about-nft-collection a-description'}>
              {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
              {description ||
                (winnerCount !== undefined && (
                  <div style={{ fontStyle: 'italic' }}>
                    No description provided.
                  </div>
                ))}
            </p>
          </div>
        </Col>
        {attributes && (
          <Col
            className="auction-mobile-section about-nft-collection a-attributes"
            span={24}
          >
            <h6>Attributes</h6>
            <List grid={{ column: 4 }}>
              {attributes.map((attribute, index) => (
                <List.Item key={`${attribute.value}-${index}`}>
                  <Card title={attribute.trait_type}>{attribute.value}</Card>
                </List.Item>
              ))}
            </List>
          </Col>
        )}
        <Col className="auction-mobile-section" span={24}>
          <div className={'info-view'}>
            <h6 className={'info-title'}>Artists</h6>
            <div style={{ display: 'flex' }}>
              <MetaAvatarDetailed creators={creators} />
            </div>
          </div>
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <div className={'info-view'}>
            <h6 className={'info-title'} style={{ textAlign: 'center' }}>Xem thông tin</h6>
            <div style={{ display: 'flex' }}>
              <Button
                className="tag"
                onClick={() => window.open(art.uri || '', '_blank')}
              >
                Arweave
              </Button>
              <Button
                className="tag"
                onClick={() => {
                  const cluster = endpoint.name;
                  const explorerURL = new URL(
                    `account/${art?.mint || ''}`,
                    'https://explorer.solana.com',
                  );
                  if (!cluster.includes('mainnet')) {
                    explorerURL.searchParams.set('cluster', cluster);
                  }
                  window.open(explorerURL.href, '_blank');
                }}
              >
                Solana
              </Button>
            </div>
          </div>
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <AuctionBids auctionView={auction} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row justify="center" ref={ref} gutter={[48, 0]} style={{ fontSize: '1.4rem' }} >
        <Col span={24} md={10} className={'img-cont-500'}>
          <div className="auction-view" style={{ minHeight: 300 }}>
            <Carousel
              autoplay={false}
              afterChange={index => setCurrentIndex(index)}
            >
              {items}
            </Carousel>
          </div>
          <h6 className={'about-nft-collection'}>
            Thông tin mô tả {nftCount === 1 ? 'NFT' : 'COLLECTION'}
          </h6>
          <p className={'about-nft-collection a-description'}>
            {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
            {description ||
              (winnerCount !== undefined && (
                <div style={{ fontStyle: 'italic' }}>
                  No description provided.
                </div>
              ))}
          </p>
          {attributes && (
            <div className={'about-nft-collection a-attributes'}>
              <h6>Attributes</h6>
              <List grid={{ column: 4 }}>
                {attributes.map((attribute, index) => (
                  <List.Item key={`${attribute.value}-${index}`}>
                    <Card title={attribute.trait_type}>{attribute.value}</Card>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
          {/* {auctionData[id] && (
            <>
              <h6>About this Auction</h6>
              <p>{auctionData[id].description.split('\n').map((t: string) => <div>{t}</div>)}</p>
            </>
          )} */}
        </Col>

        <Col span={24} md={14}>
          <h2 className="art-title">
            {art.title || <Skeleton paragraph={{ rows: 0 }} />}
          </h2>
          <Row gutter={[44, 0]}>
            <Col span={12} md={16}>
              <div className={'info-container'}>
                <div className={'info-component'}>
                  <h6 className={'info-info'}>Tác giả</h6>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{<MetaAvatar creators={creators} />}</span>
                    <Tooltip title="Sao chép địa chỉ">
                      <div
                        style={{
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          color: '#FFFFFF',
                          display: 'flex',
                          marginTop: '1rem',
                        }}
                        onClick={() =>
                          navigator.clipboard.writeText(creators[0]?.address || '')
                        }
                      >
                        <CopyOutlined />
                        &nbsp;{creators[0]?.address ? shortenAddress(creators[0]?.address) : ""}
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <div className={'info-component'}>
                  <h6 className={'info-info'}>Phiên bản </h6>
                  <span>
                    {(auction?.items.length || 0) > 1 ? 'Multiple' : edition}
                  </span>
                </div>
                <div className={'info-component'}>
                  <h6 className={'info-info'}>NFTS</h6>
                  <span>
                    {nftCount === undefined ? (
                      <Skeleton paragraph={{ rows: 0 }} />
                    ) : isOpen ? (
                      'Open'
                    ) : (
                      nftCount
                    )}
                  </span>
                </div>
                <div className={'info-component'}>
                  <h6 className={'info-info'}>Phương thức thanh toán</h6>
                  <div style={{ display: 'flex' }}>
                    <span>
                      {nftCount === undefined ? (
                        <Skeleton paragraph={{ rows: 0 }} />
                      ) : (
                        `${tokenInfo?.name || 'Custom Token'} ($${tokenInfo?.symbol || 'CUSTOM'
                        })`
                      )}
                    </span>
                    <ClickToCopy
                      className="copy-pubkey"
                      copyText={
                        tokenInfo
                          ? tokenInfo?.address
                          : auction?.auction.info.tokenMint || ''
                      }
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12} md={8} className="view-on-container" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center' }}>
              <div className="info-view-container">
                <div className="info-view">
                  <h6 className="info-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Xem thông tin</h6>
                  <div style={{ display: 'flex' }}>
                    <Button
                      className="tag"
                      onClick={() => window.open(art.uri || '', '_blank')}
                    >
                      Arweave
                    </Button>
                    <Button
                      className="tag"
                      onClick={() => {
                        const cluster = endpoint.name;
                        const explorerURL = new URL(
                          `account/${art?.mint || ''}`,
                          'https://explorer.solana.com',
                        );
                        if (!cluster.includes('mainnet')) {
                          explorerURL.searchParams.set('cluster', cluster);
                        }
                        window.open(explorerURL.href, '_blank');
                      }}
                    >
                      Solana
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          {!auction && <Skeleton paragraph={{ rows: 6 }} />}
          {auction && (
            <AuctionCard auctionView={auction} hideDefaultAction={false} />
          )}
          <a style={{ fontSize: '1.4rem', float:'right' }} onClick={() => {
            setIsLoading(true)
            setTimeout(function() {
              setIsLoading(false)
            }, 2000);
            pullAuctionPage(id)
          }}>Cập nhật lịch sử</a>
          {isLoading && 
            <div style={{height: '20px'}}>
              <ThreeDots />
            </div>
          }
          { <AuctionBids auctionView={auction} />}
          {/* {!auction?.isInstantSale && <AuctionBids auctionView={auction} />} */}
        </Col>
      </Row>
    );
  }
};

const BidLine = (props: {
  bid: any;
  index: number;
  mint?: MintInfo;
  isCancelled?: boolean;
  isActive?: boolean;
  mintKey: string;
}) => {
  const { bid, index, mint, isCancelled, isActive, mintKey } = props;
  const { publicKey } = useWallet();
  const bidder = bid.info.bidderPubkey;
  const isme = publicKey?.toBase58() === bidder;
  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == mintKey,
  )[0];

  // Get Twitter Handle from address
  const connection = useConnection();
  const [bidderTwitterHandle, setBidderTwitterHandle] = useState('');
  useEffect(() => {
    const getTwitterHandle = async (
      connection: Connection,
      bidder: StringPublicKey,
    ): Promise<string | undefined> => {
      try {
        const [twitterHandle] = await getHandleAndRegistryKey(
          connection,
          toPublicKey(bidder),
        );
        setBidderTwitterHandle(twitterHandle);
      } catch (err) {
        console.warn(`err`);
        return undefined;
      }
    };
    getTwitterHandle(connection, bidder);
  }, [bidderTwitterHandle]);
  const { width } = useWindowDimensions();
  // console.log(format(bid.info.lastBidTimestamp.toNumber() * 1000));

  if (width < 768) {
    return (
      <Row className="mobile-bid-history">
        <div className="bid-info-container">
          <div className="bidder-info-container">
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />
            {bidderTwitterHandle ? (
              <a
                target="_blank"
                title={shortenAddress(bidder)}
                href={`https://twitter.com/${bidderTwitterHandle}`}
              >{`@${bidderTwitterHandle}`}</a>
            ) : (
              shortenAddress(bidder)
            )}
          </div>
          <div>
            {!isCancelled && (
              <div className={'flex'}>
                {isme && (
                  <>
                    <CheckOutlined />
                    &nbsp;
                  </>
                )}
                <AmountLabel
                  style={{ marginBottom: 0, fontSize: '16px' }}
                  containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                  iconSize={24}
                  amount={formatTokenAmount(bid.info.lastBid, mint)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="bid-info-container">
          {format(bid.info.lastBidTimestamp.toNumber() * 1000)}
        </div>
      </Row>
    );
  } else {
    return (
      <Row className={'bid-history'}>
        {isCancelled && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 1,
              background: 'grey',
              top: 'calc(50% - 1px)',
              zIndex: 2,
            }}
          />
        )}
        <Col span={8}>
          {!isCancelled && (
            <div className={'flex '}>
              {isme && (
                <>
                  <CheckOutlined />
                  &nbsp;
                </>
              )}
              <AmountLabel
                style={{ marginBottom: 0, fontSize: '16px' }}
                containerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                tokenInfo={tokenInfo}
                iconSize={24}
                amount={formatTokenAmount(bid.info.lastBid, mint)}
              />
            </div>
          )}
        </Col>
        <Col span={8} style={{ opacity: 0.7 }}>
          {format(bid.info.lastBidTimestamp.toNumber() * 1000).replace(/days ago|day ago|hour ago|hours ago|minute ago|minutes ago|second ago|seconds ago/, function (x) {
            if (x == "days ago" || x == "day ago") {
              return "ngày trước";
            } if (x == "hours ago" || x == "hour ago") {
              return "giờ trước";
            } if (x == "minutes ago" || x == "minute ago") {
              return "phút trước";
            } else {
              return "giây trước";
            }
          })}
        </Col>
        <Col span={8}>
          <div className={'flex-right'}>
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />{' '}
            <span style={{ opacity: 0.7 }}>
              {bidderTwitterHandle ? (
                <Row className="pubkey-row">
                  <a
                    target="_blank"
                    title={shortenAddress(bidder)}
                    href={`https://twitter.com/${bidderTwitterHandle}`}
                  >{`@${bidderTwitterHandle}`}</a>
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                  />
                </Row>
              ) : (
                <Row className="pubkey-row">
                  {shortenAddress(bidder)}
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                  />
                </Row>
              )}
            </span>
          </div>
        </Col>
      </Row>
    );
  }
};

export const AuctionBids = ({
  auctionView,
}: {
  auctionView?: Auction | null;
}) => {
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');
  const mint = useMint(auctionView?.auction.info.tokenMint);
  const { width } = useWindowDimensions();
  const wallet = useWallet();
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const {isLoading, pullAuctionPage } = useMeta();
  const { id } = useParams<{ id: string }>();

  // setTimeout(function () {
  //   pullAuctionPage(id)
  // }, 2000);
  // useEffect(()=>{
  //   pullAuctionPage(id)
  // },[]);

  const winnersCount = auctionView?.auction.info.bidState.max.toNumber() || 0;
  const activeBids = auctionView?.auction.info.bidState.bids || [];
  const activeBidders = useMemo(() => {
    return new Set(activeBids.map(b => b.key));
  }, [activeBids]);
  const auctionState = auctionView
    ? auctionView.auction.info.state
    : AuctionState.Created;
  const bidLines = useMemo(() => {
    let activeBidIndex = 0;
    return bids.map((bid, index) => {
      const isCancelled =
        (index < winnersCount && !!bid.info.cancelled) ||
        (auctionState !== AuctionState.Ended && !!bid.info.cancelled);

      const line = (
        <BidLine
          bid={bid}
          index={activeBidIndex}
          key={index}
          mint={mint}
          isCancelled={isCancelled}
          isActive={!bid.info.cancelled}
          mintKey={auctionView?.auction.info.tokenMint || ''}
        />
      );

      if (!isCancelled) {
        activeBidIndex++;
      }

      return line;
    });
  }, [auctionState, bids, activeBidders]);

  if (!auctionView || bids.length < 1) return null;

  return (
    <Row>
      <Col className="bids-lists" style={{ marginTop: '2rem' }}>
        {auctionView.isInstantSale ?
            <>
              <h6 style={{ wordSpacing: '3px', marginTop: '2rem' }} className={'info-title'}> 
               { auctionView.auction.info.bidState.bids[0]?.key === wallet.publicKey?.toBase58() ? 
                  "Bạn đã mua sản phẩm này" : 
                  auctionView.auctionManager.authority === wallet.publicKey?.toBase58() ? 
                    auctionView.auction.info.state !== 1 ? "Sản phẩm đã được bán" : "Đã có người muốn mua sản phẩm này" :
                    "Đã có người mua sản phẩm này"
               }
               </h6>
              {
                auctionView.auctionManager.authority === wallet.publicKey?.toBase58() ?
                <span>{ auctionView.auction.info.state == 1 && "Vui lòng đợi người mua xác nhận!"} </span> :
                <span></span>
              }
            </>
          :
          <>
            <h6 style={{ wordSpacing: '3px', height: '50px' }} className={'info-title'}> Lịch sử đấu giá </h6>
          </>
        }

        {bidLines.slice(0, 10)}
        {bids.length > 10 && (
          <div
            className="full-history"
            onClick={() => setShowHistoryModal(true)}
            style={{
              cursor: 'pointer',
            }}
          >
            Hiển thị toàn bộ lịch sử đấu giá
          </div>
        )}
        <MetaplexModal
          visible={showHistoryModal}
          onCancel={() => setShowHistoryModal(false)}
          title="Lịch sử đấu giá"
          bodyStyle={{
            background: 'unset',
            boxShadow: 'unset',
            borderRadius: 0,
          }}
          centered
          width={width < 768 ? width - 10 : 600}
        >
          <div
            style={{
              maxHeight: 600,
              overflowY: 'scroll',
              width: '100%',
            }}
          >
            {bidLines}
          </div>
        </MetaplexModal>
      </Col>
    </Row>
  );
};
