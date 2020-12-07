

import data from '../../prototype/data'
import {Milliseconds, milliseconds} from './Time'

// I want to read the file
// how can I do this? It's json.

type TrackID = null


interface SubInput {
  begin: number
  end: number
  text: string
}

export interface Sub {
  begin: Milliseconds
  end: Milliseconds
  subtitle: string
  translation?: string
}

export async function loadSubs(trackID:TrackID):Promise<Array<Sub>> {
  const subInps:SubInput[] = data.subtitles
  const mTrans:any = data.mTranslations as any

  // look up by index
  const subs:Sub[] = subInps.map(function(s:SubInput, i:number):Sub {
    const index:string = i.toString()
    return {
      begin: milliseconds(s.begin),
      end: milliseconds(s.end),
      subtitle: s.text,
      translation: mTrans[index]
    }
  })

  return subs
}

