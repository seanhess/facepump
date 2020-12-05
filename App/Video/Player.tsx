
import React, { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-native-youtube'

import {
  View, Text
} from 'react-native';
import { CurrentRenderContext } from '@react-navigation/native';

export type SecondsMs =
    number & { readonly __tag: unique symbol };
export type Seconds =
    number & { readonly __tag: unique symbol };

export function seconds(n:number):Seconds {
  return Math.floor(n) as Seconds
}

export function secondsMs(n:number):SecondsMs {
  return n as SecondsMs
}





interface Props extends YouTubeProps {
  currentTime: number;
}

const Player: React.FC<Props> = (props) => {

  const ref = useRef<YouTube>(null)

  // track currentTime locally
  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))



  function onError(e:any) {
    console.log("ON ERROR", e)
  }

  // Track time accurately, report to parent
  useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.getCurrentTime().then(time => {
        setCurrentTime(seconds(time))
        props.onProgress?.({currentTime:time})
      }).catch(err => null)
    }, 100)
    return () => clearInterval(interval)
  })


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    var toTime = seconds(props.currentTime)
    if (currentTime && toTime != currentTime) {
      console.log("SEEK", toTime)
      ref.current?.seekTo(toTime)
    }
  }, [props.currentTime])


  return (
    <YouTube
      ref={ref}
      videoId={props.videoId}
      play={props.play}
      // onReady={onReady}
      // onChangeState={onChangeState}
      // onChangeQuality={onChangeQuality}
      // onError={onError}
      // style={props.style}
      {...props}
    />
  )
}




export default Player
