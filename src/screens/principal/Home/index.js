import React, { useCallback, useEffect, useState } from 'react'
import {
    SafeAreaView,
    StatusBar,
    Text,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native'
import moment from 'moment'

import Emoji from 'react-native-emoji'
import Feather from 'react-native-vector-icons/Feather'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Avatar } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'

import ScreenLoader from '../../../components/ScreenLoader'
import { CoolAlert } from '../../../components/CoolAlert'
import {
    Container,
    ScrollViewStyled,
    Background,
    MenuBars,
    UserView,
    Button,
    NamesContainer,
    TextName,
    AppName,
    StatusContainer,
    TextStyle,
    StatusBemMal,
    StatusText,
    Bem,
    Mal,
    Alerts,
    AlertButton,
    AlertContainer,
    StatusAlert,
    StatusTitle,
    StatusAlertText,
    Users,
    UserSelector,
    UserScroll,
    UserWrapper,
    UserName,
} from './styles'

import {
    terms,
    getNameParts,
    handleAvatar,
    getInitials,
} from '../../../utils/consts'
import translate from '../../../../locales/i18n'
import { scale } from '../../../utils/scalling'
import { useUser } from '../../../hooks/user'
import { updateUser } from '../../../api/user'
import { getUserHouseholds } from '../../../api/households'
import { createSurvey } from '../../../api/surveys'

Feather.loadFont()
SimpleLineIcons.loadFont()

