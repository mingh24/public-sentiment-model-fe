import 'element-ui/lib/theme-chalk/index.css'
import Slider from 'element-ui/lib/slider'
import Table from 'element-ui/lib/table'
import TableColumn from 'element-ui/lib/table-column'

const element = {
    install: function (Vue) {
        Vue.use(Slider)
        Vue.use(Table)
        Vue.use(TableColumn)
    }
}

export default element
