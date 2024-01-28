import { type Hex, isHex } from 'viem'
import { z } from 'zod'

export const hexString = z.custom<Hex>((val) => isHex(val))
