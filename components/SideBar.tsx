import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiPageSidebar, EuiPanel } from '@elastic/eui';

import { FC } from 'react';
import Table from 'components/Table';

interface SideBarProps {}

export const SideBar: FC<SideBarProps> = () => {
  return (
    <EuiPageSidebar paddingSize="none">
      <EuiPanel hasShadow={false} css={{ 'background-color': '#f5f5f5' }}>
        <EuiFlexGroup gutterSize="s" responsive={false} direction="column">
          <EuiFlexItem grow={true}>
            <EuiButton iconType="image" fill={true} css={{ 'background-color': '#FF869C' }}>
              Choose Image/GIF
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <EuiButton iconType="download" css={{ 'background-color': '#FF869C' }} fill={true}>
              Download
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={true}>
            <EuiButton iconType="share" css={{ 'background-color': '#FF869C' }} fill={true}>
              Post To Imgur
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiHorizontalRule size="full" />

        <Table />
      </EuiPanel>
    </EuiPageSidebar>
  );
};
