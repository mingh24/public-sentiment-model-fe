import {
    post
} from '@/common/axios'

export const submitAdvanced = submission => post('/questionnaire/advanced', submission)
