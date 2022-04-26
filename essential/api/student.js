import {
    get
} from '@/common/axios'

export const getStudentByName = name => get(`/students/name/${name}`)
