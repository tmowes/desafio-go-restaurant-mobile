import React, { useEffect, useState, useCallback } from 'react'
import { Image } from 'react-native'

import { useRoute } from '@react-navigation/native'
import api from '../../services/api'
import formatValue from '../../utils/formatValue'
import { Food, Product } from './types'

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

interface Params {
  id: number
}

const Orders: React.FC = () => {
  const { params } = useRoute()
  const routeParams = params as Params
  const [loadingState, setLoadingState] = useState(true)
  const [orders, setOrders] = useState<Food[]>([])

  useEffect(() => {
    setLoadingState(true)
  }, [])

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { data } = await api.get<Product[]>('/orders')
      const parsedData = data.map(product => {
        return {
          ...product,
          formattedValue: formatValue(product.price),
        }
      })
      setOrders(parsedData)
    }
    if (loadingState) {
      loadOrders()
      setLoadingState(false)
    }
  }, [loadingState, orders])

  const handleDeleteOrder = useCallback(async (order_id: number) => {
    await api.delete(`orders/${order_id}`)
    setLoadingState(true)
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
            <FoodButton
              key={item.id}
              activeOpacity={0.6}
              onLongPress={() => handleDeleteOrder(item.id)}
            >
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
