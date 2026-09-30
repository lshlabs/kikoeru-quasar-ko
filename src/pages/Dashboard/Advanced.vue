<template>
  <q-form @submit="onSubmit" class="advanced-settings">
    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>브라우저별 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>고급 오디오 모드</q-item-label>
            <q-item-label caption>오디오 시각화와 좌우 채널 전환을 사용할 수 있습니다. 데스크톱 브라우저 사용을 권장합니다. iOS 모바일에서는 소리가 나지 않을 수 있습니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle :value="enableVisualizer" @input="changeEnableVisualizer" dense/>
          </q-item-section>
        </q-item>

        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>영상 소스 사용</q-item-label>
            <q-item-label caption>MP4 파일의 소리를 재생하면서 전체 화면 플레이어에서 영상도 볼 수 있습니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle :value="enableVideoSource" @input="changeEnableVideoSource" dense/>
          </q-item-section>
        </q-item>

        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>이전 작품 카드 사용</q-item-label>
            <q-item-label caption>검색 결과에 이전 카드 디자인을 사용합니다. 이전 카드는 모든 태그를 바로 보여 줍니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle :value="oldWorkCardUIStyle" @input="changeOldWorkCardUIStyle" dense/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>플레이어 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>뒤로 이동할 시간</q-item-label>
            <q-item-label caption>뒤로 이동 버튼을 누를 때 건너뛸 시간</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <div class="q-gutter-sm">
              <q-radio dense v-model="rewindSeekTime" val=5 label="5 초" />
              <q-radio dense v-model="rewindSeekTime" val=10 label="10 초" />
              <q-radio dense v-model="rewindSeekTime" val=30 label="30 초" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>앞으로 이동할 시간</q-item-label>
            <q-item-label caption>앞으로 이동 버튼을 누를 때 건너뛸 시간</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <div class="q-gutter-sm">
              <q-radio dense v-model="forwardSeekTime" val="5" label="5 초" />
              <q-radio dense v-model="forwardSeekTime" val="10" label="10 초" />
              <q-radio dense v-model="forwardSeekTime" val="30" label="30 초" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>메타데이터 수집 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>태그 수집 언어</q-item-label>
            <q-item-label caption>DLsite에서 가져올 태그 메타데이터의 언어</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <div class="q-gutter-sm">
              <q-radio dense v-model="config.tagLanguage" val="zh-cn" label="중국어 간체" />
              <q-radio dense v-model="config.tagLanguage" val="zh-tw" label="중국어 번체" />
              <q-radio dense v-model="config.tagLanguage" val="ja-jp" label="일본어" />
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>DLsite 요청 제한 시간</q-item-label>
            <q-item-label caption>기본값: 10,000ms</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.dlsiteTimeout"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>HVDB 요청 제한 시간</q-item-label>
            <q-item-label caption>기본값: 10,000ms</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.hvdbTimeout"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>재시도 간격</q-item-label>
            <q-item-label caption>기본값: 2,000ms</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.retryDelay"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>최대 재시도 횟수</q-item-label>
            <q-item-label caption>기본값: 5</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.retry"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>동시 수집 작업 수</q-item-label>
            <q-item-label caption>기본값: 16</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.maxParallelism"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>HTTP 프록시 호스트 IP</q-item-label>
            <q-item-label caption>비워 두면 이 컴퓨터를 사용합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model="config.httpProxyHost"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>HTTP 프록시 포트 </q-item-label>
            <q-item-label caption>0이면 프록시를 사용하지 않습니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.httpProxyPort"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>폴더 스캔 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>최대 하위 폴더 깊이</q-item-label>
            <q-item-label caption>기본값: 2</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.scannerMaxRecursionDepth"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>스캔 시 없는 작품 정리 건너뛰기</q-item-label>
            <q-item-label caption>없는 음성 작품을 목록에서 정리하지 않습니다. 권장하지 않으며 기본값은 끔입니다.</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="config.skipCleanup" dense />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>웹 서버 설정</q-toolbar-title>
        <div class="q-pr-xs">설정을 변경한 뒤 프로그램을 재시작해야 합니다.</div>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>사용자 인증</q-item-label>
            <q-item-label caption>사용자 인증을 사용합니다. 운영 환경에서는 변경할 수 없습니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.auth" dense :disable="config.production" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Gzip 사용</q-item-label>
            <q-item-label caption>네트워크 전송에 Gzip 압축을 사용합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.enableGzip" dense/>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>포트 설정</q-item-label>
            <q-item-label caption>서버가 연결을 기다릴 포트</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.listenPort"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>원격 접속 차단</q-item-label>
            <q-item-label caption>로컬 접속만 허용합니다. 기본값은 꺼짐이며 변경 후 재시작해야 합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.blockRemoteConnection" dense/>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>토큰 유효 기간</q-item-label>
            <q-item-label caption>기본값: 2,592,000초</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.expiresIn"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>페이지당 작품 수</q-item-label>
            <q-item-label caption>기본값: 12</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-input
              v-model.number="config.pageSize"
              type="number"
              input-class="text-right"
              style="max-width: 100px;"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>보안 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>운영 환경</q-item-label>
            <q-item-label caption>이 설정은 웹에서 변경할 수 없습니다. 자세한 내용은 GitHub Wiki의 설정 파일 안내를 확인하세요.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.production" dense disable />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card class="q-ma-md">
      <q-toolbar>
        <q-toolbar-title>기타 설정</q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item style="height: 70px;">
          <q-item-section>
            <q-item-label>업데이트 확인</q-item-label>
            <q-item-label caption>페이지를 열 때 업데이트를 확인합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.checkUpdate" dense />
          </q-item-section>
        </q-item>

        <q-item v-if="config.checkUpdate">
          <q-item-section>
            <q-item-label>시험판 업데이트 확인</q-item-label>
            <q-item-label caption>시험판 업데이트도 확인합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.checkBetaUpdate" dense />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>데이터베이스 기본 경로 사용</q-item-label>
            <q-item-label caption>프로그램 폴더의 sqlite를 사용하며 databaseFolderDir 설정을 무시합니다. 변경 후 재시작해야 합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.dbUseDefaultPath" dense />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>표지 기본 경로 사용</q-item-label>
            <q-item-label caption>프로그램 폴더의 covers를 사용하며 표지 폴더 경로 설정을 무시합니다.</q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-toggle v-model="config.coverUseDefaultPath" dense />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <div class="q-ma-lg row justify-end">
      <q-btn :loading="loading" label="저장" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script>
