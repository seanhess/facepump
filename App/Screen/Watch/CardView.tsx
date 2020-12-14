import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  StatusBar,
  Pressable
} from 'react-native';

import React from 'react';

import { Card as CardData, GapCard, SubCard } from './Cards'
import { Card, Paragraph, Text, Headline }  from 'react-native-paper';

export const CARD_WIDTH = 350
export const CARD_MARGIN = 10

export interface CardProps<T> {
  card: T,
  onPress: () => void
}

export const CardView: React.FC<CardProps<CardData>> = ({card, onPress}) => {
  switch (card.type) {
    case 'Gap':
      return <GapView gap={card}/>
    case 'Sub':
      return <SubCardView card={card} onPress={onPress}/>
  }

}

const GapView: React.FC<{gap:GapCard}> = ({gap}) => {
  return (
    <View style={StyleSheet.flatten([styles.gapCard, styles.card])}>
      <Text>...</Text>
    </View>
  )
}

const SubCardView: React.FC<CardProps<SubCard>> = ({card, onPress}) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* <Paragraph>{card.type}</Paragraph>
        <Paragraph>{card.begin}</Paragraph> */}
        <Headline>{card.subtitle}</Headline>
        <Paragraph style={styles.translation}>{card.translation}</Paragraph>
      </Card.Content>
    </Card>
  )
}

export function getCardLayout(data:CardData[] | null | undefined, index:number) {
  return {length: CARD_WIDTH, offset: CARD_WIDTH * index - 2 * CARD_MARGIN, index}
}


const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH - CARD_MARGIN,
    height: 300,
    marginLeft: 5,
    marginRight: 5,
  },
  gapCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  subtitle: {
    fontWeight: "500"
  },
  translation: {
    color: "#555",
  }
})