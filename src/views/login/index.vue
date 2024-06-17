<template>
  <div class="login">
    <van-nav-bar
    title="会员登录"
    left-arrow
    @click-left="$router.go(-1)"
    />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <!-- v-model双向绑定，用户输入验证码就可以立刻获取到 -->
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <!--:src意思是设置src为data中有的数据，不加冒号无法使用data中的数据-->
          <!-- v-if设置只有当获取到picurl时，才会显示该标签，否则不显示 -->
          <img v-if="picUrl" :src="picUrl" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{ second === totalSecond ? '获取验证码' : second + '秒后重新获取' }}
          </button>
        </div>
      </div>

      <div class="login-btn"  @click="login">登录</div>
    </div>
  </div>
</template>

<script>
// 先导入封装好的axios
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'

export default {
  name: 'LoginIndex',
  data () {
    return {
      msgCode: '', // 存储短信验证码
      picCode: '', // 存储用户输入的图形验证码
      mobile: '', // 手机号
      picKey: '', // 存储验证码唯一标识
      picUrl: '', // 存储请求获取到的图片url地址
      totalSecond: 60, // 总秒数
      second: 60, // 当前秒数，当second=totalSecond开启定时器
      timer: null // 定时器id

    }
  },
  async created () {
    this.getPicCode()
  },
  methods: {
    // 校验输入框内容
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 获取图形验证码
    async getPicCode () {
      // 将请求回来的data解构成只有base64跟key
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
    },
    // 获取短信验证码
    async getCode () {
      if (!this.validFn()) {
        return
      }
      // 如果没有定时器并且秒数归位的时候才可以开启定时器
      if (!this.timer && this.second === this.totalSecond) {
        // 发送请求，获取验证码
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        this.$toast('发送成功，请注意查收')
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    destroyed () {
      clearInterval(this.timer)
    },
    async login () {
      if (!this.validFn()) {
        return // 需要再验证一次手机以及短信以防被改
      }
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('请输入正确的手机验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      this.$store.commit('user/setUserInfo', res.data)
      // 判断有无回跳地址
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
      // this.$router.push('/') push推到另一个网页
      this.$toast('登录成功')
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
