import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { Mic, Square, Play, Pause, SkipBack, SkipForward, X, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AudioVisualizer from '@/components/audio/AudioVisualizer';
import TimerDisplay from '@/components/audio/TimerDisplay';

export default function RecordScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [recordingPaused, setRecordingPaused] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);

      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    if (!sound) return;

    try {
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackPosition(status.positionMillis / 1000);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
          }
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const pauseRecording = async () => {
    if (!sound) return;

    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };

  const seekRecording = async (offset: number) => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(0, status.positionMillis + (offset * 1000));
        await sound.setPositionAsync(newPosition);
        setPlaybackPosition(newPosition / 1000);
      }
    } catch (err) {
      console.error('Failed to seek recording', err);
    }
  };

  const handleCancel = () => {
    if (recording) {
      recording.stopAndUnloadAsync();
    }
    if (sound) {
      sound.unloadAsync();
    }
    router.back();
  };

  const handleSave = () => {
    // In a real app, you would upload the recording to your server here
    // For now, we'll just simulate success and return to the previous screen
    router.back();
  };

  // Generate mock audio visualization data
  const generateVisualizerData = () => {
    if (Platform.OS === 'web') {
      return Array.from({ length: 50 }, () => Math.random() * (isRecording ? 1 : 0.3));
    }
    return Array.from({ length: 100 }, () => Math.random() * (isRecording ? 1 : 0.3));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Record Message</Text>
        {(isRecording || recordingUri) && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <X size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.visualizerContainer}>
        <AudioVisualizer bars={generateVisualizerData()} color={colors.primary} />
      </View>

      <View style={styles.timerContainer}>
        <TimerDisplay seconds={recordingTime} />
      </View>

      <View style={styles.controlsContainer}>
        {recordingUri ? (
          <>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => seekRecording(-10)}
            >
              <SkipBack size={24} color={colors.darkText} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, isPlaying && styles.pauseButton]}
              onPress={isPlaying ? pauseRecording : playRecording}
            >
              {isPlaying ? (
                <Pause size={32} color="#FFFFFF" />
              ) : (
                <Play size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => seekRecording(10)}
            >
              <SkipForward size={24} color={colors.darkText} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingActive]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square size={32} color="#FFFFFF" />
            ) : (
              <Mic size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {recordingUri && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelActionButton]}
            onPress={handleCancel}
          >
            <X size={24} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.cancelActionButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveActionButton]}
            onPress={handleSave}
          >
            <Check size={24} color={colors.success} />
            <Text style={[styles.actionButtonText, styles.saveActionButtonText]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.instructions}>
        {isRecording
          ? 'Recording in progress...'
          : recordingUri
          ? 'Review your recording'
          : 'Tap the microphone to start recording'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkText,
  },
  cancelButton: {
    padding: 8,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: colors.error,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: colors.darkGray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelActionButton: {
    backgroundColor: colors.errorLight,
  },
  cancelActionButtonText: {
    color: colors.error,
  },
  saveActionButton: {
    backgroundColor: colors.successLight,
  },
  saveActionButtonText: {
    color: colors.success,
  },
  instructions: {
    textAlign: 'center',
    color: colors.darkGray,
    marginBottom: 24,
  },
});