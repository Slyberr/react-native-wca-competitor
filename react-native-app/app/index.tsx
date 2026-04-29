import useGetUserInfo from "@/hooks/useGetUserInfo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [myValue, setInputValue] = React.useState("");
  let Loading = null;
  const router = useRouter();

  const { refetch } = useGetUserInfo(myValue);
  const fetchData = async () => {
    const { data } = await refetch();
    if (data) {
      Loading = "Chargement...";
      router.push({
        pathname: `/competitior/[id]`,
        params: {
          id: data?.id ?? "",
          data: JSON.stringify(data),
        },
      });
    } else {
      return ToastAndroid.show(
        "Erreur: " + myValue + " ne correspond à aucun profil.",
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: "center", gap: 10, margin: 10 }}>
          <Text style={{ fontSize: 25 }}>
            Bienvenue sur competitor Viewer !
          </Text>
          <Image
            style={{ width: 350, height: 350 }}
            source={require("@/assets/images/WCA-logo.png")}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, marginTop: 30 }}>
            Trouvez votre compétiteur.
          </Text>
          <TextInput
            onChangeText={setInputValue}
            value={myValue}
            style={{
              borderColor: "#000000",
              borderStyle: "solid",
              borderRadius: 10,
              borderWidth: 1,
              width: "80%",
              marginTop: 30,
            }}
            defaultValue=""
            placeholder="Entrez l'ID WCA"
          ></TextInput>

          <Button title="Search" color="#000000" onPress={fetchData}></Button>
          <Text>{Loading}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 30 },
});
