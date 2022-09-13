import styled from 'styled-components';
import { ScrollView as VistaRolante, TouchableOpacity } from 'react-native';
import { scale, percentage } from '../../../utils/scalling';
import ShadowView from 'react-native-simple-shadow-view';
import DatePicker from 'react-native-datepicker'
import { CheckBox } from 'react-native-elements'
import { Card } from '../../../components/Cards'

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
    ${Card}
`

export const RedeSocial = styled.View`
    border-radius: ${percentage(100)}px;
    background-color: #4E8CA9;
    padding: ${scale(10)}px;
`

export const SocialMediaButton = styled.TouchableOpacity`
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

export const ScrollViewStyled = styled(ScrollView).attrs({
    contentContainerStyle: {
        flexGrow: 1,
        paddingVertical: percentage(8),
        paddingHorizontal: percentage(7),
    },
})``

export const User = styled(ShadowView).attrs({})`
    width: 100%;
    background-color: #ffffff;
    border-radius: ${scale(18)}px;
    flex-direction: row;
    margin-bottom: ${percentage(6)}px;
    padding: ${scale(15)}px;
    shadow-color: #000000;
    shadow-opacity: 0.1;
    shadow-radius: 6px;
    shadow-offset: 0px 4px;
`

export const IconWrapper = styled.View`
    margin-right: ${percentage(4)}px;
`

export const InfoWrapper = styled.View`
    flex: 1;
    justify-content: center;
`

export const Name = styled.Text`
    font-family: ArgentumSans-SemiBold;
    font-size: ${scale(16)}px;
    color: #348eac;
`

export const FormTitleWrapper = styled.View`
    margin-top: ${scale(20)}px;
    margin-bottom: ${scale(10)}px;
`

export const FormTitle = styled.Text`
    font-family: ArgentumSans-Medium;
    font-size: ${scale(16)}px;
    color: #348eac;
    text-align: left;
    margin-left: ${scale(8)}px;
`

export const Sintoma = styled(TouchableOpacity).attrs({})`
    background-color: #ffffff;
    flex-direction: row;
    border-radius: ${scale(18)}px;
    margin-bottom: ${percentage(7)}px;
    padding: ${scale(15)}px;
    shadow-color: #000000;
    shadow-opacity: 0.1;
    shadow-radius: 6px;
    shadow-offset: 0px 4px;
    elevation : 10;
`

export const SintomaTexto = styled.Text`
    font-family: ArgentumSans-Medium;
    font-size: ${scale(14.5)}px;
    color: #000000;
    text-align: left;
    margin-left: ${scale(8)}px;
`
