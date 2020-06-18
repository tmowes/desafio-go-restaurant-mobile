/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react'
import { Image } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import api from '../../services/api'
import formatValue from '../../utils/formatValue'
import { Food } from './types'
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

const Favorites: React.FC = () => {
  const { navigate } = useNavigation()
  // const isFocused = useIsFocused()
  const [favorites, setFavorites] = useState<Food[]>([])

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const { data } = await api.get<Food[]>('/favorites')
      setFavorites(
        data.map(food => {
          return {
            ...food,
            formattedPrice: formatValue(food.price),
          }
        }),
      )
    }
    loadFavorites()
  }, [])
  // }, [isFocused]) // dependencies to update screen after first render

  const handleDeleteFavorites = useCallback(
    async (favorite_id: number) => {
      await api.delete(`favorites/${favorite_id}`)
      setFavorites(favorites.filter(favorite => favorite.id !== favorite_id))
    },
    [favorites],
  )

  async function handleNavigate(id: number): Promise<void> {
    navigate('FoodDetails', { id })
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>
      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={food => String(food.id)}
          renderItem={({ item: food }) => (
            <FoodButton
              activeOpacity={0.6}
              onPress={() => handleNavigate(food.id)}
              onLongPress={() => handleDeleteFavorites(food.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: food.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{food.name}</FoodTitle>
                <FoodDescription>{food.description}</FoodDescription>
                <FoodPricing>{food.formattedPrice}</FoodPricing>
              </FoodContent>
            </FoodButton>
          )}
        />
      </FoodsContainer>
    </Container>
  )
}

export default Favorites
