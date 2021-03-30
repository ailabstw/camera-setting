/*
 * Created by Stefan Hong on 2021-03-31.
 * Copyright (c) 2021 Taiwan AI Labs.
 */
import AppBar from '@material-ui/core/AppBar';
// import QRCode from 'qrcode.react';
import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

export const CameraSetting = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position='static'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='secondary'
          textColor='secondary'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='基礎設定' />
          <Tab label='日間參數' />
          <Tab label='夜間參數' />
        </Tabs>
      </AppBar>
      <div role='tabpanel' hidden={value !== 0}>
        Item 0
      </div>
      <div role='tabpanel' hidden={value !== 1}>
        Item 1
      </div>
      <div role='tabpanel' hidden={value !== 2}>
        Item 2
      </div>
    </div>
  );
};

// <QRCode value='m3dVr5p30cGwAx0sHe2g1q1v0oCoB7oS1oR0oW1oD2oV0i32S45!MLAPS=0!M64BT=1' size={300} />
