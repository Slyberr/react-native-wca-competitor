import { dataTagSymbol } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export const Card: React.FC<{ name: string, data: any }> = ({ name,data }) => {


    return <View style={{ height: 50, borderWidth: 4, borderColor: '#000000', margin: 4, alignItems: "center" }}>
        <Link href={{
                pathname: '/competitior/[id]',
                params: { id: data.wca_id, data : JSON.stringify(data) }
            }}
            
        >
        <Text style={{ color: '#000000' }}>{name}</Text>
        </Link>
    </View>
}