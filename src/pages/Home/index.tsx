import React from 'react'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import Background from '../../assets/home-background.png'
import Logo from '../../assets/logo.png'
import {
  Container,
  BackgroundImage,
  Title,
  NavigationButton,
  ButtonText,
  IconContainer,
} from './styles'

const Home: React.FC = () => {
  const { navigate } = useNavigation()
  async function handleNavigate(): Promise<void> {
    navigate('MainBottom', {
      screen: 'Dashboard',
    })
  }

  return (
    <BackgroundImage
      source={Background}
      imageStyle={{
        width: 313,
        height: 427,
      }}
    >
      <Container>
        <Image source={Logo} />
        <Title>Uma verdadeira experiência Italiana.</Title>
      </Container>
      <NavigationButton onPress={() => handleNavigate()}>
        <ButtonText>Entrar no Restaurant</ButtonText>
        <IconContainer>
          <Icon name="log-in" size={24} color="#7A1818" />
        </IconContainer>
      </NavigationButton>
    </BackgroundImage>
  )
}

export default Home
