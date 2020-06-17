export interface Food {
  id: number
  name: string
  description: string
  price: number
  thumbnail_url: string
  formattedPrice: string
}
export interface Category {
  id: number
  title: string
  image_url: string
}
export interface CategoryItemProps {
  isSelected?: boolean
}
