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

export default function ElderProfileScreen({ navigation, route }) {
  const { guardianId } = route.params;
  const [elderName, setElderName] = useState("");
  const [elderAge, setElderAge] = useState("");
  const [caretakerName, setCaretakerName] = useState("");
  const [caretakerPhone, setCaretakerPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async () => {
    if (!elderName || !elderAge || !caretakerName || !caretakerPhone) {
      setErrorMsg("Please fill in all fields");
      setSuccessMsg("");
      return;
    }

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(elderName)) {
      setErrorMsg("Elder's name should only contain letters");
      setSuccessMsg("");
      return;
    }

    const age = parseInt(elderAge, 10);
    if (isNaN(age) || age <= 0 || age > 120) {
      setErrorMsg("Please enter a valid age (1-120)");
      setSuccessMsg("");
      return;
    }

    if (!namePattern.test(caretakerName)) {
      setErrorMsg("Caretaker's name should only contain letters");
      setSuccessMsg("");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(caretakerPhone)) {
      setErrorMsg("Please enter a valid 10-digit phone number");
      setSuccessMsg("");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/elders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guardianId,
          elderName,
          elderAge: age,
          caretakerName,
          caretakerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Could not save profile");
        setSuccessMsg("");
        return;
      }

      setErrorMsg("");
      setSuccessMsg(`${elderName}'s profile has been created! 🎉`);
      setTimeout(() => {
        navigation.navigate("Dashboard", { guardianId });
      }, 1000);
    } catch (error) {
      setErrorMsg("Could not connect to server. Check your connection.");
      setSuccessMsg("");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>👵📋</Text>
        <Text style={globalStyles.title}>Elder Profile</Text>
        <Text style={globalStyles.subtitle}>
          Tell us about the elder you're caring for
        </Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

        <TextInput
          style={globalStyles.input}
          placeholder="Elder's Full Name"
          placeholderTextColor="#999"
          value={elderName}
          onChangeText={setElderName}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Elder's Age"
          placeholderTextColor="#999"
          value={elderAge}
          onChangeText={setElderAge}
          keyboardType="numeric"
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Caretaker's Name"
          placeholderTextColor="#999"
          value={caretakerName}
          onChangeText={setCaretakerName}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Caretaker's Phone Number"
          placeholderTextColor="#999"
          value={caretakerPhone}
          onChangeText={setCaretakerPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  success: {
    color: COLORS.secondary,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});
