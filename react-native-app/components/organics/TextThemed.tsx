import useColorMode from "@/hooks/useColorMode"
import { JSX } from "react";
import { StyleProp, Text, TextProps, TextStyle, useColorScheme } from "react-native";

type Props =  TextProps & {
  content : string | JSX.Element ,
  style? : StyleProp<TextStyle>
  
}


export function TextThemed({content,style,...textProps} : Props) : JSX.Element {
    const colorScheme = useColorScheme()
    const color = useColorMode(colorScheme)

    return  <Text style={[{ color : color.text.color},style]} {...textProps}>
                {content}
            </Text>
} 
