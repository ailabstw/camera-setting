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
  const [led, setLed] = useState<string>('oD2');

  // 注意，GoPro 網站說 quick capture 打開時，12G 大檔設定會沒效
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`v0oCoS1oR0${led}oV0${large}`} />
      <Paper classes={{ root: styles.controls }}>
        <RadioGroup row value={large} onChange={(e) => setLarge(e.target.value)}>
          <FormControlLabel value='' label='檔案大小:' control={<div />} />
          <FormControlLabel value='!M64BT=1' control={<Radio color='primary' />} label='12G' />
          <FormControlLabel value='!M64BT=0' control={<Radio />} label='4G' />
        </RadioGroup>
        <RadioGroup row value={led} onChange={(e) => setLed(e.target.value)}>
          <FormControlLabel value='' label='錄影燈:' control={<div />} />
          <FormControlLabel value='oD2' control={<Radio color='primary' />} label='僅開後面' />
          <FormControlLabel value='oD4' control={<Radio />} label='全開' />
          <FormControlLabel value='oD0' control={<Radio />} label='關閉' />
        </RadioGroup>
      </Paper>
    </div>
  );
};

const Params1Panel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [video, setVideo] = useState<string>('r5p30');
  const [shutter, setShutter] = useState<string>('!MEXPT=2');
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`m3dV${video}g1i32M1${shutter}`} />
      <Paper classes={{ root: styles.controls }}>
        <RadioGroup row value={video} onChange={(e) => setVideo(e.target.value)}>
          <FormControlLabel value='' label='每秒幀數:' control={<div />} />
          <FormControlLabel value='r5p24' control={<Radio />} label='24 fps' />
          <FormControlLabel value='r5p30' control={<Radio color='primary' />} label='30 fps' />
        </RadioGroup>
        <RadioGroup row value={shutter} onChange={(e) => setShutter(e.target.value)}>
          <FormControlLabel value='' label='最大快門角度:' control={<div />} />
          <FormControlLabel value='!MEXPT=1' control={<Radio />} label='180º' />
          <FormControlLabel value='!MEXPT=2' control={<Radio color='primary' />} label='90º' />
          <FormControlLabel value='!MEXPT=3' control={<Radio />} label='45º' />
          <FormControlLabel value='!MEXPT=4' control={<Radio />} label='22º' />
          <FormControlLabel value='!MEXPT=5' control={<Radio />} label='10º' />
        </RadioGroup>
      </Paper>
    </div>
  );
};

const Params2Panel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [sharpness, setSharpness] = useState<string>('sH');
  const [wind, setWind] = useState<string>('aA');
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`cGwAx0e2q0oW1${sharpness}${wind}`} />
      <Paper classes={{ root: styles.controls }}>
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

const LockPanel: FC<{ hidden?: boolean }> = ({ hidden = true }) => {
  const [lock, setLock] = useState<string>('!MARCH=0');
  return (
    <div role='tabpanel' hidden={hidden}>
      <ORCodeView code={`!EdVq1${lock}!O`} />
      <Paper classes={{ root: styles.controls }}>
        <RadioGroup row value={lock} onChange={(e) => setLock(e.target.value)}>
          <FormControlLabel value='' label='自動錄影:' control={<div />} />
          <FormControlLabel value='!MARCH=0' control={<Radio color='primary' />} label='關閉' />
          <FormControlLabel value='!MARCH=1' control={<Radio  />} label='打開' />

          <div>
            <p>
            設定自動錄影後，相機會先關機，之後每次開機都會直接開始錄影，不能做其他操作，必須靠關機來停止錄影。
            </p>
            <p>
            錄影中，掃關閉的 QR Code 可以關閉此功能。
            </p>
          </div>
        </RadioGroup>
      </Paper>
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
          <Tab label='基礎' />
          <Tab label='拍攝' />
          <Tab label='品質' />
          <Tab label='時間' />
          <Tab label='自動' />
        </Tabs>
      </AppBar>

      <BaseParamPanel hidden={value !== 0} />
      <Params1Panel hidden={value !== 1} />
      <Params2Panel hidden={value !== 2} />
      <TimePanel hidden={value !== 3} />
      <LockPanel hidden={value !== 4} />
    </div>
  );
};
