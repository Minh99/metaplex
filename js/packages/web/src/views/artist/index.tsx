import { Col, Divider, Row } from 'antd';
import React from 'react';
import Masonry from 'react-masonry-css';
import { Link, useParams } from 'react-router-dom';
import { ArtCard } from '../../components/ArtCard';
import { CardLoader } from '../../components/MyLoader';
import { useCreator, useCreatorArts } from '../../hooks';

export const ArtistView = () => {
  const { id } = useParams<{ id: string }>();
  const creator = useCreator(id);
  const artwork = useCreatorArts(id);
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const artworkGrid = (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {artwork.length > 0
        ? artwork.map((m, idx) => {
          const id = m.pubkey;

          return (
            <Link to={`/art/${id}`} key={idx}>
              <ArtCard key={id} pubkey={m.pubkey} preview={false} />
            </Link>
          );
        })
        : (<div>
          Chưa có sản phẩm nào &nbsp; &nbsp;
          <button>
            <Link to={`/art/create`}>
              Thêm mới sản phẩm
            </Link>
          </button>
        </div>)
      }

      {/* : [...Array(6)].map((_, idx) => <CardLoader key={idx} />)} */}
    </Masonry>
  );

  return (
    <>
      <Col>
        <Divider />
        <Row
          style={{ marginTop: 32, textAlign: 'left', fontSize: '1.4rem' }}
        >
          <Col span={24}>
            <div style={{ display: 'plex', flexDirection: 'column', textAlign: 'center', marginTop: 12 }}>
              <img style={{ width: '50px', height: '50px' }} src="https://newtelco.ge/wp-content/uploads/2020/02/img_569204.png" alt="" />
              <h2 style={{ fontSize: '80%', textAlign: 'center', padding: 5 }}>
                {/* <MetaAvatar creators={creator ? [creator] : []} size={100} /> */}
                {creator?.info.name || creator?.info.address}
              </h2>
            </div>
            <br />
            {creator?.info.description == "undefined" ?
              <>
                <div className="info-header">Thông Tin Người Chế  Tạo</div>
                <div className="info-content">{creator?.info.description}</div>
                <br />
              </>
              : <div></div>}
            <div className="info-header">Sản Phẩm</div>
            {artworkGrid}
          </Col>
        </Row>
      </Col>
    </>
  );
};
