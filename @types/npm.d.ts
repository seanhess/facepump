
declare module "react-native-youtube-sdk" {
  import * as React from 'react';
  import * as ReactNative from 'react-native';

  type NativeEvent = any

  interface Props extends ReactNative.ViewProps {
    videoId: string;
    autoPlay: boolean;
    fullscreen: boolean;
    startTime: number;
    showFullScreenButton: boolean;
    showSeekBar: boolean;
    showPlayPauseButton: boolean;
    onReady: (e:NativeEvent) => void;
    onError: (e:NativeEvent) => void;
    onChangeState: (e:NativeEvent) => void;
    onChangeFullscreen: (e:NativeEvent) => void;
  }

  class YouTubePlayer extends React.Component<Props> {

  }

  export = YouTubePlayer;
}