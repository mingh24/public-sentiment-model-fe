import 'element-ui/lib/theme-chalk/index.css'
import Slider from 'element-ui/lib/slider'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'

const element = {
    install: function (Vue) {
        Vue.use(Slider)
        Vue.use(Select)
        Vue.use(Option)
    }
}

export default element
