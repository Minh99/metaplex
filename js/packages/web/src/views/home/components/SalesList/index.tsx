import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import Masonry from 'react-masonry-css';

import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { Banner } from '../../../../components/Banner';
import { HowToBuyModal } from '../../../../components/HowToBuyModal';

import { useSales } from './hooks/useSales';
import SaleCard from './components/SaleCard';
import { useAuctionsList } from './hooks/useAuctionsList';
import { usePacksList } from './hooks/usePacksList';
import { sortSalesByDate, isAdmin } from './hooks/useSales/utils';
import { Spinner } from '../../../../components/Loader';
import { Sale } from './types';

const { TabPane } = Tabs;
const { Content } = Layout;

export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};
function getSale(
  activeKey1: LiveAuctionViewState,
):{
  sales: Array<Sale>;
}  {
  const activeKey = activeKey1;
  // console.log("activeKey => "+ activeKey);
  
  const { auctions } = useAuctionsList(activeKey);
  // const packs = usePacksList();
  // console.log(packs);
  
  const sales = sortSalesByDate([...auctions]);

  return { sales }
}

export const SalesListView = () => {
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  // const [ oldActiveKey, changeActiveKey ] = useState(activeKey);
  const { isLoading, pullAllSiteData , pullAllMetadata} = useMeta();
  const wallet = useWallet();
  const { connected } = useWallet();
  const { sales, hasResaleAuctions } = useSales(activeKey);
  const isAdminn = isAdmin(wallet?.publicKey?.toBase58());

  useEffect(() => {
  }, [isLoading, sales]);

  return (
    <>
      <Banner
        src="https://santhemes.com/blackgallery/digikon-nfts/images/banner1.jpg"
        headingText="Sàn đấu giá NFT"
        subHeadingText="Mua bán NFTs độc quyền."
        actionComponent={<HowToBuyModal buttonClassName="button-header" />}
        useBannerBg
      />
      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 32 }}>
            <Row>
              <Tabs
                activeKey={activeKey}
                onTabClick={
                  key => setActiveKey(key as LiveAuctionViewState)
                }
              >
                <TabPane
                  tab={
                    <>
                      <span className="live"></span> Đang Diễn Ra
                    </>
                  }
                  key={LiveAuctionViewState.All}

                ></TabPane>
                {hasResaleAuctions && (
                  <TabPane
                    tab="Đang Rao Bán"
                    key={LiveAuctionViewState.Resale}
                  ></TabPane>
                )}
                <TabPane tab="Đã kết thúc" key={LiveAuctionViewState.Ended}></TabPane>
                {connected && (
                  <TabPane
                    tab="Đã tham gia"
                    key={LiveAuctionViewState.Participated}
                  ></TabPane>
                )}
                
              </Tabs>
            </Row>
            <img
                src={"https://cdn3.vectorstock.com/i/1000x1000/88/47/white-arrow-icon-reset-sign-on-black-background-vector-10778847.jpg"}
                style={{ marginBottom: '1rem', border: 'none', borderRadius: '5px' }}
                width={60} height={60}
                alt={"Làm mới dữ liệu"}
                placeholder={"Làm mới dữ liệu"}
                onClick={() => {
                  //  useMeta();
                  pullAllMetadata();
                  window.location.reload();
                }
                }
              />
            <Row>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
              >
                {isLoading &&
                  [...Array(10)].map((_, idx) => <CardLoader key={idx} />)
                  // <Spinner />
                }
                {!isLoading &&
                  sales.map((sale, idx) => <SaleCard sale={sale} key={idx}/>)}
              </Masonry>
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
