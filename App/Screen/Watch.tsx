import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef } from 'react';
import YouTube from 'react-native-youtube'
import Player, { seconds, Seconds } from '../Video/Player'

import {
  SafeAreaView,
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  StatusBar,
} from 'react-native';


type Props = {}

const CARDS = ["one", "two", "three", "four", "five", "six", "seven"]

const Watch: React.FC<Props> = (props) => {

  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))

  function messAround() {
    // player.current?.seekTo(40.9)
    setCurrentTime(seconds(60))
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}>
          <Player
            videoId="3dluAhOU1cA" // The YouTube video ID
            currentTime={currentTime}
            play
            // ref={player}
            // controls={2}
            // play // control playback of video with true/false
            // fullscreen // control whether the video should play in fullscreen or inline
            // loop // control whether the video should loop when ended
            // onReady={e => this.setState({ isReady: true })}
            // onChangeState={() => console.log("OnChangeState", e)}
            // onChangeQuality={e => console.log("OnChangeQuty", e})
            // onError={e => console.log("ERROR")}
            onProgress={(e => setCurrentTime(e.currentTime))}
            style={styles.youtube}
          />
        </View>

        <Button onPress={e => messAround()} title="60 Seconds"/>

        <FlatList
            data={CARDS}
            renderItem={({item}) => <Card msg={item}/>}
            keyExtractor={(card) => card}
            horizontal={true}
            snapToAlignment={"center"}
            snapToInterval={CARD_WIDTH}
            decelerationRate={"fast"}
            pagingEnabled
        />
      </SafeAreaView>
    </>
  )
}

interface CardProps {
  msg: string
}

const Card: React.FC<CardProps> = ({msg}) => {
  return (
    <View style={styles.card}>
      <Text>{msg}</Text>
    </View>
  )
}

const CARD_WIDTH = 350
const VIDEO_HEIGHT = 250

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24
  },
  video: {
    backgroundColor: "#F00",
    width: '100%',
    height: VIDEO_HEIGHT
  },
  youtube: {
    height: VIDEO_HEIGHT,
  },
  card: {
    width: CARD_WIDTH - 10,
    height: 200,
    backgroundColor: "#0F0",
    marginLeft: 5,
    marginRight: 5,
  },
  cards: {
  }
})

export default Watch


// Sam. Double tap to pause. then scroll, then double tap to unpause