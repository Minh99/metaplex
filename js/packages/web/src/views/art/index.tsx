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
import { useHistory, useParams } from 'react-router-dom';
import { useArt, useExtendedArt } from '../../hooks';

import { ArtContent } from '../../components/ArtContent';
import { shortenAddress, useConnection } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from '../../components/MetaAvatar';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { ViewOn } from '../../components/ViewOn';
import { ArtType } from '../../types';
import { ArtMinting } from '../../components/ArtMinting';
import { Spinner } from '../../components/Loader';

const { Content } = Layout;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const isCreate = id.search('-create') == -1 ? false : true;
  const [isLoading, setLoading] = useState(isCreate);
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
    badge = 'Duy Nhất';
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
  // console.log(art);
  
  if (isCreate) {
    setTimeout(() => {
      setLoading(false);
      const url = window.location.href;
      try { window.location.replace(url.replace('-create', '')); } 
      catch(e) { window.location.replace(url.replace('-create', '')); }
      // history.push(`/art/${id.replace('-create', '')}`);
      // window.location.replace(url.replace('-create', ''));
      window.location.reload();
    }, 70000)
  }
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
      {art.creators?.[0] || isCreate ?
        isLoading ?
          <div className={`loader-container ${isLoading ? 'active' : ''}`}>
            <div className="loader-block">
              <div className="loader-title">VUI LÒNG ĐỢI TRONG GIÂY LÁT</div>
              <Spinner />
            </div>
          </div> :
          <Col>
            <Row ref={ref}>
              <Col
                xs={{ span: 24 }}
                md={{ span: 12 }}
                style={{ paddingRight: '30px' }}
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
                <hr style={{ width: '50%', margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                <Row>
                    <div style={{ display: 'flex' }}>
                      <h6>Địa chỉ : &nbsp;</h6>
                      <span className="royalties art-edition" style={{ color: 'white' }}>{shortenAddress(id)}</span>
                    </div>
                </Row>
                <hr style={{ width: '50%', margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                <Row>
                  <ViewOn id={id.replace('-create', '')} />
                </Row>
                <hr style={{ width: '50%', margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                <Row>
                  <Col span={12}>
                    <h6 style={{ marginTop: 5 }}>Tác giả</h6>
                    <div className="creators art-edition">
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
                <hr style={{ width: '50%', margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                <Row>
                  <Col span={12}>
                    <div style={{ display: 'flex' }}>
                      <h6>Phí bản quyền : &nbsp;</h6>
                      <span className="royalties art-edition" style={{ color: 'white' }}>{((art.seller_fee_basis_points || 0) / 10).toFixed(2)}%</span>
                    </div>
                  </Col>
                  {/* <Col span={12}> */}
                  {/* </Col> */}
                </Row>
                <hr style={{ width: '50%', margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                <Row>
                  <Col span={12}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', justifyItems: 'center', marginTop: 5, tabSize: 4 }}>
                      <h6>Phiên bản :  &nbsp;</h6>
                      <div className="art-edition">{badge}</div>
                    </div>
                    <hr style={{ margin: 'initial', border: '1px solid #888888', marginBottom: '1rem', marginTop: '1rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-start', justifyItems: 'center', marginTop: 5, tabSize: 4 }}>
                      <h6>Tổng cung :  &nbsp;</h6>
                      <div className="art-edition">{maxSupply || 1} NFT</div>
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
        <p style={{ width: '100%', color: 'white', textAlign: 'center', fontSize: '1.4rem', marginTop: '3rem', wordSpacing: '4px' }}>
          Địa chỉ sản phẩm <span style={{ color: '#8181b3', fontSize: '1.4rem' }}>{id}</span> bạn tìm kiếm không tồn tại.
        </p>
      }
    </Content>
  );
};
