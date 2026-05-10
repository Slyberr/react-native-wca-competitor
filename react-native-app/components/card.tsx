import { Link } from "expo-router";
import React from "react";
import { Button, Text, useWindowDimensions, View } from "react-native";

export const Card: React.FC<{ name: string, data: any }> = ({ name,data }) => {
    const {width : maxWidth}= useWindowDimensions()

    return <View style={{  borderWidth: 3, borderColor: '#000000', margin: 4, padding:8, alignItems: "center", justifyContent: "space-between", flexDirection:"row" }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: '#000000',fontSize:20, maxWidth: maxWidth / 1.5 }}>{name}</Text>
        <Link href={{
                pathname: '/competitior/[id]',
                params: { id: data.wca_id, data : JSON.stringify(data) }
            }}
            style={{zIndex:10}}
            
        >
        <Button title="Consulter" color={'#000000'}></Button>
        </Link>
    </View>
}