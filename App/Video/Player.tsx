
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

  // state. current time

  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))

  function onReady() {
    console.log("ON READY")
  }

  function onChangeState() {
    console.log("ON CHANGE STATE")
  }

  function onChangeQuality() {
    console.log("ON CHANGE QUALITY")
  }

  // Doesn't work if paused! The onProgress event isn't called
  // noooooo
  // so the effect will work
  // but it might think we are still there
  // so maybe we shouldn't use this, but should get the time from the player
  // Id on't know anything is hcanging when they pan.
  // I could get the current time on an interval
  // why doesn't this work on pause? that's stupid. 
  // ok, so it's paused
  // then...
  // function onProgress(e:EventProgress) {
  //   // console.log("ON PROGRESS", e)
  //   setCurrentTime(secondsMs(e.currentTime))
  //   props.onProgress?.({currentTime: seconds(e.currentTime)})
  // }

  function onError(e:any) {
    console.log("ON ERROR", e)
  }

  // Track time accurately, report to parent
  useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.getCurrentTime().then(time => {
        console.log("TIME", time)
        setCurrentTime(seconds(time))
        props.onProgress?.({currentTime:time})
      }).catch(err => null)
    }, 100)
    return () => clearInterval(interval)
  })


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    var toTime = seconds(props.currentTime)
    console.log("CHECK", props.currentTime, seconds(props.currentTime), currentTime)
    if (currentTime && toTime != currentTime) {
      console.log("SEEK", toTime)
      ref.current?.seekTo(toTime)
    }
  }, [props.currentTime])

  // we need to recalculate this?
  // no, not really, it's another effect?
  // should we seek 
    // })
    // }

  return (
    <YouTube
      ref={ref}
      onReady={onReady}
      onChangeState={onChangeState}
      onChangeQuality={onChangeQuality}
      onError={onError}
      videoId={props.videoId}
      play={props.play}
      style={props.style}
      // {...props}
    />
  )
}




export default Player