const Home = ({ navigation }) => {
    const {
        isLoading,
        isOffline,
        signOut,
        token,
        user,
        storeUser,
        avatar,
        location,
        getCurrentLocation,
        group,
        households,
        storeHouseholds,
        householdAvatars,
        surveys,
        storeSurveys,
        lastForm,
        getCacheData,
        storeCacheData,
        updateUserScore,
        loadSecondaryData,
        selectUser,
        getCurrentUserInfo,
    } = useUser()

    const [showTermsConsent, setShowTermsConsent] = useState(false)
    const [hasForm, setHasForm] = useState(false)
    const [hasBadReports, setHasBadReports] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [alertTitle, setAlertTitle] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)

    const person = getCurrentUserInfo()

    useFocusEffect(
        useCallback(() => {
            getUserAlerts()
        }, [surveys, lastForm])
    )

    useEffect(() => {
        if (!isLoading) {
            fetchData()
        }
    }, [isLoading])

    useEffect(() => {
        showOfflineAlert(isOffline)
    }, [isOffline])

    const fetchData = async () => {
        await loadSecondaryData()

        verifyUserTermsConsent()
        getCurrentLocation()
        getCacheSurveys()
    }

    const verifyUserTermsConsent = () => {
        const currentPolicyTerms = terms.version
        const userPolicyTerms = user.policy_version

        if (userPolicyTerms < currentPolicyTerms) {
            setShowTermsConsent(true)
        }
    }

    const updateUserTermsConsent = async () => {
        setShowTermsConsent(false)

        const policy = {
            policy_version: terms.version,
        }

        const response = await updateUser(policy, user.id, token)

        if (response.status === 200) {
            console.warn(response.status)
            storeUser(response.body.user)
        }
    }

    const getCacheSurveys = async () => {
        const surveysCache = await getCacheData('surveysData', false)

        if (surveysCache) {
            storeSurveys(surveysCache)
        }
    }

    const getHouseholds = async () => {
        const response = await getUserHouseholds(user.id, token)

        if (response.status === 200) {
            storeHouseholds(response.body.households)
        }
    }

    const getUserAlerts = () => {
        const todayDate = new Date()
        const lastWeek = new Date()

        lastWeek.setDate(todayDate.getDate() - 7)
        lastWeek.setHours(0, 0, 0, 0)

        const lastFormDate = new Date(lastForm)

        if (!lastForm || lastFormDate.getTime() < lastWeek.getTime()) {
            setHasForm(true)
        } else {
            setHasForm(false)
        }

        const userLastSurveys = surveys.filter(
            (survey) =>
                survey &&
                new Date(survey.created_at).getTime() >= lastWeek.getTime()
        )

        let badReports = 0

        if (userLastSurveys.length > 0) {
            userLastSurveys.forEach((survey) => {
                if (person.is_household) {
                    if (
                        survey.symptom.length > 0 &&
                        survey.household &&
                        survey.household.id === person.id
                    ) {
                        badReports += 1
                    }
                } else if (survey.symptom.length > 0 && !survey.household) {
                    badReports += 1
                }
            })
        }

        setHasBadReports(badReports > 2)
    }

    const sendSurvey = async () => {
        // Send Survey GOOD CHOICE
        showLoadingAlert()

        let local = {}
        if (location.error !== 0) {
            local = await getCurrentLocation()
        } else {
            local = location
        }

        const householdID = person.is_household ? person.id : null
        const survey = {
            household_id: householdID,
            latitude: local.latitude,
            longitude: local.longitude,
            symptom: [],
            created_at: moment().format('YYYY-MM-DD'),
        }

        const response = await createSurvey(survey, user.id, token)
        showConfirmation(response.body)
        updateUserScore()

        if (response.status === 201) {
            await storeCacheData('localPin', survey)

            const newSurveys = surveys.slice()
            newSurveys.push(response.body.survey)
            storeSurveys(newSurveys)
        }
    }

    const showTermsPolicy = () => {
        Alert.alert(
            terms.title,
            terms.text,
            [
                {
                    text: terms.disagree,
                    onPress: () => signOut(),
                    style: 'cancel',
                },
                {
                    text: terms.agree,
                    onPress: () => updateUserTermsConsent(),
                },
            ],
            { cancelable: false }
        )
    }

    const showOfflineAlert = (show) => {
        if (show) {
            setAlertTitle(
                <Text>
                    {translate('home.offlineTitle')} {emojis[0]}
                </Text>
            )
            setAlertMessage(
                `${translate('home.offlineMessage')}\n${translate(
                    'home.offlineMessage2'
                )}`
            )
            setShowAlert(true)
        } else {
            setShowAlert(false)
        }
    }

    const showLoadingAlert = () => {
        setAlertMessage(null)
        setShowAlert(true)
        setShowProgressBar(true)
    }

    const showConfirmation = (response) => {
        let alertTitle = ''
        let emojiTitle = null
        let alertMessage = ''
        let emojiMessage = null

        if (response && !response.errors) {
            alertTitle = translate('badReport.alertMessages.thanks')
            alertMessage = response.feedback_message
                ? response.feedback_message
                : translate('badReport.alertMessages.reportSent')
            emojiTitle = emojis[1]
            emojiMessage = emojis[3]
        } else {
            alertTitle = translate('badReport.alertMessages.oops')
            alertMessage = translate('badReport.alertMessages.reportNotSent')
            emojiTitle = emojis[2]
            emojiMessage = emojis[4]
        }

        setAlertTitle(
            <Text>
                {alertTitle} {emojiTitle}
            </Text>
        )
        setAlertMessage(
            <Text>
                {alertMessage} {emojiMessage}
            </Text>
        )

        setShowProgressBar(false)
        console.log(alertMessage)
    }

    if (isLoading) {
        return <ScreenLoader />
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#348EAC' }} />
            <StatusBar backgroundColor='#348EAC' barStyle='light-content' />
            <Container>
                <ScrollViewStyled>
                    <Background>
                        <UserView>
                            <MenuBars onPress={() => navigation.openDrawer()}>
                                <SimpleLineIcons
                                    name='menu'
                                    size={26}
                                    color='#ffffff'
                                />
                            </MenuBars>
                            <NamesContainer>
                                <TextName>
                                    {translate('home.hello') +
                                        getNameParts(person.name)}
                                </TextName>
                                <AppName>
                                    {translate('home.nowAGuardian')}
                                </AppName>
                            </NamesContainer>
                            <Avatar
                                containerStyle={styles.avatar}
                                size={scale(58)}
                                source={handleAvatar(person.avatar)}
                                title={getInitials(person.name)}
                                editButton={{
                                    name: null,
                                    type: 'feather',
                                    style: styles.avatarDot,
                                }}
                                showEditButton
                                activeOpacity={0.5}
                                rounded
                                onPress={() => {
                                    getHouseholds()
                                    setModalVisible(true)
                                }}
                            />
                        </UserView>
                    </Background>

                    <StatusContainer>
                        <TextStyle>
                            {translate('home.userHowYouFelling')}
                        </TextStyle>
                        <StatusBemMal>
                            <Bem
                                disabled={isOffline}
                                onPress={() => sendSurvey()}
                            >
                                <StatusText>
                                    {translate('report.goodChoice')}
                                </StatusText>
                            </Bem>
                            <Mal
                                disabled={isOffline}
                                onPress={() => navigation.navigate('BadReport')}
                            >
                                <StatusText>
                                    {translate('report.badChoice')}
                                </StatusText>
                            </Mal>
                        </StatusBemMal>
                    </StatusContainer>

                    <Alerts>{translate('home.alerts')}</Alerts>

                    {hasForm && group.form_id ? (
                        <AlertButton
                            onPress={() => navigation.navigate('BioSeguranca')}
                        >
                            <AlertContainer alert>
                                <SimpleLineIcons
                                    name='bubble'
                                    size={48}
                                    color='#ffffff'
                                />
                                <StatusAlert>
                                    <StatusTitle>
                                        {translate('home.bioSecurity')}
                                    </StatusTitle>
                                    <StatusAlertText>
                                        {translate('home.bioSecurityQuestions')}
                                    </StatusAlertText>
                                </StatusAlert>
                            </AlertContainer>
                        </AlertButton>
                    ) : null}

                    <AlertButton>
                        <AlertContainer alert={hasBadReports}>
                            <SimpleLineIcons
                                name={hasBadReports ? 'exclamation' : 'check'}
                                size={48}
                                color='#ffffff'
                            />
                            <StatusAlert>
                                <StatusTitle>
                                    {translate('home.statusLast7Days')}
                                </StatusTitle>
                                <StatusAlertText>
                                    {hasBadReports
                                        ? translate('home.statusLast7DaysBad')
                                        : translate('home.statusLast7DaysGood')}
                                </StatusAlertText>
                            </StatusAlert>
                        </AlertContainer>
                    </AlertButton>
                </ScrollViewStyled>

                <Modal
                    animationType='fade'
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible)
                    }}
                >
                    <Users>
                        <UserSelector>
                            <UserScroll>
                                <UserWrapper>
                                    <Button
                                        onPress={async () => {
                                            setModalVisible(!modalVisible)
                                            await selectUser(user)
                                            getUserAlerts()
                                        }}
                                    >
                                        <Avatar
                                            size={scale(60)}
                                            source={handleAvatar(avatar)}
                                            title={getInitials(user.user_name)}
                                            rounded
                                        />
                                        <UserName>
                                            {getNameParts(user.user_name, true)}
                                        </UserName>
                                    </Button>
                                </UserWrapper>
                                {households.map((household) => (
                                    <UserWrapper key={household.id}>
                                        <Button
                                            onPress={async () => {
                                                setModalVisible(!modalVisible)
                                                await selectUser(household)
                                                getUserAlerts()
                                            }}
                                        >
                                            <Avatar
                                                size={scale(60)}
                                                source={handleAvatar(
                                                    householdAvatars[
                                                        household.id
                                                    ]
                                                )}
                                                title={getInitials(
                                                    household.description
                                                )}
                                                rounded
                                            />
                                            <UserName>
                                                {getNameParts(
                                                    household.description,
                                                    true
                                                )}
                                            </UserName>
                                        </Button>
                                    </UserWrapper>
                                ))}
                                <UserWrapper>
                                    <Button
                                        onPress={() => {
                                            setModalVisible(!modalVisible)
                                            navigation.navigate('NovoPerfil')
                                        }}
                                    >
                                        <Feather
                                            name='plus'
                                            size={scale(60)}
                                            color='#c4c4c4'
                                        />
                                        <UserName>
                                            {translate('home.addProfile')}
                                        </UserName>
                                    </Button>
                                </UserWrapper>
                            </UserScroll>
                        </UserSelector>
                    </Users>
                </Modal>

                <CoolAlert
                    show={showTermsConsent}
                    title={translate('useTerms.consentTitle')}
                    message={translate('useTerms.consentMessage')}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showConfirmButton
                    confirmText={translate('useTerms.seeTerms')}
                    onConfirmPressed={() => showTermsPolicy()}
                />
                <CoolAlert
                    show={showAlert}
                    showProgress={showProgressBar}
                    title={
                        showProgressBar
                            ? translate('badReport.alertMessages.sending')
                            : alertTitle
                    }
                    message={alertMessage}
                    closeOnTouchOutside={!showProgressBar}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={!showProgressBar}
                    confirmText={translate(
                        'badReport.alertMessages.confirmText'
                    )}
                    onConfirmPressed={() => setShowAlert(false)}
                    onDismiss={() => setShowAlert(false)}
                />
            </Container>
        </>
    )
}

const styles = StyleSheet.create({
    avatar: {
        marginRight: `${scale(8)}%`,
        borderColor: '#ffffff',
        borderWidth: 3,
    },
    avatarDot: {
        height: scale(14),
        width: scale(14),
        backgroundColor: '#ffffff',
        left: 0,
        shadowOpacity: 0,
    },
})

const emojis = [
    <Emoji // Emoji cloud
        name='cloud'
        style={{ fontSize: scale(15) }}
    />,
    <Emoji // Emoji tada
        name='tada'
        style={{ fontSize: scale(15) }}
    />,
    <Emoji // Emoji warning
        name='warning'
        style={{ fontSize: scale(15) }}
    />,
    <Emoji // Emoji heart eyes
        name='heart_eyes'
        style={{ fontSize: scale(15) }}
    />,
    <Emoji // Emoji smile face
        name='sweat_smile'
        style={{ fontSize: scale(15) }}
    />,
]

export default Home
