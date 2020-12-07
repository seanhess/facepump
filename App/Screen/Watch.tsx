import { HeaderBackground } from '@react-navigation/stack';
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-native-youtube'
import Player from '../Video/Player'
import { Seconds, seconds } from '../Data/Time'

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

type CardID = string

interface GapCard {
  type: "Gap"
  id: CardID
  start: Seconds
}

interface SubCard {
  type: "Sub"
  id: CardID
  start: Seconds
  subtitle: string
  translation: string
}

type Card = GapCard | SubCard

// Is this in the props? Sure
interface Props {
  cards: [Card]
}

interface OnViewableItemsChanged {
  viewableItems: Array<ViewToken>
  changed: Array<ViewToken>
}


const Watch: React.FC<Props> = (props) => {

  const [currentTime, setCurrentTime] = useState<Seconds>(seconds(0))
  const [cards, setCards] = useState<Array<Card>>()
  const [currentCard, setCurrentCard] = useState<Card>()

  // https://stackoverflow.com/questions/48045696/flatlist-scrollview-error-on-any-state-change-invariant-violation-changing-on
  // configure so it only counts one of them
  const onViewRef = useRef((e:OnViewableItemsChanged)=> {
    const card:Card = e.viewableItems.filter(c => c.isViewable).map(c => c.item)[0]
    console.log("ON VIEW REF", card)
    if (card) {
      console.log("SET CARD", card.start, card)
      setCurrentCard(card)
      setCurrentTime(card.start)
    }
  })
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 95 })

  // SIMULATE loading cards from the server
  // make illegal states unrepresentable!
  // they could have only a duration. then you woul da
  useEffect(() => {
    const cards:Array<Card> = [
      {type: "Sub", id: "one", start: seconds(0), subtitle: "hello", translation: "hola"},
      {type: "Gap", id: "two", start: seconds(33)},
      {type: "Sub", id: "three", start: seconds(120), subtitle: "goodbye", translation: "adios"},
    ]
    setCards(cards)
    setCurrentCard(cards[0])
  }, [])


  function moveTo(s:Seconds) {
    setCurrentTime(s)
  }

  function onProgress(time:Seconds) {
    console.log("PROGRESS", time)
    setCurrentTime(time)
  }

  console.log("RENDER", currentTime)

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
            data={cards}
            renderItem={({item}) => <Card card={item}/>}
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

interface CardProps {
  card: Card
}

const Card: React.FC<CardProps> = ({card}) => {
  switch (card.type) {
    case 'Gap':
      return <GapCard card={card}/>
    case 'Sub':
      return <SubCard card={card}/>
  }
}

const GapCard: React.FC<{card:GapCard}> = ({card}) => {
  return (
    <View style={styles.card}>
      <Text>{card.type}</Text>
      <Text>{card.start}</Text>
    </View>
  )
}

const SubCard: React.FC<{card:SubCard}> = ({card}) => {
  return (
    <View style={styles.card}>
      <Text>{card.type}</Text>
      <Text>{card.start}</Text>
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
  cards: {
  }
})

export default Watch


// Sam. Double tap to pause. then scroll, then double tap to unpause