import React, { useState, useEffect, useCallback, createRef } from 'react';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

import { Slider } from '@material-ui/core';

import classes from './styles.module.css';

type UploadFile = File | null | undefined;
type OutputFile = {
  name: string;
  type: string;
  url: string;
  data: Blob;
};

type Progress = {
  ratio: number;
};

function VideoEditor() {
  const videoRef = createRef<HTMLVideoElement>();
  const [file, setFile] = useState<UploadFile>();
  const [output, setOutput] = useState<OutputFile>();
  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to trim');
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<number[]>([0, 100]);
  const ffmpeg = createFFmpeg({
    log: true,
    progress: (progress: Progress) =>
      console.log('Progress now is: ', progress.ratio),
  });
  const doTrim = async () => {
    try {
      if (!file) return;
      setMessage('Loading ffmpeg-core.js');

      await ffmpeg.load();
      setMessage('Start trimming');

      const inputFileName = `${file.name}`.trim().replace(/\s/gi, '-');
      const outputFileName = `edit-${new Date().getTime()}-${inputFileName}`;

      await ffmpeg.write(inputFileName, file);
      await ffmpeg.trim(
        inputFileName,
        outputFileName,
        '00:00:00',
        '00:00:10',
        '-c copy',
      );

      console.log(await ffmpeg.ls('.'));
      setMessage('Complete trimming');

      const data = ffmpeg.read(outputFileName);
      const content = new Blob([data.buffer], { type: file.type });
      const outputUrl = URL.createObjectURL(content);

      setOutput({
        name: outputFileName,
        type: file.type,
        data: content,
        url: outputUrl,
      });
      setVideoSrc(outputUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.item(0);

      console.log(file?.type);
      setFile(file);
    },
    [],
  );

  const handleChangeRange = useCallback(
    (_: React.ChangeEvent<{}>, value: number | number[]) => {
      setRange(value as number[]);
    },
    [],
  );

  const hanldeLoadMetaData = useCallback(() => {
    setDuration(videoRef.current?.duration ?? 0);
  }, [videoRef]);

  useEffect(() => {
    if (!file) {
      return;
    }

    setVideoSrc(window.URL.createObjectURL(file));
  }, [file]);

  return (
    <div id="video-section" className={classes.root}>
      <p />
      <input type="file" onChange={handleChangeFile} />
      <br />
      <p />
      <video
        muted
        controls
        src={videoSrc}
        width={600}
        height={400}
        preload="metadata"
        ref={videoRef}
        onLoadedMetadata={hanldeLoadMetaData}
      ></video>
      <br />
      {/* <input
        type="range"
        min={0}
        max={videoRef.current?.duration}
        style={{ width: 600 }}
      /> */}
      <Slider
        value={range}
        onChange={handleChangeRange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={(value: number) => `${duration * (value / 100)}`}
        valueLabelFormat={(value: number) => `${duration * (value / 100)}`}
      />
      <br />
      <button onClick={doTrim}>Start</button>
      <p>{message}</p>

      {output && (
        <a href={output.url} download={decodeURI(output.name)}>
          Download file
        </a>
      )}
    </div>
  );
}

export default VideoEditor;
