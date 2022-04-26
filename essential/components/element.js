import 'element-ui/lib/theme-chalk/index.css'
import Slider from 'element-ui/lib/slider'
import Select from 'element-ui/lib/select'
import Option from 'element-ui/lib/option'

// 解决移动端无法正常弹出键盘
// @see https://github.com/ElemeFE/element/issues/12563
Select.computed.readonly = function () {
    // trade-off for IE input readonly problem: https://github.com/ElemeFE/element/issues/10403
    const isIE = !this.$isServer && !isNaN(Number(document.documentMode))
    return !this.filterable || this.multiple || (!isIE && !this.visible && !this.remote)
}

const element = {
    install: function (Vue) {
        Vue.use(Slider)
        Vue.use(Select)
        Vue.use(Option)
    }
}

export default element
