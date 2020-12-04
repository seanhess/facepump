import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef } from 'react';
import YouTube from 'react-native-youtube'

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

  const player = useRef<YouTube>(null);

  function messAround() {
    console.log("CLICK", player.current)
    player.current?.seekTo(39.5)
  }

  // console.log(player.current)

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}>
          <YouTube
            videoId="3dluAhOU1cA" // The YouTube video ID
            ref={player}
            // controls={2}
            // play // control playback of video with true/false
            // fullscreen // control whether the video should play in fullscreen or inline
            // loop // control whether the video should loop when ended
            // onReady={e => this.setState({ isReady: true })}
            // onChangeState={() => console.log("OnChangeState", e)}
            // onChangeQuality={e => console.log("OnChangeQuty", e})
            onError={e => console.log("ERROR")}
            style={styles.youtube}
          />
        </View>

        <Text>HELLO</Text>
        <Button onPress={e => messAround()} title="Do Something"/>


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