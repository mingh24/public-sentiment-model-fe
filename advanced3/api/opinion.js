import {
    get
} from '@/common/axios'

export const getAttitudeOverallDistribution = questionId => get(`/opinions/attitude/overall-distribution/${questionId}`)

export const getPriceOptionOverallDistribution = questionId => get(`/opinions/price-option/overall-distribution/${questionId}`)

export const getLengthOptionOverallDistribution = questionId => get(`/opinions/length-option/overall-distribution/${questionId}`)

export const getAttitudeIntimateDistribution = (studentId, questionId) => get(`/opinions/attitude/intimate-distribution/${studentId}/${questionId}`)

export const getPriceOptionIntimateDistribution = (studentId, questionId) => get(`/opinions/price-option/intimate-distribution/${studentId}/${questionId}`)

export const getLengthOptionIntimateDistribution = (studentId, questionId) => get(`/opinions/length-option/intimate-distribution/${studentId}/${questionId}`)

export const getViewIntimateDistribution = (studentId, questionId) => get(`/opinions/view/intimate-distribution/${studentId}/${questionId}`)
