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

  const { setOptions } = useNavigation()
  const { params } = useRoute()

  const routeParams = params as Params

  useEffect(() => {
    async function loadFood(): Promise<void> {
      // Load a specific food with extras based on routeParams id
      const { data } = await api.get(`foods/${routeParams.id}`)
      setFood(data)
      setExtras(data.extras)
    }
    loadFood()
  }, [routeParams])

  function handleIncrementExtra(id: number): void {
    // Increment extra quantity
  }

  function handleDecrementExtra(id: number): void {
    // Decrement extra quantity
  }

  function handleIncrementFood(): void {
    // Increment food quantity
  }

  function handleDecrementFood(): void {
    // Decrement food quantity
  }

  const toggleFavorite = useCallback(() => {
    setIsFavorite(state => !state)
    // Toggle if food is favorite or not
  }, [isFavorite, food])

  const cartTotal = useMemo(() => {
    // Calculate cartTotal
    const totalOrder = food.price
    // filtrar extras pela quantity >= 1 antes de fazer reduce
    const extrasTotal = extras.reduce((acc, extra) => {
      const subtotal = extra.quantity * extra.value
      return acc + subtotal
    }, 0)
    console.log(extrasTotal)
    const total = extrasTotal * foodQuantity * food.price
    return formatValue(totalOrder)
  }, [extras, food, foodQuantity])

  async function handleFinishOrder(): Promise<void> {
    // Finish the order and save on the API
  }

  // Calculate the correct icon name
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
