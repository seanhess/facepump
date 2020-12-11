import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Player from './Watch/Player'
import IndexList from './Watch/IndexList'
import { Seconds, seconds, fromMilliseconds, Milliseconds, milliseconds } from '../Data/Time'
import * as Subtitles from '../Data/Subtitles'
import { TrackID } from '../Data/Subtitles'
import * as Cards from './Watch/Cards'
import { Card, GapCard, SubCard } from './Watch/Cards'

import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  Text,
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

  function moveTo(s:Milliseconds) {
    setCurrentTime(s)
  }

  function onProgress(time:Milliseconds) {
    // console.log("PROGRESS", time)
    setCurrentTime(time)
  }

  function onIndexChange(index:number) {
    const card = cards[index]
    if (card) {
      const time:Milliseconds = card.begin
      console.log("ON INDEX CHANGE", index, "begin:", time)
      // setCurrentTime(time)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}>
          <Player videoId={trackID}
            play
            currentTime={currentTime}
            onProgress={e => onProgress(e.currentTime)}
            style={styles.youtube}
          />
        </View>

        <Button
          onPress={e => moveTo(milliseconds(60500))}
          title="60.5 Seconds"
        />

        <IndexList
            data={cards}
            style={styles.cardList}
            currentIndex={currentIndex}
            initialScrollIndex={0}
            onIndexChange={onIndexChange}
            renderItem={({item}) => <CardView card={item}/>}
            keyExtractor={(card) => card.id}
            horizontal={true}
            snapToAlignment={"center"}
            snapToInterval={CARD_WIDTH}
            decelerationRate={"fast"}
            pagingEnabled
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 95 }}
            getItemLayout={(data, index) => (
              {length: CARD_WIDTH, offset: CARD_WIDTH * index - 20, index}
            )}
            // contentInset={{left: 15, top: 0, right: 0, bottom: 0}}
            // ListHeaderComponent={() => <View style={styles.cardHeader}/>}
            // ListFooterComponent={() => <View style={styles.cardHeader}/>}
        />
      </SafeAreaView>
    </>
  )
}

// should I use the index instead? not necessarily
function findCardForTime(cards:Card[], currentTime:Milliseconds) {
  // BUG: two cards within the same second. We can't handle it!
  const current = cards.filter(c => c.begin <= currentTime)
  // console.log("find card for time", "time:", currentTime, "cards:", current.map(c => c.begin))
  return last(current)
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


interface CardProps {
  card: Card
}

const CardView: React.FC<CardProps> = ({card}) => {
  switch (card.type) {
    case 'Gap':
      return <GapCardView card={card}/>
    case 'Sub':
      return <SubCardView card={card}/>
  }
}

const GapCardView: React.FC<{card:GapCard}> = ({card}) => {
  return (
    <View style={styles.gapCard}>
      <Text>{card.type}</Text>
      <Text>{card.begin}</Text>
    </View>
  )
}

const SubCardView: React.FC<{card:SubCard}> = ({card}) => {
  return (
    <View style={styles.card}>
      <Text>{card.type}</Text>
      <Text>{card.begin}</Text>
      <Text>{card.subtitle}</Text>
      <Text>{card.translation}</Text>
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
  gapCard: {
    width: CARD_WIDTH - 10,
    backgroundColor: "#FF0",
    height: 200,
    marginLeft: 5,
    marginRight: 5,
  },
  cardHeader: {
    width: 10,
    height: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#F00"
  },
  cardList: {
    backgroundColor: "#00F"
  }
})

export default Watch


// Sam. Double tap to pause. then scroll, then double tap to unpause