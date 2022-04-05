import {
	get
} from '@/common/axios'

export const getQuestionByQuestionId = questionId => get(`/questions/question-id/${questionId}`)
