import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import Player from './Watch/Player'
import IndexList from './Watch/IndexList'
import { fromMilliseconds, Milliseconds, milliseconds } from '../Data/Time'
import * as Subtitles from '../Data/Subtitles'
import { TrackID } from '../Data/Subtitles'
import * as Cards from './Watch/Cards'
import { Card  } from './Watch/Cards'
import { CardView, CARD_WIDTH, getCardLayout } from './Watch/CardView'

import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  StatusBar,
} from 'react-native';


export interface Params {
  trackID: TrackID
}

// Is this in the props? Sure
interface Props {
  navigation: any;
  route: {params: Params}
}



const Watch: React.FC<Props> = ({route}) => {

  const trackID:TrackID = route.params?.trackID
  const [currentTime, setCurrentTime] = useState<Milliseconds>(milliseconds(0))
  const [cards, setCards] = useState<Array<Card>>([])
  const [playing, setPlaying] = useState<boolean>(true)

  // Derived data
  const currentCard = findCardForTime(cards, currentTime)
  const currentIndex = findIndex(cards, c => c == currentCard) || 0

  // console.log("WATCH", "time:", currentTime, "index:", currentIndex)

  useEffect(() => {
    console.log("Load Subs", trackID)
    async function load() {
      const subs = await Subtitles.loadSubs(trackID)
      const cards:Array<Card> = Cards.convertToCards(subs)
      setCards(cards)
    }
    load().catch(e => console.log("Load Subs Failed", e))
  }, [trackID])


  function onProgress(time:Milliseconds) {
    // console.log("Watch.onProgress", time)
    setCurrentTime(time)
  }

  function onScrollStart() {
    // console.log("Scroll Start")
    setPlaying(false)
  }

  function onIndexChange(index:number) {
    const card = cards[index]
    if (card) {
      const time:Milliseconds = card.begin
      console.log("Watch.onIndexChange", index, "begin:", time)
      setCurrentTime(time)
    }
  }

  function onPressCard() {
    // console.log("ON PRESS")
    setPlaying(!playing)
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}>
          <Player videoId={trackID}
            // TODO put a view over this to prevent taps, you can hide their loading screen the same way
            play={playing}
            currentTime={currentTime}
            onProgress={e => onProgress(e.currentTime)}
            style={styles.youtube}
          />
        </View>


        <IndexList
            // https://reactnative.dev/docs/flatlist
            // https://reactnative.dev/docs/scrollview
            data={cards}
            style={styles.cardList}
            currentIndex={currentIndex}
            onIndexChange={onIndexChange}
            renderItem={({item}) => <CardView card={item} onPress={onPressCard}/>}
            keyExtractor={(card) => card.id}
            horizontal={true}
            snapToAlignment={"center"}
            snapToInterval={CARD_WIDTH}
            decelerationRate={"fast"}
            disableIntervalMomentum={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={onScrollStart}
            getItemLayout={getCardLayout}

            // Properties that don't fix the initial offset issue
            // initialScrollIndex={0}
            // overScrollMode="never"
            // contentInset={{left: 15, top: 0, right: 0, bottom: 0}}
            // ListHeaderComponent={() => <View style={styles.cardHeader}/>}
            // ListFooterComponent={() => <View style={styles.cardHeader}/>}
            // snapToStart={false} 
            // pagingEnabled={true} // Disabled by snapTo props
            // scrollsToTop={false} // doesn't help
        />

        {/* <Button
          onPress={e => setCurrentTime(milliseconds(60500))}
          title="60.5 Seconds"
        /> */}

        {/* <Text>currentTime: {currentTime}</Text>
        <Text>currentIndex: {currentIndex}</Text>
        <DebugCardView card={currentCard}/> */}
      </SafeAreaView>
    </>
  )
}

// should I use the index instead? not necessarily
function findCardForTime(cards:Card[], currentTime:Milliseconds) {
  // BUG: two cards within the same second. We can't handle it!
  // console.log("CURRENT", currentTime)
  const current = cards.filter(c => flatSecond(c.begin) <= flatSecond(currentTime))
  // console.log("find card for time", "time:", currentTime, "cards:", current.map(c => c.begin))
  return last(current)
}

function flatSecond(ms:Milliseconds):number {
  return Math.floor(fromMilliseconds(ms))
}

function findIndex<T>(as:Array<T>, p:((a:T) => boolean)) {
  const i = as.findIndex(p)
  if (i > 0) {
    return i
  }
}

function last<T>(as:Array<T>) {
  if (as.length) {
    return as[as.length - 1]
  }
}



const DebugCardView: React.FC<{card:any}> = ({card}) => {
  if (card) {
    return <CardView card={card} onPress={() => {}}></CardView>
  }
  else {
    return <View/>
  }
}

const VIDEO_HEIGHT = 218

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
  cardList: {
    marginTop: 10

  }
})

export default Watch

