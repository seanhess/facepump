
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
  const [currentTime, setCurrentTime] = useState<Milliseconds>(milliseconds(0))


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    const SEEK_THRESHOLD = milliseconds(500)
    var toTime = props.currentTime
    // console.log("CHECK", toTime, currentTime)
    if (Math.abs(toTime - currentTime) >= SEEK_THRESHOLD) {
      console.log("SEEK", toTime, currentTime)
      ref.current?.seekTo(fromMilliseconds(toTime))
    }
  }, [props.currentTime])


  // Report and track time with onProgress event
  function onProgressInternal(e:{currentTime: SecondsMs}) {
    // every half second reset to exact time
    const time = milliseconds(e.currentTime * 1000)
    // console.log("RESET", time)
    setCurrentTime(time)
    onProgress({currentTime: time})
  }

  // Track time 100ms resolution
  useEffect(() => {
    if (playerState == "playing") {
      const interval = setInterval(() => {
          const newTime = milliseconds(currentTime + 100)
          setCurrentTime(newTime)
          onProgress({currentTime: newTime})
      }, 100)
      return () => clearInterval(interval)
    }
  }, [playerState, currentTime])

  function onChangeStateInternal(e:{state:PlayerState}) {
    console.log("CHANGE STATE", e.state)
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
