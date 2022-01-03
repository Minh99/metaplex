import React from 'react';
import { Col, Button } from 'antd';
import { useArt } from '../../hooks';
import { useConnectionConfig } from '@oyster/common';

export const ViewOn = ({ id }: { id: string }) => {
  const { endpoint } = useConnectionConfig();
  const art = useArt(id);
  console.log(art);
  
  return (
    <>
      <Col>
        <h6 style={{textAlign: 'left'}}>Xem thông tin</h6>
        <div style={{ display: 'flex'}}>
          <Button
            style={{ color:'red', margin: 0, padding: 0 }}
            className="tag btn-info"
            onClick={() => window.open(art.uri || '', '_blank')}
          >
            Arweave
          </Button>
          <Button
            className="tag btn-info"
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
      </Col>
    </>
  );
};
