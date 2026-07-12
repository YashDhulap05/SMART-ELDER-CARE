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
import NavMenu from "./NavMenu";
export default function DashboardScreen({ navigation, route }) {
  const { guardianId } = route.params;
  const [loading, setLoading] = useState(true);
  const [elder, setElder] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const elderRes = await fetch(`${API_URL}/elders/${guardianId}`);
      const elderData = await elderRes.json();

      if (!elderRes.ok || !Array.isArray(elderData) || elderData.length === 0) {
        navigation.replace("ElderProfile", { guardianId });
        return;
      }

      const currentElder = elderData[0];
      setElder(currentElder);

      const remindersRes = await fetch(
        `${API_URL}/schedules/elder/${currentElder._id}`,
      );
      const remindersData = await remindersRes.json();
      setReminders(
        Array.isArray(remindersData)
          ? remindersData.filter((r) => r.type !== "emergency")
          : [],
      );
    } catch (error) {
      setErrorMsg("Could not load dashboard. Check your connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (scheduleId) => {
    try {
      const res = await fetch(`${API_URL}/schedules/${scheduleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReminders(reminders.filter((r) => r._id !== scheduleId));
      } else {
        Alert.alert("Error", "Could not delete reminder");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  const confirmDelete = (scheduleId, title) => {
    Alert.alert("Delete Reminder", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(scheduleId),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <NavMenu
        navigation={navigation}
        guardianId={guardianId}
        elderId={elder?._id}
        elderName={elder?.elderName}
        caretakerName={elder?.caretakerName}
        caretakerPhone={elder?.caretakerPhone}
      />
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>👵</Text>
        <Text style={globalStyles.title}>{elder?.elderName}'s Dashboard</Text>
        <Text style={globalStyles.subtitle}>
          Age {elder?.elderAge} • Caretaker: {elder?.caretakerName}
        </Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}

        <Text style={styles.sectionTitle}>
          Voice Reminders ({reminders.length})
        </Text>

        {reminders.length === 0 ? (
          <Text style={styles.emptyText}>No reminders yet</Text>
        ) : (
          reminders.map((item) => (
            <View key={item._id} style={styles.reminderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderTime}>🕐 {item.scheduledTime}</Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(item._id, item.title)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("VoiceRecording", { elderId: elder._id })
          }
        >
          <Text style={styles.buttonText}>+ Add Voice Reminder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 10,
  },
  emptyText: { color: COLORS.subtext, textAlign: "center", marginBottom: 14 },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  reminderTitle: { fontWeight: "600", color: COLORS.text },
  reminderTime: { color: COLORS.subtext, fontSize: 13, marginTop: 2 },
  deleteText: { color: COLORS.error, fontWeight: "600" },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: { color: COLORS.subtext, fontWeight: "600" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
