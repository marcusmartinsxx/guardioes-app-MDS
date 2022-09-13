
import styled from 'styled-components';
import { ScrollView as VistaRolante } from 'react-native';
import { scale, percentage } from '../../utils/scalling';
import ShadowView from 'react-native-simple-shadow-view';

export const ScrollView = styled(VistaRolante).attrs({
    contentContainerStyle: {
        flexGrow: 1, // Ocupar todo o espaço disponível
        paddingVertical: percentage(7),
        paddingHorizontal: percentage(7),
    },
})``

export const IdentifierContainer = styled.View`
    flex-direction: row;
    margin-top: ${percentage(7)}px;
    justify-content: flex-start;
`

export const AvatarContainer = styled.View`
    padding: ${percentage(4.375)}px;
    border-radius: ${percentage(100)}px;
    flex-direction: row;
    align-self: flex-start;
    background-color: #C4C4C4;
`
export const TitleContainer = styled.View`
    margin-left: ${percentage(7)}px;
    align-self: flex-start;
`
    // font-family: ArgentumSans-Medium;

export const NameContainer = styled.View`
    align-self: flex-start;
    font-size: ${scale(14)}px;
`

export const DescriptionContainer = styled.View`
    align-self: flex-start;
    font-size: ${scale(9)}px;
`

export const ButtonContainer = styled.Button`
    background-color: blue;
`

export const RedeSocial = styled.View`
    border-radius: ${percentage(100)}px;
    background-color: #4E8CA9;
    padding: ${scale(10)}px;
`

export const SocialMediaButton = styled.TouchableOpacity`
    heigth: ${percentage(13.75)}px;
    width: ${percentage(13.75)}px;
`

export const SocialMediaContainer = styled.View`
    flex: 0;
    flex-direction: row;
    justify-content: space-around;
`

export const ContentButtonsContainer = styled.View`
    flex: 0;
    flex-direction: row;
    justify-content: flex-start;
    padding: ${scale(17)}px;
    align-items: center;
`

export const OptionButton = styled.TouchableOpacity`
    border-radius: ${scale(12)}px;
    margin-bottom: ${percentage(7)}px;
`
