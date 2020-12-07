

// I want to make it impossible to misuse these

// export type SecondsMs = {
//   value: number;
//   readonly __tag: unique symbol;
// }

// // 12345
// export type Milliseconds = {
//   value: number;
//   readonly __tag: unique symbol;
// }

// // 12
// export type Seconds = {
//   value: number;
//   readonly __tag: unique symbol;
// }

// 12.345
export type SecondsMs =
    number & { readonly __tag: unique symbol };

// 12
export type Seconds =
    number & { readonly __tag: unique symbol };

// 12345
export type Milliseconds =
    number & { readonly __tag: unique symbol };

export function seconds(n:number):Seconds {
  return Math.floor(n) as Seconds
}

export function secondsMs(n:number):SecondsMs {
  return n as SecondsMs
}

// assumes you started with milliseconds
export function milliseconds(mss:number):Milliseconds {
  return Math.floor(mss) as Milliseconds
}

// // you have secs 00, it's valid 00.000
// export function fromSeconds(secs:Seconds):SecondsMs {
//   return { value: secs.value } as SecondsMs
// }

// export function fromMilliseconds(ms:Milliseconds):SecondsMs {
//   return { value: ms.value / 1000 } as SecondsMs
// }

// export function toSeconds(s:SecondsMs):Seconds {
//   return seconds(s.value)
// }

// export function toMilliseconds(s:SecondsMs):SecondsMs {
//   return secondsMs(s.value * 1000)
// }

// I need a time to convert to all together
// secondsMs sounds good

// toSecondsMs -> number secs.ms
// no, they all have a .value, that works



