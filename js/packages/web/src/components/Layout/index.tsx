import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { Footer } from '../Footer';

const { Header, Content } = Layout;

export const AppLayout = React.memo((props: any) => {
  return (
    <>
      <Layout id={'main-layout'}>
        <span id={'main-bg'}></span>
        <span id={'bg-gradient'}></span>
        <span id={'static-header-gradient'}></span>
        <span id={'static-end-gradient'}></span>
        <Header className="App-Bar">
          <AppBar />
        </Header>
        <Layout id={'width-layout'}>
          <Content
            style={{
              marginTop: '5rem',
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingRight: 0
            }}
          >
            {props.children}
          </Content>
        </Layout>
        {/* <Footer /> */}
      </Layout>
    </>
  );
});
