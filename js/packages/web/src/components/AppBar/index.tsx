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
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  
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
    <Input
      type="text"
      placeholder="Nhập token sản phẩm"
      value={searchTerm}
      onChange={handleChange}
      style={{ backgroundColor: 'white', color: 'black', fontSize: '1.4rem', lineHeight: '1.2rem', border: '1px solid gray', borderRadius: '5px', padding: '0 0 0 5px', width: '400px', marginLeft: '2rem'}}
    />,
    <Button style={{color: 'black', fontSize: '1.4rem', lineHeight: '1.2rem', border: '1px solid gray', borderRadius: '5px', padding: '5px 15px', width: 'fit-content', marginLeft: '1rem'}}> 
      <Link to={`/art/${searchTerm}`} style={{color: 'black'}}>
        Tìm kiếm 
      </Link>
    </Button>
  ];
};

const DefaultActions = ({ vertical = false }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        lineHeight: '0'
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

  return <DefaultActions />;
};

export const LogoLink = () => {
  return (
    <Link to={`/`}>
      <h1 style={{color:'black', margin:'0', fontSize: '42px', marginRight:'2rem'}}>MVD</h1> 
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
