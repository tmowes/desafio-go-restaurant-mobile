export interface Params {
  id: number
}

export interface Extra {
  id: number
  name: string
  value: number
  quantity: number
}

export interface Food {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  formattedPrice: string
  extras: Extra[]
}
