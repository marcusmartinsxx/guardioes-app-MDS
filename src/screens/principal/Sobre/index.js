import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ScrollViewStyled, Title, ImageContainer, BodyText } from './styles'

import translate from '../../../../locales/i18n'
import { UnBLogo, ProEpiLogo } from '../../../img/imageConst'
import { Redirect } from '../../../utils/constUtils'
import { scale } from '../../../utils/scallingUtils'

const Sobre = () => {
    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#348EAC' }} />
            <ScrollViewStyled>
                <Title>{translate('about.textoSobreTitulo')}</Title>

                <ImageContainer>
                    <TouchableOpacity
                        onPress={() =>
                            Redirect(
                                translate('about.tituloBtnProEpi'),
                                translate('about.mensagemBtnProEpi'),
                                translate('about.linkBtnProEPi')
                            )
                        }
                    >
                        <Image
                            source={ProEpiLogo}
                            style={{ height: scale(60), width: scale(60) }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            Redirect(
                                translate('about.tituloBtnUnb'),
                                translate('about.mensagemBtnUnb'),
                                translate('about.linkBtnUnb')
                            )
                        }
                    >
                        <Image
                            source={UnBLogo}
                            style={{ height: scale(60), width: scale(60) }}
                        />
                    </TouchableOpacity>
                </ImageContainer>

                <BodyText>{translate('about.textoSobre')}</BodyText>
            </ScrollViewStyled>
        </>
    )
}

export default Sobre
