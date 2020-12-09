import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Player from './Watch/Player'
import IndexList from './Watch/IndexList'
import { Seconds, seconds, fromMilliseconds } from '../Data/Time'
import * as Subtitles from '../Data/Subtitles'
import * as Cards from './Watch/Cards'
import { Card, GapCard, SubCard } from './Watch/Cards'

import {
  SafeAreaView,
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  StatusBar,
  ViewToken
} from 'react-native';



// Is this in the props? Sure
interface Props {

}



const Watch: React.FC<Props> = (props) => {

  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))
  const [cards, setCards] = useState<Array<Card>>([])

  // Derived data
  const currentCard = findCardForTime(cards, currentTime)
  const currentIndex = findIndex(cards, c => c == currentCard) || 0

  // console.log("WATCH", "time:", currentTime, "index:", currentIndex)


  useEffect(() => {
    async function load() {
      const subs = await Subtitles.loadSubs(null)
      const cards:Array<Card> = Cards.convertToCards(subs)
      setCards(cards)
    }
    load()
  }, [])

  function moveTo(s:Seconds) {
    setCurrentTime(s)
  }

  function onProgress(time:Seconds) {
    // console.log("PROGRESS", time)
    setCurrentTime(time)
  }

  function onIndexChange(index:number) {
    const card = cards[index]
    if (card) {
      const time = seconds(fromMilliseconds(card.begin))
      console.log("ON INDEX CHANGE", index, "begin:", time)
      setCurrentTime(time)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}>
          <Player
            videoId="3dluAhOU1cA" // The YouTube video ID
            play
            currentTime={currentTime}
            onProgress={e => onProgress(e.currentTime)}
            style={styles.youtube}
          />
        </View>

        <Button
          onPress={e => moveTo(seconds(60))}
          title="60 Secondsx"
        />

        <IndexList
            data={cards}
            currentIndex={currentIndex}
            onIndexChange={onIndexChange}
            renderItem={({item}) => <CardView card={item}/>}
            keyExtractor={(card) => card.id}
            horizontal={true}
            snapToAlignment={"center"}
            snapToInterval={CARD_WIDTH}
            decelerationRate={"fast"}
            pagingEnabled
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 95 }}
      // {type: "Gap", id: "two", start: seconds(20)},
        />
      </SafeAreaView>
    </>
  )
}

// should I use the index instead? not necessarily
function findCardForTime(cards:Card[], currentTime:Seconds) {
  // Find all cards less than the current time, and take the last one
  const current = cards.filter(c => seconds(fromMilliseconds(c.begin)) <= currentTime)
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
    height: 200,
    marginLeft: 5,
    marginRight: 5,
  },
  cards: {
  }
})

export default Watch


// Sam. Double tap to pause. then scroll, then double tap to unpause