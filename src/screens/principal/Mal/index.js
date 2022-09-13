import React, { useEffect, useState } from 'react'
import { Text, Alert } from 'react-native'
import moment from 'moment'

import Share from 'react-native-share'
import { Avatar } from 'react-native-elements'
import ScreenLoader from '../../../components/ScreenLoader'
import { CoolAlert } from '../../../components/CoolAlert'
import { UserTip } from '../../../components/UserTip'
import { CardWhite } from '../../../components/Cards'
import {
    Container,
    FormInline,
    FormLabel,
    Selector,
    SendContainer,
    SendText,
} from '../../../components/NormalForms'
import {
    ScrollViewStyled,
    User,
    IconWrapper,
    InfoWrapper,
    Name,
    FormTitleWrapper,
    FormTitle,
    Sintoma,
    ButtonContainer,
    OptionButton,
    SintomaTexto,
} from './styles'

import translate from '../../../../locales/i18n'
import { scale } from '../../../utils/scalling'
import {
    getNameParts,
    handleAvatar,
    getInitials,
    redirectAlert,
    getSurveyConfirmation,
    showSurveillanceInvite
} from '../../../utils/consts'
import { countryChoices, localSymptom } from '../../../utils/selector'
import { cardWhatsapp } from '../../../img/cardWhatsapp/cardWhatsapp_base64'
import { useUser } from '../../../hooks/user'
import { getAppSymptoms } from '../../../api/symptoms'
import { createSurvey } from '../../../api/surveys'

const today = moment().local().format('DD-MM-YYYY')

