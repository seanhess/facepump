import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-native-youtube'
import Player from '../Video/Player'
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
  cards: [Card]
}

interface OnViewableItemsChanged {
  viewableItems: Array<ViewToken>
  changed: Array<ViewToken>
}


const Watch: React.FC<Props> = (props) => {

  const cardListRef = useRef<FlatList<Card>>(null)


  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))
  const [cards, setCards] = useState<Array<Card>>()

  // Derived data
  const currentCard = findCurrentCard(cards || [], currentTime)
  const currentIndex = cards?.findIndex(c => c == currentCard)

  // useEffect(() => {
  //   console.log("INDEX", currentIndex, currentCard)
  //   if (currentIndex && currentIndex >= 0) {
  //     console.log("MOVE", currentIndex)
  //     cardListRef.current?.scrollToIndex({animated: true, index: currentIndex})
  //   }
  // }, [currentIndex])

  // SIMULATE loading cards from the server
  // make illegal states unrepresentable!
  // they could have only a duration. then you woul da
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

  // https://stackoverflow.com/questions/48045696/flatlist-scrollview-error-on-any-state-change-invariant-violation-changing-on
  // configure so it only counts one of them
  const onViewRef = useRef((e:OnViewableItemsChanged)=> {
    const card:Card = e.viewableItems.filter(c => c.isViewable).map(c => c.item)[0]
    // console.log("ON VIEW REF", card)
    if (card) {
      const time = seconds(fromMilliseconds(card.begin))
      console.log("SET CARaD", card.begin, time, card)
      setCurrentTime(time)
    }
  })
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 95 })


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
            onProgress={e => onProgress(e.currentTime)}
            style={styles.youtube}
          />
        </View>

        <Button
          onPress={e => moveTo(seconds(60))}
          title="60 Secondsx"
        />

        <FlatList
            ref={cardListRef}
            data={cards}
            renderItem={({item}) => <CardView card={item}/>}
            keyExtractor={(card) => card.id}
            horizontal={true}
            snapToAlignment={"center"}
            snapToInterval={CARD_WIDTH}
            decelerationRate={"fast"}
            pagingEnabled
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
      // {type: "Gap", id: "two", start: seconds(20)},
        />
      </SafeAreaView>
    </>
  )
}

// should I use the index instead? not necessarily
function findCurrentCard(cards:Card[], currentTime:Seconds) {
  const current = cards.filter(c => fromMilliseconds(c.begin) < currentTime)
  if (current.length) {
    return current[current.length - 1]
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