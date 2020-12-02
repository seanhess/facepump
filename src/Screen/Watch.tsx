import { HeaderBackground } from '@react-navigation/stack';
import React, { useState } from 'react';

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

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.video}></View>
        <Text>HELLO</Text>

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

const Card: React.FC<{msg:string}> = ({msg}) => {
  return (
    <View style={styles.card}>
      <Text>{msg}</Text>
    </View>
  )
}

const CARD_WIDTH = 350

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24
  },
  video: {
    backgroundColor: "#F00",
    width: '100%',
    height: 250
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