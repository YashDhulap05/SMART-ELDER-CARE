import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../styles/theme";

export default function NavMenu({
  navigation,
  guardianId,
  elderId,
  elderName,
  caretakerName,
  caretakerPhone,
}) {
  const [visible, setVisible] = useState(false);

  const goTo = (screen, params) => {
    setVisible(false);
    navigation.navigate(screen, params);
  };

  const logout = () => {
    setVisible(false);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.hamburger}
      >
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => goTo("Dashboard", { guardianId })}
            >
              <Text style={styles.menuText}>🏠 Home</Text>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => goTo("VoiceRecording", { elderId })}
              >
                <Text style={styles.menuText}>🔔 Add Reminder</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                goTo("EmergencyRecording", {
                  elderId,
                  elderName,
                  caretakerName,
                  caretakerPhone,
                })
              }
            >
              <Text style={styles.menuText}>🚨 Emergency Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <Text style={[styles.menuText, { color: COLORS.error }]}>
                🚪 Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  hamburger: { paddingHorizontal: 15, paddingVertical: 8 },
  hamburgerText: { fontSize: 24, color: COLORS.text },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  menu: {
    position: "absolute",
    top: 50,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  menuItem: { paddingVertical: 14, paddingHorizontal: 18 },
  menuText: { fontSize: 15, fontWeight: "600", color: COLORS.text },
});
