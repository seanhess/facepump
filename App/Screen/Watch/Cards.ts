import { Seconds, seconds, milliseconds, Milliseconds } from '../../Data/Time'
import { Sub } from '../../Data/Subtitles'

type CardID = string

export interface GapCard {
  type: "Gap"
  id: CardID
  begin: Milliseconds
  end: Milliseconds
}

export interface SubCard {
  type: "Sub"
  id: CardID
  begin: Milliseconds
  end: Milliseconds
  subtitle: string
  translation?: string
}

export type Card = GapCard | SubCard

export function convertToCards(subs:Sub[]):Card[] {
  return subs.reduce<Card[]>(generateCards, [])
}

const GAP_THRESHOLD:Milliseconds = milliseconds(1000)

function generateCards(cards:Card[], next:Sub):Card[] {
  const lastEnd:Milliseconds = lastCardEndTime(cards)
  const sub = makeSub(next)

  if (isGap(lastEnd, next.begin)) {
    const gap = makeGap(lastEnd, next.begin)
    return cards.concat([gap, sub])
  }
  else {
    return cards.concat([sub])
  }
}

function isGap(lastEnd:Milliseconds, nextBegin:Milliseconds) {
  return nextBegin - lastEnd >= GAP_THRESHOLD
}

function lastCardEndTime(cards:Card[]):Milliseconds {
  return cards[cards.length - 1]?.end || milliseconds(0)
}

function makeGap(lastEnd:Milliseconds, nextStart:Milliseconds):GapCard {
  return {
    type: "Gap",
    id: "gap-" + lastEnd.toString(),
    begin: lastEnd,
    end: nextStart
  }
}

function makeSub(sub:Sub):SubCard {
  return {
    type: "Sub",
    id: "sub-" + sub.begin.toString(),
    subtitle: sub.subtitle,
    translation: sub.translation,
    begin: sub.begin,
    end: sub.end
  }
}