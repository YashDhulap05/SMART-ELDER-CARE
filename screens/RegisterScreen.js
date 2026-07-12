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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all fields");
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
      console.log("Sending request...");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/guardians/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: trimmedEmail, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Got response, status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        setErrorMsg(data.message || "Registration failed");
        return;
      }

      setErrorMsg("");
      navigation.navigate("Dashboard", { guardianId: data.guardian._id });
    } catch (error) {
      console.log("Fetch error:", error.message, error.name);
      if (error.name === "AbortError") {
        setErrorMsg("Request timed out after 10 seconds");
      } else {
        setErrorMsg("Could not connect to server: " + error.message);
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>🧓❤️</Text>
        <Text style={globalStyles.title}>Guardian Registration</Text>
        <Text style={globalStyles.subtitle}>
          Create an account to get started
        </Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}

        <TextInput
          style={globalStyles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[globalStyles.link, { color: COLORS.primary }]}>
            Already have an account?{" "}
            <Text style={{ fontWeight: "bold" }}>Login</Text>
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
