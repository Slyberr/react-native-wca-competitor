import { Link } from "expo-router";
import React from "react";
import { Button, Text, useColorScheme, useWindowDimensions, View } from "react-native";
import { TextThemed } from "./organics/TextThemed";
import useColorMode from "@/hooks/useColorMode";
import emojiFlags from "emoji-flags";

export const Card: React.FC<{ name: string, data: any }> = ({ name,data }) => {
    const {width : maxWidth}= useWindowDimensions()
    const colors = useColorMode(useColorScheme())
   
    return <View style={{  borderWidth: 3, borderColor:colors.border.color , margin: 4, padding:8, alignItems: "center", justifyContent: "space-between", flexDirection:"row" }}>
        <TextThemed numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20, maxWidth: maxWidth / 1.5 }} content={`${name} ${emojiFlags.countryCode(data?.code_country).emoji}` }></TextThemed>
        <Link href={{
                pathname: '/competitior/[id]',
                params: { id: data.wca_id, data : JSON.stringify(data) }
            }}
            style={{zIndex:10}}
        >
        <Button title="Consulter" color={colors.button.backgroundColor}></Button>
        </Link>
    </View>
}