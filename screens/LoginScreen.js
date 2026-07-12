import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../config";
import { COLORS, globalStyles } from "../styles/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    const passwordPattern = /^[A-Za-z0-9@#]+$/;
    if (/\s/.test(password)) {
      setErrorMsg("Password cannot contain spaces");
      return;
    }
    if (!passwordPattern.test(password)) {
      setErrorMsg(
        "Password can only contain letters, numbers, @ or # (no spaces)",
      );
      return;
    }
    try {
      const response = await fetch(`${API_URL}/guardians/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Login failed");
        return;
      }

      setErrorMsg("");
      navigation.navigate("Dashboard", { guardianId: data.guardian._id });
    } catch (error) {
      setErrorMsg("Could not connect to server. Check your connection.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={globalStyles.title}>Welcome Back</Text>
        <Text style={globalStyles.subtitle}>
          Login to manage your elder's care
        </Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[globalStyles.link, { color: COLORS.primary }]}>
            Don't have an account?{" "}
            <Text style={{ fontWeight: "bold" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
