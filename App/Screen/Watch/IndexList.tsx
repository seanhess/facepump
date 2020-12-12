import React, { RefObject } from 'react';
import {
  FlatList,
  FlatListProps,
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';


export interface Props<T> extends FlatListProps<T> {
  currentIndex: number;
  onIndexChange: (index:number) => void
}

interface State {
  viewableIndex: number;
  userIsScrolling: boolean;
  animatingToIndex?: number;
}

interface ViewableItemsChanged {
  viewableItems: Array<ViewToken>
  changed: Array<ViewToken>
}

export class IndexList<ItemT = any> extends React.Component<Props<ItemT>, State> {

  ref:RefObject<FlatList<ItemT>>

  constructor(props:Props<ItemT>) {
    super(props)
    this.ref = React.createRef();
    this.state = {viewableIndex: 0, userIsScrolling: false, animatingToIndex: undefined}

    // https://stackoverflow.com/questions/48045696/flatlist-scrollview-error-on-any-state-change-invariant-violation-changing-on
    this.onItemChange = this.onItemChange.bind(this)
  }

  // Ok, so it goes on its merry way, but if the index changes
  // then scroll to it!
  componentDidUpdate(prev:Props<ItemT>) {
    // console.log("CHECK", "props.currentIndex:", this.props.currentIndex, "prev", prev.currentIndex, "state", this.state.localIndex )
    if (this.props.currentIndex != prev.currentIndex && this.props.currentIndex != this.state.viewableIndex) {
      console.log("IndexList.SCROLL", prev.currentIndex, "=>", this.props.currentIndex)
      this.setState({animatingToIndex: this.props.currentIndex})

      // don't do this if it's already visible
      this.ref.current?.scrollToIndex({animated: true, index: this.props.currentIndex})
    }
  }

  // I don't want to know if the item changed. I want to know if the user scrolled it (not scrollToIndex)
  onItemChange(e:ViewableItemsChanged) {
    // const f = (as:Array<ViewToken>) => as.map(i => [i.index, i.isViewable])
    const visible = e.viewableItems.filter(i => i.isViewable)
    const firstVisible = visible[0]
    // console.log(" - ", this.state.animatingToIndex, visible)

    if (this.state.animatingToIndex) {
      if (this.state.animatingToIndex == firstVisible?.index)
      // console.log("Done animating")
      this.setState({animatingToIndex: undefined})
    }
    else if (firstVisible?.index) {
      // console.log("nope", e.viewableItems)
      // check to see if it is different than the current index
      // this means the user was swiping
      // IF they are done scrolling, this means we changed the index
      // if not, then we changec the index when they lift their finger?
      // console.log("IndexList.onIndexChange", firstVisible.index)
      this.setState({viewableIndex: firstVisible.index})
      this.props.onIndexChange(firstVisible.index)
    }
    // else {
    //   // console.log("nope", e)
    // }

    // const index = e.viewableItems.find(info => info.isViewable)?.index
    // // is there a better way to check that a number has a value?
    // if (index || index === 0) {
    //   this.setState({localIndex: index})
    //   if (index != this.props.currentIndex) {
    //     this.props.onIndexChange(index)
    //   }
    // }
  }

  // I want to say when the user has scrolled to a new index
  // I could just pause when they begin drag...
  // but I'm not saying they are changing the index, am I?
  // it's an index change when...
  // 1. The user initiates a scroll
  // 2. They move to a
  onScrollBeginDrag(e:NativeSyntheticEvent<NativeScrollEvent>) {
    // console.log("Scroll BEGIN")
    this.setState({userIsScrolling: true})
    this.props.onScrollBeginDrag?.(e)
  }

  onScrollEndDrag(e:NativeSyntheticEvent<NativeScrollEvent>) {
    // console.log("Scroll END")
    this.setState({userIsScrolling: false})
    this.props.onScrollEndDrag?.(e)
  }

  // This is a pagination component
  // it displays one page at a time
  // it reports when the page changed
  // it reports when the user started scrolling
  // reports when the user stops scrolling?
  // is that 
  // it should definitely pause when you start scrolling
  // not sure if it should unpause when you stop

  // I want my interaction to be
  // 1. Swipe: Begin End Items
  // 2. Cancel: Begin End
  // 3. Slow: Begin Items End

  // But with different viewability config we could get different information
  // with a higher amounbt, it'll fire when one goes off the screen at all

  render() {
    return (
      <FlatList
        ref={this.ref}
        // I should bring the viewability threshold in here
        // at 50 changed == viewable
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
        onViewableItemsChanged={this.onItemChange}
        onScrollBeginDrag={e => this.onScrollBeginDrag(e)}
        onScrollEndDrag={e => this.onScrollEndDrag(e)}
        // onScrollAnimationEnd={e => console.log("onScrollEndDrag")}
        {...this.props}
      />
    )
  }
}

export default IndexList