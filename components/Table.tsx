import { EuiBasicTable, EuiBasicTableColumn, EuiProgress, EuiSpacer, EuiTableFieldDataColumnType } from '@elastic/eui';

import React from 'react';

type Tag = {
  id: string;
  name: string;
  percent: number;
};
const tags: Tag[] = [
  { id: '1', name: '1girl', percent: 99 },
  { id: '2', name: 'Solo', percent: 96 },
  { id: '3', name: 'Purple Hair', percent: 81 },
  { id: '4', name: 'Long Hair', percent: 63 },
  { id: '5', name: 'Blue Eyes', percent: 48 },
  { id: '6', name: 'School Uniform', percent: 24 },
  { id: '7', name: 'Shirt', percent: 22 },
  { id: '8', name: 'Blonde Hair', percent: 21 },
  { id: '9', name: 'Skirt', percent: 20 },
  { id: '10', name: 'Brown Hair', percent: 19 },
];
const characters: Tag[] = [
  { id: '1', name: 'Senjougahara Hitagi', percent: 52 },
  { id: '2', name: 'Matou Sakura', percent: 5 },
  { id: '3', name: 'Busujima Saeko', percent: 4 },
  { id: '4', name: 'Souryuu Asuka Langley', percent: 1 },
  { id: '5', name: 'Teana Lanster', percent: 1 },
  { id: '6', name: 'Gokou Ruri', percent: 1 },
  { id: '7', name: 'Hoshizora Miyuki', percent: 1 },
  { id: '8', name: 'Faris Scherwiz', percent: 0 },
  { id: '9', name: 'Ayanami Rei', percent: 0 },
  { id: '10', name: 'Nagato Yuki', percent: 0 },
];
const explicit: Tag[] = [
  { id: '1', name: 'Safe', percent: 89 },
  { id: '2', name: 'Questionable', percent: 13 },
  { id: '3', name: 'Explicit', percent: 1 },
];
export default () => {
  const columns: Array<EuiBasicTableColumn<Tag>> = [
    {
      field: 'name',
      name: 'Tag',
      'data-test-subj': 'firstNameCell',
      mobileOptions: {
        show: false,
      },
      width: '40%',
      render: (user: string) => {
        return <span>{user}</span>;
      },
      truncateText: true,
    },
    {
      field: 'percent',
      name: 'Percent',
      truncateText: false,
      textOnly: false,
      mobileOptions: {
        show: false,
      },
      width: '60%',
      render: (perc: number) => {
        return <EuiProgress value={String(perc)} max={100} color="#44ABBC" />;
      },
    },
  ];
  const getRowProps = (user: Tag) => {
    const { id } = user;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: () => {},
      height: '1px',
      bgColor: '#f5f5f5',
    };
  };
  const getCellProps = (user: Tag, column: EuiTableFieldDataColumnType<Tag>) => {
    const { id } = user;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${String(field)}`,
      textOnly: true,
    };
  };
  return (
    <>
      <EuiBasicTable
        tableCaption="Demo of EuiBasicTable"
        items={tags}
        columns={columns}
        rowProps={getRowProps}
        cellProps={getCellProps}
        compressed={true}
        css={{ 'background-color': '#f5f5f5' }}
      />
      <EuiSpacer size="s" />
      <EuiBasicTable
        tableCaption="Demo of EuiBasicTable"
        items={characters}
        columns={columns}
        rowProps={getRowProps}
        cellProps={getCellProps}
        compressed={true}
      />
      <EuiSpacer size="s" />
      <EuiBasicTable
        tableCaption="Demo of EuiBasicTable"
        items={explicit}
        columns={columns}
        rowProps={getRowProps}
        cellProps={getCellProps}
        compressed={true}
      />
    </>
  );
};
