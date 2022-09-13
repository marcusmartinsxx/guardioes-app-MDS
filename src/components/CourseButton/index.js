import React from 'react';
import { View, SafeAreaView, Button, Alert } from 'react-native'

export const CourseButton = () => {
  return (
    <SafeAreaView>
      <Button
        title="Acesse os conteúdos do curso"
        onPress={() =>Alert.alert('Acesso aos Conteúdos')}
      >
        {/* <Image source={require('../../../assets/book.svg')} /> */}
      </Button>
    </SafeAreaView>
  );
}
