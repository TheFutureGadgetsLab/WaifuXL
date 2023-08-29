import { EuiFlexGroup, EuiFlexItem, EuiPage, EuiPageBody, EuiPanel } from '@elastic/eui';

import { Header } from 'components/Header';
import { ImageDisplay } from 'components/ImageDisplay';
import React from 'react';
import { SideBar } from 'components/SideBar';
import meg from 'public/images/meg.png';
import senjo from 'public/images/senjo.webp';

export default function Home() {
  return (
    <main>
      <EuiPage paddingSize="none">
        <SideBar />
        <EuiPageBody paddingSize="none" panelled={false}>
          <Header />
          <EuiPanel hasShadow={false} paddingSize="none">
            <EuiFlexGroup
              gutterSize="none"
              responsive={true}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <EuiFlexItem grow={true}>
                <ImageDisplay inputURI={senjo} outputURI={meg} />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiPageBody>
      </EuiPage>
    </main>
  );
}
