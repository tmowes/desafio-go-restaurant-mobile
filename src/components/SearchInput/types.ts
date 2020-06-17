import { TextInputProps } from 'react-native'

export interface InputProps extends TextInputProps {
  name?: string
}
export interface ContainerProps {
  isFocused: boolean
}
