/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react'
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation, useRoute } from '@react-navigation/native'
import formatValue from '../../utils/formatValue'
import api from '../../services/api'
import { Params, Food, Extra } from './type'
import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  FoodView,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalContainer,
  Title,
  TotalContainer,
  AdditionalItem,
  AdditionalItemText,
  AdditionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles'

const FoodDetails: React.FC = () => {
  const [food, setFood] = useState({} as Food)
  const [extras, setExtras] = useState<Extra[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [foodQuantity, setFoodQuantity] = useState(1)

  const { navigate, setOptions } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as Params

  useEffect(() => {
    async function loadFood(): Promise<void> {
      const { data } = await api.get<Food>(`/foods/${routeParams.id}`)
      setFood({ ...data, formattedPrice: formatValue(data.price) })
      setExtras(
        data.extras.map((extra: Omit<Extra, 'quantity'>) => ({
          ...extra,
          quantity: 0,
        })),
      )
    }
    loadFood()
  }, [routeParams])

  function handleIncrementExtra(id: number): void {
    setExtras(
      extras.map(extra => {
        if (extra.id === id) {
          return { ...extra, quantity: extra.quantity + 1 }
        }
        return extra
      }),
    )
  }

  function handleDecrementExtra(id: number): void {
    setExtras(
      extras.map(extra => {
        if (extra.id === id && extra.quantity > 0) {
          return { ...extra, quantity: extra.quantity - 1 }
        }
        return extra
      }),
    )
  }

  function handleIncrementFood(): void {
    setFoodQuantity(foodQuantity + 1)
  }

  function handleDecrementFood(): void {
    if (foodQuantity === 1) return
    setFoodQuantity(foodQuantity - 1)
  }

  const toggleFavorite = useCallback(async () => {
    if (isFavorite) {
      await api.delete(`/favorites/${food.id}`)
      setIsFavorite(false)
    } else {
      delete food.id
      delete food.extras
      delete food.formattedPrice
      await api.post('/favorites', food)
    }
    setIsFavorite(!isFavorite)
  }, [isFavorite, food])

  const cartTotal = useMemo(() => {
    return formatValue(
      food.price * foodQuantity +
        extras.reduce((acc, extra) => acc + extra.quantity * extra.value, 0),
    )
  }, [extras, food, foodQuantity])

  async function handleFinishOrder(): Promise<void> {
    const newOrder = {
      product_id: food.id,
      ...food,
      extras,
    }
    delete newOrder.id
    delete newOrder.formattedPrice
    await api.post('/orders', newOrder)
    navigate('MainBottom', { screen: 'Orders' })
    // Finish the order and save on the API
  }

  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  )

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    })
  }, [setOptions, favoriteIconName, toggleFavorite])

  return (
    <Container>
      <Header />
      <ScrollContainer>
        <FoodsContainer>
          <FoodView>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </FoodView>
        </FoodsContainer>
        <AdditionalContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdditionalItem key={extra.id}>
              <AdditionalItemText>{extra.name}</AdditionalItemText>
              <AdditionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdditionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdditionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdditionalQuantity>
            </AdditionalItem>
          ))}
        </AdditionalContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdditionalItemText testID="food-quantity">
                {foodQuantity}
              </AdditionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>
          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  )
}

export default FoodDetails
