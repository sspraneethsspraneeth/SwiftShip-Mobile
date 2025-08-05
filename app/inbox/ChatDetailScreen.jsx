import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChatDetailScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi Good Morning Dude', time: '10:02', sender: 'me' },
    { id: 2, text: 'I Have Placed An Order For Shipping Goods For Today', time: '10:02', sender: 'me' },
    { id: 3, text: 'Hi, Good Morning!', time: '10:02', sender: 'other' },
    { id: 4, text: 'Alright. I’m Currently On My Way To Pick Up Your Package', time: '10:02', sender: 'other' },
    { id: 5, text: 'Ok! Will Waiting', time: '10:02', sender: 'me' },
  ]);

  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(null);
  const scrollRef = useRef();

  const sendMessage = () => {
    if (input.trim() === '') return;
    const newMsg = {
      id: messages.length + 1,
      text: input.trim(),
      time: new Date().toLocaleTimeString().slice(0, 5),
      sender: 'me',
    };
    setMessages([...messages, newMsg]);
    setInput('');
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const startRecording = async () => {
    if (recording) return;

    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped, file saved at:', uri);
      setRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require('../../assets/icons/back.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>{name}</Text>
         <View style={styles.iconGroup}>
  <TouchableOpacity onPress={() => router.push('/inbox/CallScreen')}>
    <Image source={require('../../assets/icons/Call.png')} style={styles.icon} />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => console.log('Video call tapped')}>
    <Image source={require('../../assets/icons/Video.png')} style={styles.icon} />
  </TouchableOpacity>
</View>

        </View>

        {/* Chat Area and Input */}
        <View style={styles.chatArea}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={styles.messagesContainer}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'me' ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text style={[styles.messageText, msg.sender === 'me' && styles.whiteText]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timeText, msg.sender === 'me' && styles.whiteText]}>
                  {msg.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Message"
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
            {input ? (
              <TouchableOpacity onPress={sendMessage}>
                <Image source={require('../../assets/icons/mic.png')} style={styles.sendIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={styles.voiceBtn}
              >
                <Image source={require('../../assets/icons/mic.png')} style={styles.micIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#39335E',
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    tintColor: '#6C63FF',
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: '#6C63FF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#F4F4F4',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#39335E',
    fontSize: 14,
  },
  timeText: {
    fontSize: 11,
    color: '#39335E',
    marginTop: 4,
    textAlign: 'right',
  },
  whiteText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    marginRight: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#6C63FF',
  },
  voiceBtn: {
    backgroundColor: '#6C63FF',
    padding: 10,
    borderRadius: 25,
  },
  micIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
