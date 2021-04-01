/*
 * Created by Stefan Hong on 2021-03-31.
 * Copyright (c) 2021 Taiwan AI Labs.
 */
import React, { FC, useEffect, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import QRCode from 'qrcode.react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import styles from './CameraSetting.module.scss';

const ORCodeView: FC<{ code: string; size?: number }> = ({ code, size = 330 }) => {
  return (
    <div className={styles.qrcodeView}>
      <QRCode value={code} size={size} />
      <Typography noWrap>{code}</Typography>
    </div>
  );
};

const BaseParamPanel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [large, setLarge] = useState<string>('!M64BT=1');
  const [led, setLed] = useState<string>('oD4');

  // 注意，GoPro 網站說 quick capture 打開時，12G 大檔設定會沒效
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`q0v0oCoB7oS1oR0oW1${led}oV0!MLAPS=0${large}`} />
      <Paper classes={{ root: styles.controls }}>
        <RadioGroup row value={large} onChange={(e) => setLarge(e.target.value)}>
          <FormControlLabel value='' label='檔案大小:' control={<div />} />
          <FormControlLabel value='!M64BT=1' control={<Radio color='primary' />} label='12G' />
          <FormControlLabel value='!M64BT=0' control={<Radio />} label='4G' />
        </RadioGroup>
        <RadioGroup row value={led} onChange={(e) => setLed(e.target.value)}>
          <FormControlLabel value='' label='錄影燈:' control={<div />} />
          <FormControlLabel value='oD4' control={<Radio color='primary' />} label='全開' />
          <FormControlLabel value='oD2' control={<Radio />} label='僅開後面' />
          <FormControlLabel value='oD0' control={<Radio />} label='關閉' />
        </RadioGroup>
      </Paper>
    </div>
  );
};

const DayParamPanel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [video, setVideo] = useState<string>('r5p30');
  const [shutter, setShutter] = useState<string>('S45');
  const [sharpness, setSharpness] = useState<string>('sH');
  const [wind, setWind] = useState<string>('aA');
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`m3dV${video}cGwAx0${sharpness}e2g1q1${wind}oV0i32${shutter}`} />
      <Paper classes={{ root: styles.controls }}>
        <RadioGroup row value={video} onChange={(e) => setVideo(e.target.value)}>
          <FormControlLabel value='' label='每秒幀數:' control={<div />} />
          <FormControlLabel value='r5p30' control={<Radio color='primary' />} label='30 fps' />
          <FormControlLabel value='r5p24' control={<Radio />} label='24 fps' />
        </RadioGroup>
        <RadioGroup row value={shutter} onChange={(e) => setShutter(e.target.value)}>
          <FormControlLabel value='' label='最大快門角度:' control={<div />} />
          <FormControlLabel value='S45' control={<Radio color='primary' />} label='45º' />
          <FormControlLabel value='S22' control={<Radio />} label='22º' />
          <FormControlLabel value='S10' control={<Radio />} label='10º' />
        </RadioGroup>
        <RadioGroup row value={sharpness} onChange={(e) => setSharpness(e.target.value)}>
          <FormControlLabel value='' label='影像銳利度:' control={<div />} />
          <FormControlLabel value='sH' control={<Radio color='primary' />} label='高' />
          <FormControlLabel value='sM' control={<Radio />} label='中' />
          <FormControlLabel value='sL' control={<Radio />} label='低' />
        </RadioGroup>
        <RadioGroup row value={wind} onChange={(e) => setWind(e.target.value)}>
          <FormControlLabel value='' label='降低風切聲:' control={<div />} />
          <FormControlLabel value='aA' control={<Radio color='primary' />} label='自動' />
          <FormControlLabel value='aS' control={<Radio />} label='Off' />
          <FormControlLabel value='aW' control={<Radio />} label='On' />
        </RadioGroup>
      </Paper>
    </div>
  );
};

const TimePanel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [cmd, setCmd] = useState<string>('');

  const padTime = (i: number): string => {
    if (i < 10) {
      return `0${i}`;
    } // add zero in front of numbers < 10
    return '' + i;
  };

  useEffect(() => {
    if (hidden) {
      return;
    }
    const timer = setInterval(() => {
      // 這段是 GoPro 官方版寫在 https://gopro.github.io/labs/control/precisiontime/ 的
      var yy, mm, dd, h, m, s;
      var ms;

      const today = new Date();
      yy = today.getFullYear() - 2000;
      mm = today.getMonth() + 1;
      dd = today.getDate();
      h = today.getHours();
      m = today.getMinutes();
      s = today.getSeconds();
      ms = today.getMilliseconds();
      yy = padTime(yy);
      mm = padTime(mm);
      dd = padTime(dd);
      h = padTime(h);
      m = padTime(m);
      s = padTime(s);
      ms = Math.floor(ms / 10); // hundredths
      ms = padTime(ms);

      const cmd = 'oT' + yy + mm + dd + h + m + s + '.' + ms;
      setCmd(cmd);
    }, 50);
    return () => {
      clearTimeout(timer);
    };
  }, [hidden]);

  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={cmd} />
    </div>
  );
};

export const CameraSetting = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <AppBar position='static' color='default' style={{ marginBottom: 16 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='基礎設定' />
          <Tab label='拍攝參數' />
          <Tab label='時間設定' />
        </Tabs>
      </AppBar>

      <BaseParamPanel hidden={value !== 0} />
      <DayParamPanel hidden={value !== 1} />
      <TimePanel hidden={value !== 2} />
    </div>
  );
};
