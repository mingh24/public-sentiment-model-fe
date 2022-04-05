import Config from '@/common/config.js'
import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: Config.serverUrl,
	timeout: 10000,
})

export const get = (url, params) => {
	return axiosInstance.get(url, {
		params: params
	})
}

export const post = (url, data) => {
	return axiosInstance.post(url, data, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
}
