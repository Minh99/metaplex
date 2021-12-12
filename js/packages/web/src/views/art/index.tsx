import React, { useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Layout,
  Tag,
  Button,
  Skeleton,
  List,
  Card,
} from 'antd';
import { useParams } from 'react-router-dom';
import { useArt, useExtendedArt } from '../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { shortenAddress, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from '../../components/MetaAvatar';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { ViewOn } from '../../components/ViewOn';
import { ArtType } from '../../types';
import { ArtMinting } from '../../components/ArtMinting';

const { Content } = Layout;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();
  const [remountArtMinting, setRemountArtMinting] = useState(0);

  const connection = useConnection();
  const art = useArt(id);
  let badge = '';
  let maxSupply = '';
  let suppLy = '';

  if (art.type === ArtType.NFT) {
    badge = 'Duy Nhất';
  } else if (art.type === ArtType.Master) {
    badge = 'NFT 0';
    if (art.maxSupply !== undefined) {
      maxSupply = art.maxSupply.toString();
    } else {
      maxSupply = 'Vô Hạn';
    }
  } else if (art.type === ArtType.Print) {
    badge = ` v${art.edition}`;
    suppLy = ` ${art.supply}`;
  }
  const { ref, data } = useExtendedArt(id);

  // const { userAccounts } = useUserAccounts();

  // const accountByMint = userAccounts.reduce((prev, acc) => {
  //   prev.set(acc.info.mint.toBase58(), acc);
  //   return prev;
  // }, new Map<string, TokenAccount>());

  const description = data?.description;
  const attributes = data?.attributes;

  const pubkey = wallet?.publicKey?.toBase58() || '';
  const tag = (
    <div className="info-header">
      <Tag color="blue">UNVERIFIED</Tag>
    </div>
  );
  
  const unverified = (
    <>
      {tag}
      <div style={{ fontSize: 12 }}>
        <i>
          This artwork is still missing verification from{' '}
          {art.creators?.filter(c => !c.verified).length} contributors before it
          can be considered verified and sellable on the platform.
        </i>
      </div>
      <br />
    </>
  );

  return (
    <Content>
      { art.creators?.[0] ?
      <Col>
        <Row ref={ref}>
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ paddingRight: '30px'}}
          >
            <ArtContent
              style={{ width: '100%', height: 'auto', margin: '0 auto' }}
              height={300}
              width={300}
              className="artwork-image"
              pubkey={id}
              active={true}
              allowMeshRender={true}
              artView={true}
            />
          </Col>
          {/* <Divider /> */}
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ textAlign: 'left', fontSize: '2rem' }}
          >
            <Row>
              <div style={{ fontWeight: 700, fontSize: '3rem' }}>
                {art.title || <Skeleton paragraph={{ rows: 0 }} />}
              </div>
            </Row>
            <Row>
              <Col span={6}>
                <h6>Phí Bản Quyền</h6>
                <div className="royalties">
                  {((art.seller_fee_basis_points || 0)).toFixed(2)}%
                </div>
              </Col>
              <Col span={12}>
                <ViewOn id={id} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 5 }}>Người Chế Tạo</h6>
                <div className="creators">
                  {(art.creators || []).map((creator, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}
                      >
                        <MetaAvatar creators={[creator]} size={64} />
                        <div>
                          <span className="creator-name">
                            {creator.name ||
                              shortenAddress(creator.address || '')}
                          </span>
                          <div style={{ marginLeft: 10 }}>
                            {!creator.verified &&
                              (creator.address === pubkey ? (
                                <Button
                                  onClick={async () => {
                                    try {
                                      await sendSignMetadata(
                                        connection,
                                        wallet,
                                        id,
                                      );
                                    } catch (e) {
                                      console.error(e);
                                      return false;
                                    }
                                    return true;
                                  }}
                                >
                                  Approve
                                </Button>
                              ) : (
                                tag
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ display: 'flex', justifyContent: 'flex-start', justifyItems: 'center', marginTop: 5, tabSize: 4 }}>
                  <h6>Phiên bản (Edition):  &nbsp;</h6>
                  <div className="art-edition">{badge}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', justifyItems: 'center', marginTop: 5, tabSize: 4 }}>
                  <h6>Tổng cung (supply):  &nbsp;</h6>
                  <div className="art-edition">{maxSupply}</div>
                </div>
              </Col>
            </Row>
            {/* {art.type === ArtType.Master && (
              <Row>
                <Col>
                  <h6 style={{ marginTop: 5 }}>Max Supply</h6>
                  <div className="art-edition">{maxSupply}</div>
                </Col>
              </Row>
            )} */}
            {/* <Button
                  onClick={async () => {
                    if(!art.mint) {
                      return;
                    }
                    const mint = new PublicKey(art.mint);

                    const account = accountByMint.get(art.mint);
                    if(!account) {
                      return;
                    }

                    const owner = wallet.publicKey;

                    if(!owner) {
                      return;
                    }
                    const instructions: any[] = [];
                    await updateMetadata(undefined, undefined, true, mint, owner, instructions)

                    sendTransaction(connection, wallet, instructions, [], true);
                  }}
                >
                  Mark as Sold
                </Button> */}

            {/* TODO: Add conversion of MasterEditionV1 to MasterEditionV2 */}
            <ArtMinting
              id={id}
              key={remountArtMinting}
              onMint={async () => await setRemountArtMinting(prev => prev + 1)}
            />
          </Col>
          <Col span="12">
            <Divider />
            {art.creators?.find(c => !c.verified) && unverified}
            <br />
            <div className="info-header">Mô tả về sản phẩn</div>
            <div className="info-content">{description}</div>
            <br />
            {/*
              TODO: add info about artist
            <div className="info-header">ABOUT THE CREATOR</div>
            <div className="info-content">{art.about}</div> */}
          </Col>
          <Col span="12">
            {attributes && (
              <>
                <Divider />
                <br />
                <div className="info-header">Thuộc tính</div>
                <List size="large" grid={{ column: 4 }}>
                  {attributes.map(attribute => (
                    <List.Item key={attribute.trait_type}>
                      <Card title={attribute.trait_type}>
                        {attribute.value}
                      </Card>
                    </List.Item>
                  ))}
                </List>
              </>
            )}
          </Col>
        </Row>
      </Col>
      : 
      <p style={{ width: '100%',color: 'white', textAlign: 'center', fontSize: '1.4rem', marginTop: '3rem', wordSpacing: '4px' }}>
        Sản phẩm có địa chỉ <span style={{ color: '#8181b3', fontSize: '1.4rem'}}>{id}</span> bạn tìm kiếm không tồn tại.
      </p>
      }
    </Content>
  );
};
