import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'

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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([])

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { data } = await api.get('orders')
      const parsedData = data.map((product: { price: number }) => {
        return {
          ...product,
          formattedValue: formatValue(product.price),
        }
      })
      setOrders(parsedData)
    }
    loadOrders()
  }, [])

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>
      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <FoodButton key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedValue}</FoodPricing>
              </FoodContent>
            </FoodButton>
          )}
        />
      </FoodsContainer>
    </Container>
  )
}

export default Orders
