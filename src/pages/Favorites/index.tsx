/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'

import api from '../../services/api'
import formatValue from '../../utils/formatValue'

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  FoodButton,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles'

interface Food {
  id: number
  name: string
  description: string
  price: number
  thumbnail_url: string
  formattedPrice: string
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([])

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const { data } = await api.get('favorites')
      const parsedData = data.map((food: { price: number }) => {
        return {
          ...food,
          formattedPrice: formatValue(food.price),
        }
      })
      setFavorites(parsedData)
    }
    loadFavorites()
  }, [])

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>
      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <FoodButton activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </FoodButton>
          )}
        />
      </FoodsContainer>
    </Container>
  )
}

export default Favorites
