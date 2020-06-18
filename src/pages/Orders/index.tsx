/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react'
import { Image } from 'react-native'

import { useRoute, useIsFocused } from '@react-navigation/native'
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

const Orders: React.FC = () => {
  // const isFocused = useIsFocused()
  const [orders, setOrders] = useState<Food[]>([])

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const { data } = await api.get<Product[]>('/orders')
      setOrders(
        data.map(product => {
          return {
            ...product,
            formattedValue: formatValue(product.price),
          }
        }),
      )
    }
    loadOrders()
  }, [])

  // useEffect(() => {
  //   async function loadOrders(): Promise<void> {
  //     const { data } = await api.get<Product[]>('/orders')
  //     setOrders(
  //       data.map(product => {
  //         return {
  //           ...product,
  //           formattedValue: formatValue(product.price),
  //         }
  //       }),
  //     )
  //   }
  //   loadOrders()
  // }, [isFocused])

  const handleDeleteOrder = useCallback(
    async (order_id: number) => {
      await api.delete(`orders/${order_id}`)
      setOrders(orders.filter(order => order.id !== order_id))
    },
    [orders],
  )

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>
      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={order => String(order.id)}
          renderItem={({ item: order }) => (
            <FoodButton
              key={order.id}
              activeOpacity={0.6}
              onLongPress={() => handleDeleteOrder(order.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: order.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{order.name}</FoodTitle>
                <FoodDescription>{order.description}</FoodDescription>
                <FoodPricing>{order.formattedValue}</FoodPricing>
              </FoodContent>
            </FoodButton>
          )}
        />
      </FoodsContainer>
    </Container>
  )
}

export default Orders
