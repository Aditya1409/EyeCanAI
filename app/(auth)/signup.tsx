import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signup } from "@/lib/auth";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const success = await signup(username, password);
      if (success) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Signup Failed", "Username may already exist or server issue");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Signup Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginVertical: 10, borderRadius: 8 },
  button: { backgroundColor: "#0277bd", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { marginTop: 15, color: "#0277bd", textAlign: "center" },
});

