// Types to make it harder to mix up time representations
// - will catch errors when passed to functions
// - will not catch errors when compared (<=, ==, etc) (Typescript limitation)

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

export function fromMilliseconds(mss:Milliseconds):SecondsMs {
  return secondsMs(mss / 1000)
}