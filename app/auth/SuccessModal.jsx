// app/auth/SuccessModal.jsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function SuccessModal({ visible, onClose, onContinue }) {
  const handleContinue = () => {
    if (onContinue) {
      onContinue(); // navigate or any custom action
    } else {
      onClose(); // fallback if no navigation needed
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={require('../../assets/icons/Success.png')}
            style={styles.successIcon}
          />
          <Text style={styles.successText}>Successful</Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 300,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'montserrat',
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#836EFE',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'montserrat',
    textAlign: 'center',
  },
});
