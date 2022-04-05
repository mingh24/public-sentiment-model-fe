import {
    get
} from '@/common/axios'

export const getAttitudeOverallDistribution = questionId => get(`/opinions/attitude/overall-distribution/${questionId}`)

export const getPriceOptionOverallDistribution = questionId => get(`/opinions/price-option/overall-distribution/${questionId}`)

export const getLengthOptionOverallDistribution = questionId => get(`/opinions/length-option/overall-distribution/${questionId}`)
