import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, globalStyles } from '../styles/theme';
import { API_URL } from '../config';

export default function VoiceRecordingScreen({ navigation, route }) {
  const { elderId } = route.params;

  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const startRecording = async () => {
    try {
      setErrorMsg('');
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setErrorMsg('Microphone permission is required');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      setErrorMsg('Could not start recording');
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
      setErrorMsg('Could not stop recording');
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      await sound.playAsync();
    } catch (error) {
      setErrorMsg('Could not play recording');
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedTime) {
      setScheduledTime(selectedTime);
    }
  };

  const handleUpload = async () => {
    if (!title) {
      setErrorMsg('Please enter a title for this message');
      return;
    }
    if (!recordedUri) {
      setErrorMsg('Please record a voice message first');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('elderId', elderId);
      formData.append('title', title);
      formData.append('scheduledTime', scheduledTime.toISOString());
      formData.append('audio', {
        uri: recordedUri,
        type: 'audio/m4a',
        name: 'voice-message.m4a',
      });

      const response = await fetch(`${API_URL}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Upload failed');
        setUploading(false);
        return;
      }

      setSuccessMsg('Voice message scheduled successfully! 🎉');
      setTitle('');
      setRecordedUri(null);
    } catch (error) {
      setErrorMsg('Could not connect to server');
    }
    setUploading(false);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={styles.emoji}>🎙️</Text>
        <Text style={globalStyles.title}>Record Voice Message</Text>
        <Text style={globalStyles.subtitle}>Record a reminder in your own voice</Text>

        {errorMsg ? <Text style={globalStyles.error}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

        <TextInput
          style={globalStyles.input}
          placeholder="Message title (e.g. 'Take morning medicine')"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? '⏹ Stop Recording' : '🎙️ Start Recording'}
          </Text>
        </TouchableOpacity>

        {recordedUri ? (
          <TouchableOpacity style={styles.playButton} onPress={playRecording}>
            <Text style={styles.playButtonText}>▶ Play Recording</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.timeButtonText}>
            🕐 Scheduled Time: {scheduledTime.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={scheduledTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpload}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Save Voice Message'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
  recordButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  recordingActive: { backgroundColor: '#C0392B' },
  recordButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  playButton: {
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  playButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  timeButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  timeButtonText: { color: COLORS.text, fontWeight: '600' },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  success: {
    color: COLORS.secondary,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});