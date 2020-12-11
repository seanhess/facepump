import React, { RefObject } from 'react';
import { FlatList, FlatListProps, ViewToken } from 'react-native';


export interface Props<T> extends FlatListProps<T> {
  currentIndex: number;
  onIndexChange: (index:number) => void
}

interface State {
  localIndex: number;
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
    this.state = {localIndex: 0}

    // https://stackoverflow.com/questions/48045696/flatlist-scrollview-error-on-any-state-change-invariant-violation-changing-on
    // this.onItemChange = this.onItemChange.bind(this)
  }

  // Ok, so it goes on its merry way, but if the index changes
  // then scroll to it!
  componentDidUpdate(prev:Props<ItemT>) {
    // console.log("CHECK", "props.currentIndex:", this.props.currentIndex, "prev", prev.currentIndex, "state", this.state.localIndex )
    if (this.props.currentIndex != prev.currentIndex && this.props.currentIndex != this.state.localIndex) {
      console.log("SCROLL", this.props.currentIndex, "old:", prev.currentIndex)
      this.ref.current?.scrollToIndex({animated: true, index: this.props.currentIndex})
    }
  }

  // I don't want to know if the item changed. I want to know if the user scrolled it (not scrollToIndex)
  // onItemChange(e:ViewableItemsChanged) {
  //   const index = e.viewableItems.find(info => info.isViewable)?.index
  //   // is there a better way to check that a number has a value?
  //   if (index || index === 0) {
  //     this.setState({localIndex: index})
  //     if (index != this.props.currentIndex) {
  //       this.props.onIndexChange(index)
  //     }
  //   }
  // }

  render() {
    return (
      <FlatList
        ref={this.ref}
        // onViewableItemsChanged={this.onItemChange}
        {...this.props}
      />
    )
  }
}

export default IndexList