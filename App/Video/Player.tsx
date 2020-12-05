
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
      }).catch(err => null) // discard errors?
    }, 100)
    return () => clearInterval(interval)
  })


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    var toTime = seconds(props.currentTime)
    console.log("CHECK", toTime, currentTime)
    if (currentTime && toTime != currentTime) {
      console.log("SEEK", toTime, currentTime)
      ref.current?.seekTo(toTime)
    }
  }, [props.currentTime])



  // Remove onProgress because it incorrectly reports the time when paused, and only at 500ms intervals
  // Call this manually in the interval above
  const { onProgress, ...rest } = props

  return (
    <YouTube
      ref={ref}
      {...rest}
    />
  )
}




export default Player
