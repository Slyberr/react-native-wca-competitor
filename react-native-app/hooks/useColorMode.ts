import { ColorSchemeName, StyleSheet, useColorScheme } from "react-native";

export default function useColorMode(theme: ColorSchemeName) : any {

    
    if (theme === 'light') {
        return colors.light
    }else {
        return colors.dark
    }

}

const colors = {
    dark : {
        backgroundColor : '#020842',
        border  :  {
            color : '#dfd9d9',
        },
        text : {
            color : '#FFFFFF'
        },

        input : {
            placeholderColor : '#dfd9d9',
            borderColor : '#dfd9d9',
            textColor : '#FFFFFF'
        }
    },
    light : {
        backgroundColor : '#cecece',
        border  :  {
            color : '#000000',
        },
        text : {
            color : '#000000'
        },
        input : {
            placeholderColor : '#000000',
            textColor : '#000000'
        }
    }

}