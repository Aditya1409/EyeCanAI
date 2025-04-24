import { useEffect, useState } from "react";
import {
  Text,
  Image,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { BASE_URL } from "@/constants/index";

export default function Home() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [translatedCaption, setTranslatedCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need permission to use the camera.");
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  const pickImage = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera access not granted.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setCaption("");
      await uploadImage(uri);
    }
  };

  const takePhoto = async () => {
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera access not granted.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setCaption("");
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(`${BASE_URL}/caption`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to get caption from backend.");
      const data = await response.json();
      setCaption(data.caption || "No caption received.");
      setTranslatedCaption("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      setCaption("");
    } finally {
      setLoading(false);
    }
  };

  const speakCaption = async () => {
    const voices = await Speech.getAvailableVoicesAsync();
  
    const matchingVoice = voices.find(
      (v) =>
        v.language.toLowerCase().startsWith(selectedLanguage) &&
        !v.name.toLowerCase().includes("enhanced") 
    );
  
    if (!matchingVoice) {
      Alert.alert("Voice Not Found", `No voice found for ${selectedLanguage}. Using default.`);
    }
  
    Speech.speak(translatedCaption || caption, {
      voice: matchingVoice?.identifier,
      language: selectedLanguage,
    });
  };
  
  

  const translateCaption = async (lang: string) => {
    setSelectedLanguage(lang);
    if (!caption) return;

    try {
      const response = await fetch(`${BASE_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: caption, target_lang: lang }),
      });

      const data = await response.json();
      setTranslatedCaption(data.translated || caption);
    } catch (error) {
      Alert.alert("Translation Error", "Could not translate text.");
      setTranslatedCaption("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Logo */}
      <Image source={require("@/assets/images/eyecanai-icon.png")} style={styles.logo} />
      <Text style={styles.title}>EyeCanAI</Text>

      <View style={styles.buttonContainer}>
        <Button title="Upload Image" onPress={pickImage} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Take a Picture" onPress={takePhoto} />
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.caption}>
            {translatedCaption ? translatedCaption : caption}
          </Text>

          {caption !== "" && (
            <>
              <View style={styles.buttonContainer}>
                <Button title="Play Audio Description" onPress={speakCaption} />
              </View>
              <Text style={{ marginTop: 10 }}>Translate To:</Text>
              <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue) => translateCaption(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Spanish" value="es" />
                <Picker.Item label="French" value="fr" />
                <Picker.Item label="German" value="de" />
                <Picker.Item label="Chinese" value="zh-cn" />
                <Picker.Item label="Japanese" value="jp" />
              </Picker>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
  caption: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 10,
    color: "#333",
  },
  buttonContainer: {
    marginVertical: 8,
    width: "80%",
  },
  picker: {
    width: 200,
    marginTop: 10,
  },
});



