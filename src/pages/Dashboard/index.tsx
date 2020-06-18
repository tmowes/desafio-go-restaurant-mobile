import React, { useEffect, useState, useCallback } from 'react'
import { Image, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import Logo from '../../assets/logo-header.png'
import SearchInput from '../../components/SearchInput'
import api from '../../services/api'
import formatValue from '../../utils/formatValue'
import { Category, Food } from './types'
import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
  FoodsContainer,
  FoodList,
  FoodButton,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles'

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [searchValue, setSearchValue] = useState('')

  const { navigate } = useNavigation()

  async function handleNavigate(id: number): Promise<void> {
    navigate('FoodDetails', { id })
  }

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const { data } = await api.get<Food[]>('/foods', {
        params: {
          name_like: searchValue,
          category_like: selectedCategory,
        },
      })
      setFoods(
        data.map(food => {
          return {
            ...food,
            formattedPrice: formatValue(food.price),
          }
        }),
      )
    }
    loadFoods()
  }, [selectedCategory, searchValue])

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      const { data } = await api.get<Category[]>('/categories')
      setCategories(data)
    }
    loadCategories()
  }, [selectedCategory, searchValue])

  const handleSelectCategory = useCallback(
    (id: number) => {
      if (selectedCategory !== id) {
        setSelectedCategory(id)
      } else {
        setSelectedCategory(undefined)
      }
    },
    [selectedCategory],
  )

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigate('Home')}
          style={{ transform: [{ rotateY: '180deg' }] }}
        />
      </Header>
      <FilterContainer>
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle>{category.title}</CategoryItemTitle>
              </CategoryItem>
            ))}
          </CategorySlider>
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <FoodButton
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
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
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  )
}

export default Dashboard
