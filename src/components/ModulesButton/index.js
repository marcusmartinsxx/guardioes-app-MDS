import React from 'react';
import { StyleSheet, Button, Alert } from 'react-native'

export const ModulesButton = () => {
  return (
    <Button
      title="Acesse os conteúdos do curso"
      onPress={() =>Alert.alert('Acesso aos Conteúdos')}
      style={styles.modButton}
    >
    </Button>
  );
}

const styles = StyleSheet.create({
  modButton: {
    borderRadius: 500,
    overflow: 'hidden',
}
});
