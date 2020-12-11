

import data1 from '../../prototype/data_3dluAhOU1cA'
import data2 from '../../prototype/data_dJfSS0ZXYdo'
import data3 from '../../prototype/data_K9CgSjQDAvE'
import {Milliseconds, milliseconds} from './Time'

// I want to read the file
// how can I do this? It's json.

export type TrackID = string

export const HAPPY_GILMORE: TrackID = "3dluAhOU1cA"
export const TOP_GEAR: TrackID = "dJfSS0ZXYdo"
export const SLAV_CAR: TrackID = "K9CgSjQDAvE"

const VIDEOS: { [trackID: string]: HardCodedSubData } = {
  "3dluAhOU1cA":data1,
  "dJfSS0ZXYdo":data2,
  "K9CgSjQDAvE":data3
}

type MTranslations = { [index: string]:string }

interface HardCodedSubData {
  mTranslations: MTranslations
  subtitles: SubInput[]
}

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

// TODO load videos from server
// export async function loadAllVideos():Promise<Array<TrackID>> {
//   return Object.keys(VIDEOS)
// }

export async function loadSubs(trackID:TrackID):Promise<Array<Sub>> {
  const data = VIDEOS[trackID]
  const subInps:SubInput[] = data.subtitles
  const mTrans:MTranslations = data.mTranslations

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

