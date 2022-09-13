import api from './api'

export const getCourse = async (id, token) => {
    let response = {}

    try {
        response = await api.get(`/courses/${id}`, {
            headers: {
                Authorization: token,
            },
        })
    } catch (err) {
        console.log(err)
    }

    return response
}

export const getCourseTheme = async (id, token) => {
    let response = {}

    try {
        response = await api.get(`/courses/${id}/themes`, {
            headers: {
                Authorization: token,
            },
        })
    } catch (err) {
        console.log(err)
    }

    return response
}