const BadReport = ({ navigation }) => {
    const {
        token,
        user,
        group,
        location,
        getCurrentLocation,
        updateUserScore,
        surveys,
        storeSurveys,
        getCurrentUserInfo,
        storeCacheData,
    } = useUser()

    const [isLoading, setIsLoading] = useState(true)
    const [symptoms, setSymptoms] = useState([])
    const [allDatesMarked, setAllDatesMarked] = useState([])
    const [datesMarked, setDatesMarked] = useState([])
    const [daysMarked, setDaysMarked] = useState(0)
    const [daysMissing, setDaysMissing] = useState(0)
    const [daysGood, setDaysGood] = useState(0)
    const [daysBad, setDaysBad] = useState(0)
    const [percentGood, setPercentGood] = useState(0)
    const [percentBad, setPercentBad] = useState(0)
    const [percentMissing, setPercentMissing] = useState(100)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [badSince, setBadSince] = useState(today)
    const [contactWithSymptom, setContactWithSymptom] = useState(null)
    const [hasTraveled, setHasTraveled] = useState(false)
    const [wentToHospital, setWentToHospital] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showProgressBar, setShowProgressBar] = useState(false)
    const [alertTitle, setAlertTitle] = useState(null)
    const [alertMessage, setAlertMessage] = useState(null)
    const [inviteSurveillance, setInviteSurveillance] = useState(false)
    const [instituition, setInstituition] = useState('')

    const person = getCurrentUserInfo()

    useEffect(() => {
        getSymptoms()
        getGroupName()
    }, [])

    useEffect(() => {
        if (
            !user.is_vigilance &&
            group.group_manager &&
            group.group_manager.vigilance_email
        ) {
            setInviteSurveillance(true)
        }
    }, [])

    useEffect(() => {
      getUserParticipation()
  }, [daysMarked])

  useEffect(() => {
    defineMarkedDates()
  }, [surveys])

  const getSurveys = async () => {
    if (!isOffline) {
        const response = await getUserSurveys(user.id, token)

        if (response.status === 200) {
            storeSurveys(response.data.surveys)
            setIsLoading(false)
        }
    } else {
        const surveysCache = await getCacheData('surveysData', false)

        if (surveysCache) {
            storeSurveys(surveysCache)
        }
        setIsLoading(false)
    }
  }

  const defineMarkedDates = () => {
    const markedDatesGood = []
    const markedDatesBad = []
    const markedDatesAll = []

    surveys.forEach((survey) => {
        if (!person.is_household) {
            if (!survey.household) {
                if (survey.symptom && survey.symptom.length) {
                    // BadReport
                    markedDatesBad.push(
                        survey.created_at.split('T', 1).toString()
                    )
                    markedDatesAll.push(survey)
                } else {
                    // GoodReport
                    markedDatesGood.push(
                        survey.created_at.split('T', 1).toString()
                    )
                }
            }
        } else if (survey.household && survey.household.id === person.id) {
            if (survey.symptom && survey.symptom.length) {
                // Household BadReport
                markedDatesBad.push(
                    survey.created_at.split('T', 1).toString()
                )
                markedDatesAll.push(survey)
            } else {
                // Household GoodReport
                markedDatesGood.push(
                    survey.created_at.split('T', 1).toString()
                )
            }
        }
    })

    setAllDatesMarked(markedDatesAll)

    const BadReports = markedDatesBad.reduce(
        (c, v) =>
            Object.assign(c, {
                [v]: { selected: true, selectedColor: '#F18F01' },
            }),
        {}
    )
    const GoodReports = markedDatesGood.reduce(
        (c, v) =>
            Object.assign(c, {
                [v]: { selected: true, selectedColor: '#5DD39E' },
            }),
        {}
    )

    Object.assign(GoodReports, BadReports)

    const daysMarked = Object.keys(GoodReports).length
    const daysBad = Object.keys(BadReports).length
    const daysGood = daysMarked - daysBad

    setDatesMarked(GoodReports)
    setDaysMarked(daysMarked)
    setDaysGood(daysGood)
    setDaysBad(daysBad)
  }

    const getGroupName = () => {
        const groupName = person.group ? person.group.split('/')[3] : null
        setInstituition(groupName)
    }

  const getUserParticipation = () => {
    const todayDate = new Date()
    const createdDate = new Date(person.created_at)

    createdDate.setHours(0, 0, 0, 0)

    const diff = todayDate.getTime() - createdDate.getTime()
    const daysTotal = Math.ceil(diff / (1000 * 3600 * 24))
    const daysMissing = daysTotal - daysMarked

    const percentGood = ((daysGood / daysTotal) * 100).toFixed(0)
    const percentBad = ((daysBad / daysTotal) * 100).toFixed(0)
    const percentMissing = ((daysMissing / daysTotal) * 100).toFixed(0)

    setDaysMissing(daysMissing)
    setPercentGood(percentGood)
    setPercentBad(percentBad)
    setPercentMissing(percentMissing)
  }

    const showConfirmation = (status, data) => {
        const message = getSurveyConfirmation(status, data)

        setAlertTitle(
            <Text>
                {message.alertTitle} {message.emojiTitle}
            </Text>
        )
        setAlertMessage(
            <Text>
                {message.alertMessage} {message.emojiMessage} {'\n'}
                {translate('badReport.messages.seeADoctor')}
            </Text>
        )

        setShowAlert(true)
        console.log(message.alertMessage)
    }

    const showWhatsappAlert = (status, body) => {
        Alert.alert(
            translate('map.alert'),
            translate('map.share'),
            [
                {
                    text: translate('map.noAlert'),
                    onPress: () => showConfirmation(status, body),
                },
                {
                    text: translate('badReport.yes'),
                    onPress: () => {
                        Share.open(shareOptions)
                            .then((res) => {
                                console.log(res)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                        showConfirmation(status, body)
                    },
                },
            ],
            { cancelable: false }
        )
    }

    const sortSymptoms = (symptoms = []) => {
        // Sort in alphabetical order
        symptoms.sort((a, b) => {
            if (a.description !== b.description) {
                if (a.description < b.description) return -1
                return 1
            }
            return 0
        })
        return symptoms
    }

    const getSymptoms = async () => {
        const response = await getAppSymptoms(token)

        if (response.status === 200) {
            const sortedSymptoms = sortSymptoms(response.data.symptoms)
            setSymptoms(sortedSymptoms)
            setIsLoading(false)
        }
    }

    const sendSurvey = async () => {
        // Send Survey BAD CHOICE
        setShowProgressBar(true)

        let local = {}
        if (location.error !== 0) {
            local = await getCurrentLocation()
        } else {
            local = location
        }

        if (personSymptoms.length === 0) {
            Alert.alert(
                translate('badReport.reportWithoutSymptom.title'),
                translate('badReport.reportWithoutSymptom.message')
            )
            setShowProgressBar(false)
            setShowAlert(false)

            return
        }

        const householdID = person.is_household ? person.id : null
        const badSinceDate = moment(badSince, 'DD-MM-YYYY').toISOString()
        const survey = {
            household_id: householdID,
            latitude: local.latitude,
            longitude: local.longitude,
            bad_since: badSinceDate,
            traveled_to: hasTraveled,
            went_to_hospital: wentToHospital,
            contact_with_symptom: contactWithSymptom,
            symptom: personSymptoms,
            created_at: moment().local().toISOString(),
        }

        const response = await createSurvey({ survey }, user.id, token)
        setShowProgressBar(false)

        // Wait page re-render
        const delay = (ms) => new Promise((res) => setTimeout(res, ms))
        await delay(50)

        updateUserScore()
        if (response.status === 201) {
            if (!response.data.errors && response.data.messages.top_3) {
                if (response.data.messages.top_3[0]) {
                    showSyndromeAlert(response.status, response.data)
                } else {
                    showConfirmation(response.status, response.data)
                }
            } else {
                showConfirmation(response.status, response.data)
            }

            // Save only important data for Map
            const localPin = {
                ...survey,
                bad_since: undefined,
                traveled_to: undefined,
                went_to_hospital: undefined,
                contact_with_symptom: undefined,
                symptom: ['symptom'],
            }
            await storeCacheData('localPin', localPin)

            const newSurveys = surveys.slice()
            newSurveys.push(response.data.survey)
            storeSurveys(newSurveys)
        } else {
            showConfirmation(response.status, response.data)
        }
    }

    if (isLoading) {
        return <ScreenLoader />
    }

    return (
        <Container>
            <ScrollViewStyled>
                <User>
                    <IconWrapper>
                        <Avatar
                            size={scale(58)}
                            source={handleAvatar(person.avatar)}
                            title={getInitials(person.name)}
                            rounded
                        />
                    </IconWrapper>
                    <InfoWrapper>
                        <Name>{getNameParts(person.name, true)}</Name>
                    </InfoWrapper>
                </User>

                <FormTitleWrapper>
                    <FormTitle>{"Selecione abaixo o sintoma para ver os dias em que você esteve com ele:"}</FormTitle>
                </FormTitleWrapper>

                {symptoms.map((symptom) => (
                    <Sintoma
                        key={symptom.id}
                        onPress={() => {
                          allDatesMarked.map(
                            (symptomMarker) => {
                              if(
                                symptom => symptomMarker.symptom ===
                                symptom.code
                              ){
                                setTitle("Dias com o Sintoma")
                                let data = moment(symptomMarker.created_at).format('YYYY-MM-DD')
                                setTitle("Dias com o Sintoma")
                                setMessage(data)
                                setShowAlert(true)
                              }
                            }
                          )
                        }}
                    >
                        <SintomaTexto>{symptom.description}</SintomaTexto>
                    </Sintoma>
                ))}

            </ScrollViewStyled>

            <CoolAlert
                show={showProgressBar}
                showProgress
                title={translate('badReport.messages.sending')}
            />
            <CoolAlert
                show={showAlert}
                title={title}
                message={message}
                closeOnTouchOutside
                closeOnHardwareBackPress={false}
                showConfirmButton
                confirmText={"OK"}
                onConfirmPressed={() => setShowAlert(false)}
            />
        </Container>
    )
}

const shareOptions = {
    message: translate('badReport.messages.covidSuspect'),
    url: cardWhatsapp,
}

export default BadReport
