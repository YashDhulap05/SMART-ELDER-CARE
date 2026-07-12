import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../config";
import { COLORS, globalStyles } from "../styles/theme";
export default function EmergencyRecordingScreen({ navigation, route }) {
  const { elderId, elderName, caretakerName, caretakerPhone } = route.params;

  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [existingEmergency, setExistingEmergency] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const suggestedScript = `This is ${elderName}. In case of emergency, please contact ${caretakerName} at ${caretakerPhone}.`;
  const loadExisting = async () => {
    try {
      const res = await fetch(`${API_URL}/schedules/elder/${elderId}`);
      const data = await res.json();
      const emergency = Array.isArray(data)
        ? data.find((s) => s.type === "emergency")
        : null;
      setExistingEmergency(emergency || null);
    } catch (error) {
      // silently ignore, not critical
    }
    setLoadingExisting(false);
  };

  useEffect(() => {
    loadExisting();
  }, []);

  const handleDeleteExisting = async () => {
    Alert.alert("Delete Emergency Message", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${API_URL}/schedules/${existingEmergency._id}`,
              { method: "DELETE" },
            );
            if (res.ok) {
              setExistingEmergency(null);
              setSuccessMsg("");
            }
          } catch (error) {
            Alert.alert("Error", "Could not delete");
          }
        },
      },
    ]);
  };
  const startRecording = async () => {
    try {
      setErrorMsg("");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setErrorMsg("Microphone permission is required");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      setErrorMsg("Could not start recording");
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
    } catch (error) {
      setErrorMsg("Could not stop recording");
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
    } catch (error) {
      setErrorMsg("Could not play recording");
    }
  };

  const handleUpload = async () => {
    if (!recordedUri) {
      setErrorMsg("Please record the emergency message first");
      return;
    }

    setUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("elderId", elderId);
      formData.append("title", "Emergency Message");
      formData.append("scheduledTime", new Date().toISOString());
      formData.append("type", "emergency");
      formData.append("audio", {
        uri: recordedUri,
        type: "audio/m4a",
        name: "emergency-message.m4a",
      });

      const response = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Upload failed");
        setUploading(false);
        return;
      }

      setSuccessMsg("Emergency message saved! 🚨");
      setRecordedUri(null);
      loadExisting();
    } catch (error) {
      setErrorMsg("Could not connect to server");
    }
    setUploading(false);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>🚨</Text>
        <Text style={globalStyles.title}>Emergency Voice Message</Text>
        <Text style={globalStyles.subtitle}>
          This plays when the emergency button is pressed
        </Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}
        {loadingExisting ? (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginBottom: 14 }}
          />
        ) : existingEmergency ? (
          <View style={styles.existingBox}>
            <Text style={styles.existingLabel}>
              ✅ Emergency message currently saved
            </Text>
            <Text style={styles.existingTime}>
              Saved:{" "}
              {new Date(existingEmergency.createdAt).toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={handleDeleteExisting}>
              <Text style={styles.deleteText}>Delete this message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noExisting}>No emergency message saved yet</Text>
        )}
        <View style={styles.scriptBox}>
          <Text style={styles.scriptLabel}>Suggested script:</Text>
          <Text style={styles.scriptText}>{suggestedScript}</Text>
        </View>

        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? "⏹ Stop Recording" : "🎙️ Start Recording"}
          </Text>
        </TouchableOpacity>

        {recordedUri ? (
          <TouchableOpacity style={styles.playButton} onPress={playRecording}>
            <Text style={styles.playButtonText}>▶ Play Recording</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpload}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {uploading ? "Uploading..." : "Save Emergency Message"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[globalStyles.link, { color: COLORS.primary }]}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  scriptBox: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD5D5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  scriptLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginBottom: 4,
    fontWeight: "600",
  },
  scriptText: { fontSize: 14, color: COLORS.text, fontStyle: "italic" },
  recordButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  recordingActive: { backgroundColor: "#C0392B" },
  recordButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  playButton: {
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  playButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  success: {
    color: COLORS.secondary,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  existingBox: {
    backgroundColor: "#F0FFF4",
    borderWidth: 1,
    borderColor: "#C6F6D5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  existingLabel: {
    fontWeight: "600",
    color: COLORS.secondary,
    marginBottom: 4,
  },
  existingTime: { fontSize: 12, color: COLORS.subtext, marginBottom: 8 },
  deleteText: { color: COLORS.error, fontWeight: "600", fontSize: 13 },
  noExisting: {
    color: COLORS.subtext,
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
});
