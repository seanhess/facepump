// Debug home screen

import React, { useState } from 'react';
import * as Watch from './Watch'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { HAPPY_GILMORE, SLAV_CAR, TOP_GEAR, TrackID } from '../Data/Subtitles';

// TODO move to Route or Navigate module
type Screen = 'Home' | 'Watch'


type Navigation<T> = {
  navigate: (screen:Screen, params: T ) => void
}

type Props = {
  navigation: Navigation<Watch.Params>
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  function goWatch(track:TrackID) {
    navigation.navigate('Watch', {trackID: track})
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionRowButton}>
              <Button onPress={_ => goWatch(HAPPY_GILMORE)} title="Happy Gilmore"/>
            </View>
            <View style={styles.sectionRowButton}>
              <Button onPress={_ => goWatch(TOP_GEAR)} title="Top Gear"/>
            </View>
            <View style={styles.sectionRowButton}>
              <Button onPress={_ => goWatch(SLAV_CAR)} title="Slav Car"/>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <View>
              <Text style={styles.sectionContainer}>Hello</Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  sectionRowSplit: {
    display: "flex",
    flexDirection: "row"
  },
  sectionRowButton: {
    flex: 1
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default HomeScreen;

