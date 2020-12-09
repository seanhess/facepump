import React, { useState } from 'react';

import {
  Button,
  View,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  count: number,
  onCount: (count: number) => void
}

const Counter: React.FC<Props> = (props) => {
  console.log("COUNT", props.count)
  return (
    <View style={{width: '100%'}}>
      <Text style={styles.text}>{props.count}</Text>
      <View style={styles.row}>
        <View style={styles.btn}>
          <Button
            onPress={() => props.onCount(props.count-1)}
            title="-1"
           />
        </View>
        <View style={styles.btn}>
          <Button
            onPress={() => props.onCount(props.count+1)}
            title="+1"
           />
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row"
  },
  // TODO move common styles somewhere and compose
  text: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#EEE'
  },
  btn: {
    flex: 1
  },
});

export default Counter