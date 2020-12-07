
import React, { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-native-youtube'
import { Seconds, seconds} from '../Data/Time'


interface ProgressEvent {
  currentTime: Seconds
}

interface Props extends YouTubeProps {
  currentTime: Seconds;
  onProgress:(e:ProgressEvent) => void;
}


const Player: React.FC<Props> = (props) => {

  const ref = useRef<YouTube>(null)

  // track currentTime locally
  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))

  // Track time accurately, report to parent
  useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.getCurrentTime().then(time => {
        setCurrentTime(seconds(time))
        props.onProgress?.({currentTime:seconds(time)})
      }).catch(err => null) // discard errors?
    }, 100)
    return () => clearInterval(interval)
  })


  // Only seek if the currentTime is different from the internal time
  useEffect(() => {
    var toTime = props.currentTime
    // console.log("CHECK", toTime, currentTime)
    if (toTime != currentTime) {
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
