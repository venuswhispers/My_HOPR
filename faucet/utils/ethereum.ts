import type { Networks } from '@hoprnet/hopr-ethereum/scripts/addresses'

export const colors: {
  [key in Networks]?: string
} = {
  kovan: 'purple',
  private: 'grey',
}

export type { Networks }
