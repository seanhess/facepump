
import { CurrentRenderContext } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { onChange } from 'react-native-reanimated';
import YouTube, { YouTubeProps } from 'react-native-youtube'
import { Milliseconds, SecondsMs, Seconds, milliseconds, fromMilliseconds } from '../../Data/Time'



interface ProgressEvent {
  currentTime: Milliseconds
}

interface Props extends YouTubeProps {
  currentTime: Milliseconds
  onProgress:(e:ProgressEvent) => void
}


type PlayerState = "buffering" | "playing" | "paused"

const Player: React.FC<Props> = (props) => {

  // Remove onProgress because it incorrectly reports the time when paused, and only at 500ms intervals
  // Call this manually in the interval above
  const { onProgress, onChangeState, ...rest } = props
  const [ playerState, setPlayerState ] = useState<PlayerState>("buffering")

  const ref = useRef<YouTube>(null)


  // track currentTime locally
  // can we use all milliseconds?
  // const [currentTime, setCurrentTime] = useState<Milliseconds>(milliseconds(0))

  const [resetTime, setResetTime] = useState<Milliseconds>(milliseconds(0))
  const [offsetTime, setOffsetTime] = useState<Milliseconds>(milliseconds(0))


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    const SEEK_THRESHOLD = milliseconds(500)
    var toTime = props.currentTime
    const currentTime = milliseconds(resetTime + offsetTime)
    // console.log("CHECK", toTime, currentTime)
    if (Math.abs(toTime - currentTime) >= SEEK_THRESHOLD) {
      console.log("Player.SEEK", currentTime, "=>", toTime)

      // Can only seek in 1s intervals
      ref.current?.seekTo(Math.floor(fromMilliseconds(toTime)))
      setResetTime(toTime)
      setOffsetTime(milliseconds(0))
    }
  }, [props.currentTime])


  // Report and track time with onProgress event
  function onProgressInternal(e:{currentTime: SecondsMs}) {
    // every half second reset to exact time
    const time = milliseconds(e.currentTime * 1000)
    // console.log("Player.RESET", time)
    setResetTime(time)
    setOffsetTime(milliseconds(0))
  }


  // Track time at 100ms resolution.
  useEffect(() => {
    if (playerState == "playing") {
      // console.log("Player.NewTimer")
      var offsetTime:number = 0
      const interval = setInterval(() => {
        offsetTime += 100
        const newTime = milliseconds(offsetTime)
        // console.log("Player.TIMER", newTime)
        setOffsetTime(newTime)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [playerState, resetTime])

  // report progress as a function of resetTime and offsetTime
  useEffect(() => {
    const currentTime = milliseconds(resetTime + offsetTime)
    // console.log(" - ", currentTime)
    onProgress({currentTime: currentTime})
  }, [resetTime, offsetTime])


  function onChangeStateInternal(e:{state:PlayerState}) {
    // console.log("Player.STATE", e.state)
    setPlayerState(e.state)
    // if (onChangeState) onChangeState() // Need to fix types file
  }



  return (
    <YouTube
      ref={ref}
      controls={0 as any} // 0 is definiately allowable. remove controls
      onProgress={onProgressInternal}
      onChangeState={onChangeStateInternal as any} // typed wrong!
      {...rest}
    />
  )
}




export default Player
