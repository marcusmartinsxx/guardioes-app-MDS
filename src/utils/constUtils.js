import { Alert, Linking } from 'react-native'
import translate from '../../locales/i18n'

export const getNameParts = (fullName, firstandLast = false) => {
    if (typeof fullName === 'string') {
        const nameParts = fullName.split(' ')
        const { length } = nameParts

        if (firstandLast && length > 1) {
            return `${nameParts[0]} ${nameParts[length - 1]}`
        }
        return nameParts[0]
    }
    return null
}

export const getInitials = (string) => {
    if (typeof string === 'string') {
        const names = string.split(' ')
        let initials = names[0].substring(0, 1).toUpperCase()

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase()
        }
        return initials
    }
    return null
}

export const handleAvatar = (image) => {
    const source = { uri: image }

    if (image && image !== 'default') {
        return source
    }
    return null
}

export const Redirect = (titulo, message, url) => {
    Alert.alert(`${titulo}`, `${message}`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ok', onPress: () => Linking.openURL(`${url}`) },
    ])
}

export const terms = {
    title: translate('useTerms.title'),
    text: `${translate('useTerms.terms.textoTermosTitulo')}\n
        ${translate('useTerms.terms.textoTermos_1')}\n
        ${translate('useTerms.terms.textoTermos_2')}\n
        ${translate('useTerms.terms.textoTermos_3')}\n
        ${translate('useTerms.terms.textoTermos_4')}\n
        ${translate('useTerms.terms.textoTermos_5')}\n
        ${translate('useTerms.terms.textoTermos_6')}\n
        ${translate('useTerms.terms.textoTermos_7')}\n
        ${translate('useTerms.terms.textoTermos_8')}\n
        ${translate('useTerms.terms.textoTermos_9')}\n
        ${translate('useTerms.terms.textoTermos_10')}\n
        ${translate('useTerms.terms.textoTermos_11')}\n
        ${translate('useTerms.terms.textoTermos_12')}\n
        ${translate('useTerms.terms.textoTermos_13')}`,
    version: translate('useTerms.compilation'),
    disagree: translate('useTerms.disagree'),
    agree: translate('useTerms.agree'),
}