import NotifyMixin from '../../mixins/Notification.js'
import { mapState } from 'vuex'

export default {
  name: 'Advanced',

  mixins: [NotifyMixin],

  data () {
    return {
      config: {},
      loading: false,
      rewindSeekTime: '5',
      forwardSeekTime: '30',
      
    }
  },

  computed: {
    ...mapState('AudioPlayer', [
      'oldWorkCardUIStyle',
      'enableVideoSource',
      'enableVisualizer',
    ]),
  },

  methods: {
    requestConfig () {
      this.$axios.get('/api/config/admin')
        .then((response) => {
          this.config = response.data.config;
          // Integer => String
          this.rewindSeekTime = this.config.rewindSeekTime.toString()
          this.forwardSeekTime = this.config.forwardSeekTime.toString()
        })
        .catch((error) => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            if (error.response.status !== 401) {
              this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
            }
          } else {
            this.showErrNotif(error.message || error)
          }
        })
    },

    onSubmit () {
      // String => Integer
      this.config.rewindSeekTime = parseInt(this.rewindSeekTime)
      this.config.forwardSeekTime = parseInt(this.forwardSeekTime)

      this.loading = true
      this.$axios.put('/api/config/admin', {
        config: this.config
      })
        .then((response) => {
          this.loading = false
          this.showSuccNotif(response.data.message)
        })
        .catch((error) => {
          this.loading = false
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
          } else {
            this.showErrNotif(error.message || error)
          }
        })
    },

    changeOldWorkCardUIStyle(value) {
      console.log("change old work card ui to: ", value, typeof(value));
      this.$store.commit('AudioPlayer/SET_OLD_WORK_CARD_UI_STYLE', value);
    },

    changeEnableVideoSource(value) {
      this.$store.commit('AudioPlayer/SET_ENABLE_VIDEO_SOURCE', value);
    },

    changeEnableVisualizer(value) {
      this.$store.commit('AudioPlayer/SET_ENABLE_VISUALIZER', value);
    }
  },

  created () {
    this.requestConfig()

  }
}
</script>

<style>
@media (max-width: 599px) {
  .advanced-settings .q-item {
    height: auto !important;
    min-height: 70px;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .advanced-settings .q-item__section--side {
    min-width: 0;
    padding-left: 0;
    align-self: stretch;
  }

  .advanced-settings .q-item .q-gutter-sm {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
