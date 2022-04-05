import {
	post
} from '@/common/axios'

export const submitEssential = submission => post('/questionnaire/essential', submission)
