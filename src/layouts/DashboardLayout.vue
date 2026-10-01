<template>
  <q-layout :view="isAdvancedSettings ? 'Hhh LpR fFf' : 'hhh LpR fFf'">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>관리자 화면</q-toolbar-title>
        <q-btn
          v-if="isAdvancedSettings"
          :loading="advancedSettingsLoading"
          label="저장"
          color="primary"
          dense
          @click="$root.$emit('dashboard-advanced-settings-submit')"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above

      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay

      :width="200"
      :breakpoint="500"
      bordered
      content-class=""
    >
      <div class="column justify-between fit">
        <q-list padding class="col-auto">
          <q-item 
            clickable
            v-ripple
            exact
            :to="link.path"
            active-class="text-primary text-weight-bold"
            v-for="(link, index) in links"
            :key="index"
            class="col text-subtitle1"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              {{link.title}}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import NotifyMixin from '../mixins/Notification.js'

export default {
  name: 'DashboardLayout',

  mixins: [NotifyMixin],

  data () {
    return {
      drawer: false,
      miniState: true,
      advancedSettingsLoading: false,
      links: [
        {
          title: '음성 라이브러리',
          icon: 'folder',
          path: '/admin'
        },
        {
          title: '스캔',
          icon: 'youtube_searched_for',
          path: '/admin/scanner'
        },
        {
          title: '사용자 관리',
          icon: 'person',
          path: '/admin/usermanage'
        },
        {
          title: '고급 설정',
          icon: 'settings',
          path: '/admin/advanced'
        },
        
        {
          title: '홈으로',
          icon: 'home',
          path: '/'
        }
      ]
    }
  },

  computed: {
    isAdvancedSettings () {
      return this.$route.path === '/admin/advanced'
    }
  },

  sockets: {
    success (payload) {
      this.showSuccNotif(
        typeof payload.message === 'string' && payload.message.trim() === '成功登录管理后台.'
          ? '관리자 화면에 연결되었습니다.'
          : payload.message
      )
      if (payload.auth) {
        this.$store.commit('User/INIT', payload.user)
        this.$store.commit('User/SET_AUTH', payload.auth)
      }
    },
    error (err) {
      this.showWarnNotif(err.message || err)
      this.$socket.close()
      // 验证失败，跳转到登录页面
      this.$router.push('/login')
    }
  },

  created () {
    this.$root.$on('dashboard-advanced-settings-loading', this.setAdvancedSettingsLoading)

    // 从 LocalStorage 中读取 token
    const token = this.$q.localStorage.getItem('jwt-token') || ''
    this.$socket.io.opts.query.auth_token = token
    
    if (!this.$socket.connected) {
      this.$socket.open()
    }
  },

  beforeDestroy () {
    this.$root.$off('dashboard-advanced-settings-loading', this.setAdvancedSettingsLoading)
  },

  methods: {
    setAdvancedSettingsLoading (loading) {
      this.advancedSettingsLoading = loading
    }
  }
}
</script>

<style lang="scss" scoped>
  a {
    text-decoration:none;
  }
</style>
