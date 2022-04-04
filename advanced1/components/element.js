import 'element-ui/lib/theme-chalk/index.css'
import Slider from 'element-ui/lib/slider'

const element = {
	install: function(Vue) {
		Vue.use(Slider)
	}
}

export default element
