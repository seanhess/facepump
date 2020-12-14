import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  StatusBar,
  ScrollView,
  RefreshControl,
  Pressable
} from 'react-native';

import React from 'react';

import { Card as CardData, GapCard, SubCard } from './Cards'
import { Card, Paragraph, Text, Headline }  from 'react-native-paper';

export const CARD_WIDTH = 350
export const CARD_MARGIN = 10

export interface CardProps<T> {
  card: T,
  showTranslation: boolean,
  onPress: () => void,
  onPressIn: () => void,
  onRefresh: (card:SubCard) => void
}

export const CardView: React.FC<CardProps<CardData>> = (props) => {
  const { card, ...rest } =  props
  switch (card.type) {
    case 'Gap':
      return <GapView gap={card}/>
    case 'Sub':
      return <SubCardView card={card} {...rest}/>
  }

}

const GapView: React.FC<{gap:GapCard}> = ({gap}) => {
  return (
    <View style={StyleSheet.flatten([styles.gapCard, styles.card])}>
      <Text>...</Text>
    </View>
  )
}

const SubCardView: React.FC<CardProps<SubCard>> = ({card, showTranslation, onPress, onPressIn, onRefresh}) => {

  // const [refreshing, setRefreshing] = React.useState(false);

  // function onRefresh() {
  //   console.log("REFRESH")
  //   setRefreshing(true);
  //   // wait(2000).then(() => setRefreshing(false));
  // }
  
  return (
    <ScrollView
      refreshControl={ <RefreshControl refreshing={false} onRefresh={() => onRefresh(card)} /> }
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      >
      <Pressable onPress={onPress} onPressIn={onPressIn}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            {/* <Paragraph>{card.type}</Paragraph>
            <Paragraph>{card.begin}</Paragraph> */}
            <Headline>{card.subtitle}</Headline>
            <View style={styles.space}/>
            <Paragraph style={styleTranslation(showTranslation)}>
              {card.translation}
            </Paragraph>
          </Card.Content>
        </Card>
      </Pressable>
    </ScrollView>
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
  space: {
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }
})

function styleTranslation(shown:boolean) {
  return { 
    color: shown ? "#555" : "#FFF"
  }
}
