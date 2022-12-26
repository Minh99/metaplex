import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Modal, Input } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { HowToBuyModal } from '../HowToBuyModal';
import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../CurrentUserBadge';
import { ConnectButton } from '@oyster/common';

const getDefaultLinkActions = (connected: boolean) => {
  
  return [
    <Link to={`/`} key={'explore'}>
      <Button className="app-btn">Trang chủ</Button>
    </Link>,
    <Link to={`/artworks`} key={'artwork'}>
      <Button className="app-btn">Sản Phẩm</Button>
    </Link>,
    <Link to={`/artists`} key={'artists'}>
      <Button className="app-btn">Người Chế  Tạo</Button>
    </Link>,
  ];
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        lineHeight: '0',
        marginTop: '0.5rem'
      }}
    >
      {getDefaultLinkActions(connected)}
    </div>
  );
};

const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { connected } = useWallet();
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  if (width < 768)
    return (
      <>
        <Modal
          // title={<img src={'/metaplex-logo.svg'} />}
          visible={isModalVisible}
          footer={null}
          className={'modal-box'}
          closeIcon={
            <img
              onClick={() => setIsModalVisible(false)}
              src={'/modals/close.svg'}
            />
          }
        >
          <div className="site-card-wrapper mobile-menu-modal">
            <Menu onClick={() => setIsModalVisible(false)}>
              {getDefaultLinkActions(connected).map((item, idx) => (
                <Menu.Item key={idx}>{item}</Menu.Item>
              ))}
            </Menu>
            <div className="actions">
              {!connected ? (
                <div className="actions-buttons">
                  <ConnectButton
                    onClick={() => setIsModalVisible(false)}
                    className="secondary-btn"
                  />
                  {/* <HowToBuyModal
                    onClick={() => setIsModalVisible(false)}
                    buttonClassName="black-btn"
                  /> */}
                </div>
              ) : (
                <>
                  <CurrentUserBadgeMobile
                    showBalance={false}
                    showAddress={true}
                    iconSize={24}
                    closeModal={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  <Notifications />
                  <Cog />
                </>
              )}
            </div>
          </div>
        </Modal>
        <MenuOutlined
          onClick={() => setIsModalVisible(true)}
          style={{ fontSize: '1.4rem' }}
        />
      </>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: 'fit-content', marginBottom: '-0.5rem' }}>
      <DefaultActions />
      <div style={{ width: '100%', height: 'fit-content', display: 'flex', justifyContent: 'space-between', marginBottom: '0', marginTop: '0.5rem' }}>
        <Input
          type="text"
          placeholder="Nhập địa chỉ sản phẩm"
          value={searchTerm}
          onChange={handleChange}
          style={{ height:'fit-content', backgroundColor: 'white', color: '#6a6a84', fontSize: '1.2rem', lineHeight: '1.2rem', border: '1px solid gray', borderRadius: '2px', padding: '5px 15px', margin: '0 1rem' }}
        />,
        <Button style={{ color: '#6a6a84', fontSize: '1.2rem', lineHeight: '1.2rem', border: '1px solid gray', borderRadius: '2px', padding: '5px 15px', width: 'fit-content', margin: '0 1rem' }}>
          <Link to={searchTerm !== "" ? `/art/${searchTerm}` : ``} style={{ color: '#6a6a84' }}>
            Tìm kiếm
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const LogoLink = () => {
  return (
    <Link to={`/`}>
      <h1 style={{ color: 'black', margin: '0', fontSize: '42px', marginRight: '2rem' }}>MVD</h1>
    </Link>
  );
};

export const AppBar = () => {
  const { connected } = useWallet();
  return (
    <>
      <div id="mobile-navbar">
        <LogoLink />
        <MetaplexMenu />
      </div>
      <div id="desktop-navbar">
        <div className="app-left">
          <LogoLink />
          &nbsp;&nbsp;&nbsp;
          <MetaplexMenu />
        </div>
        <div className="app-right">
          {/* {!connected && (
            <HowToBuyModal buttonClassName="modal-button-default" />
          )} */}
          {!connected && (
            <ConnectButton style={{ height: 48 }} allowWalletChange />
          )}
          {connected && (
            <>
              <CurrentUserBadge
                showBalance={false}
                showAddress={true}
                iconSize={24}
              />
              <Notifications />
              <Cog />
            </>
          )}
        </div>
      </div>
    </>
  );
};
