import { getCartList, changeCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    changeCount (state, { goodsId, value }) {
      const obj = state.cartList.find(item => item.goods_id === goodsId)
      obj.goods_num = value
    },
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 从传入的id判断出是哪个商品被点击，修改他的复选框状态为与原来相反
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    }
  },
  actions: {
    // 删除购物车数据
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新的购物车数据 (重新渲染)
      context.dispatch('getCartAction')
    },
    async getCartAction (context) {
      const { data } = await getCartList()
      data.list.forEach(item => {
        item.isChecked = true
      })
      // this.state.cartList = data.list
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      const { goodsId, value, skuId } = obj
      // 我们如果不修改列表的数据，我们每次刷新才能看到更新之后的数据
      context.commit('changeCount', {
        goodsId,
        value
      })
      // 接下来我们再调用接口改变后台的数据
      await changeCount(goodsId, value, skuId)
    }
  },
  getters: {
    // 用来判断是否全都被选中，是则返回true
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    },
    // 求所有商品的累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    },
    // 筛选出选中的商品
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 计算出选中商品的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item, index) => sum + item.goods_num, 0)
    },
    // 计算出选中商品的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item, index) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    }
  }
}
