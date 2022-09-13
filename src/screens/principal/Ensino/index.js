import React from 'react';
import { Linking, Text, Button, View, TouchableOpacity } from 'react-native';
import { Container } from '../../../components/NormalForms';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { scale, percentage } from '../../../utils/scalling';

import {
  ScrollView,
  IdentifierContainer,
  AvatarContainer,
  TitleContainer,
  NameContainer,
  DescriptionContainer,
  ButtonContainer,
  RedeSocial,
  SocialMediaButton,
  SocialMediaContainer,
  ContentButtonsContainer,
  OptionButton,
} from './styles';

export default MenuDisciplina = () => {
  const mehIcon = <AntDesignIcon name="meh" size={scale(35)} color="#FFF" />;
  const bookIcon = <FontAwesome5Icon name="book-open" size={scale(50)} color="#FFF" />;
  const listIcon = <FontAwesome5Icon name="clipboard" size={scale(60)} color="#FFF" />;
  const signOutIcon = <FontAwesomeIcon name="sign-out" size={scale(29)} color="#FFF" />;

  const matriculaCalva = '191043683'

  return (
    <Container>
        <ScrollView>
            <IdentifierContainer
              style={{
                marginTop: percentage(11),
                marginBottom: percentage(17),
                justifyContent: 'center',
              }}
            >
                <AvatarContainer>
                    {mehIcon}
                </AvatarContainer>

                <TitleContainer>
                  <NameContainer>
                    <Text
                      style={{
                        color: '#4E8CA9',
                        fontWeight: '600',
                        fontSize: scale(20),
                      }}
                    >
                      Luiz Careca Calvo
                    </Text>
                  </NameContainer>
                  <DescriptionContainer>
                    <Text
                      style={{
                        color: '#4E8CA9',
                        fontSize: scale(14),
                      }}
                    >
                      Matricula: {matriculaCalva}
                    </Text>
                  </DescriptionContainer>
                  <DescriptionContainer>
                    <Text
                      style={{
                        color: '#4E8CA9',
                        fontSize: scale(14),
                      }}
                    >
                      E-mail: luizluiz@luiz.com
                    </Text>
                  </DescriptionContainer>
                </TitleContainer>
            </IdentifierContainer>


            <OptionButton
              style={{
                backgroundColor: '#4E8CA9',
              }}
            >
              <ContentButtonsContainer>
                {bookIcon}
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: scale(25),
                    marginLeft: scale(25),
                  }}
                >
                  Acesse os{`\n`}conteúdos{`\n`}do curso
                </Text>
              </ContentButtonsContainer>
            </OptionButton>

            <OptionButton
              style={{
                backgroundColor: '#7DD0A2',
              }}
            >
              <ContentButtonsContainer>
                {listIcon}
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: scale(25),
                    marginLeft: scale(25),
                  }}
                >
                  Acesse os{`\n`}questionários
                </Text>
              </ContentButtonsContainer>
            </OptionButton>

            <OptionButton style={{backgroundColor: '#4E8CA9',}}>
              <ContentButtonsContainer
                style={{
                  justifyContent: 'center',
                }}
              >
                {signOutIcon}
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: scale(20),
                    marginLeft: scale(5),
                  }}
                >
                  Voltar
                </Text>
              </ContentButtonsContainer>
            </OptionButton>

            <SocialMediaContainer>
              <SocialMediaButton
                onPress={() =>
                  Linking.openURL('https://twitter.com/proepi_')
                }
              >
                <RedeSocial>
                  <SimpleLineIcons
                      name='social-twitter'
                      size={scale(28)}
                      color='#ffffff'
                  />
                </RedeSocial>
              </SocialMediaButton>

              <SocialMediaButton
                onPress={() =>
                  Linking.openURL('https://www.instagram.com/redeproepi')
                }
              >
                <RedeSocial>
                  <SimpleLineIcons
                      name='social-instagram'
                      size={scale(28)}
                      color='#ffffff'
                  />
                </RedeSocial>
              </SocialMediaButton>
            </SocialMediaContainer>

        </ScrollView>
    </Container>
  );
}
