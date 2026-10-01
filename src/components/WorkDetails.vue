<template>
  <div class="row work-details-row">
      <CoverSFW 
        class="col q-ma-sm row justify-start shadow-4 work-details-cover"
        :workid="metadata.id" 
        :nsfw="false" 
        :release="metadata.release" 
        :lyric_status="metadata.lyric_status"
        style="border-radius: 8px; overflow: hidden;"
      />

    <div class="col-12 col-md q-pa-sm work-details-info">
      <div class="q-px-sm q-py-none">
        <!-- 标题 -->
        <div class="row items-start no-wrap">
          <div class="text-h6 text-weight-regular col">
            <router-link :to="`/work/${metadata.id}`" class="text-secondary">
              {{ workDisplayTitle(metadata) }}
            </router-link>
          </div>
        </div>

        <!-- 社团名 -->
        <div class="text-subtitle1 text-weight-regular">
          <router-link :to="`/works?circleId=${metadata.circle.id}`" class="text-grey">
            <q-icon name="groups" size="1em" class="metadata-role-icon" aria-hidden="true" />
            {{metadata.circle.name}}
          </router-link>
        </div>

        <!-- 评价&评论 -->
        <div class="row items-center q-gutter-xs">
          <!-- 评价 -->
          <div class="col-auto">
            <q-rating
              v-model="rating"
              @input="setRating"
              name="rating"
              size="sm"
              :color="userMarked ? 'blue' : 'amber'"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
            />

            <!-- 评价分布明细 -->
            <q-tooltip v-if=metadata.rate_count_detail content-class="text-subtitle1">
              <div>평균: {{metadata.rate_average_2dp}}</div>
              <div v-for="(rate, index) in sortedRatings" :key=index class="row items-center">
                <div class="col"> {{rate.review_point}}점 </div>

                <!-- 评价占比 -->
                <q-linear-progress
                  :value="rate.ratio/100"
                  color="amber"
                  track-color="white"
                  style="height: 15px; width: 100px"
                  class="col-auto"
                />

                <div class="col q-mx-sm"> ({{rate.count}}) </div>
              </div>
            </q-tooltip>
          </div>

          <div class="col-auto">
            <span class="text-weight-medium text-body1 text-red">{{metadata.rate_average_2dp}}</span> <span class="text-grey"> ({{metadata.rate_count}})</span>
          </div>

          <!-- 评论数量 -->
          <div class="col-auto q-px-sm">
            <q-icon name="chat" size="xs" /> <span class="text-grey"> ({{metadata.review_count}})</span>
          </div>

          <!-- DLsite链接 -->
          <div class="col-auto">
            <q-icon name="launch" size="xs" /><a class="text-blue" :href="`https://www.dlsite.com/home/work/=/product_id/RJ${dlsiteCode}.html`" rel="noreferrer noopener" target="_blank">DLsite</a>
          </div>
        </div>
      </div>

      <!-- 价格&售出数 -->
      <div class="q-pt-sm q-pb-none">
        <span class="q-mx-sm text-weight-medium text-h6 text-red">{{metadata.price}} 엔</span> 판매량: {{metadata.dl_count}}
      </div>

      <!-- 标签 -->
      <div class="q-px-none q-py-sm" v-if="showTags">
        <router-link
          v-for="(tag, index) in metadata.tags"
          :to="`/works?tagId=${tag.id}`"
          :key=index
        >
          <q-chip size="md" class="shadow-4">
            {{tag.name}}
          </q-chip>
        </router-link>
      </div>

      <!-- 声优 -->
      <div class="q-px-none q-pt-sm q-py-sm">
        <router-link
          v-for="(va, index) in metadata.vas"
          :to="`/works?vaId=${va.id}`"
          :key=index
        >
          <q-chip square size="md" class="shadow-4" color="teal" text-color="white">
            <q-icon name="mic" size="1em" class="metadata-role-icon" aria-hidden="true" />
            {{va.name}}
          </q-chip>
        </router-link>
      </div>

      <q-btn-dropdown
        dense
        class="q-mt-sm shadow-4 q-mx-xs q-pl-sm"
        color="cyan"
        label="청취 상태"
      >
        <q-list>
          <q-item clickable @click="setProgress('marked')" class="q-pa-xs">
            <q-item-section>
              <q-item-label>듣고 싶음</q-item-label>
            </q-item-section>
            <q-item-section v-if="progress === 'marked'" side>
              <q-icon name="check" />
            </q-item-section>
          </q-item>

          <q-item clickable @click="setProgress('listening')" class="q-pa-xs">
            <q-item-section>
              <q-item-label>듣는 중</q-item-label>
            </q-item-section>
            <q-item-section v-if="progress === 'listening'" side>
              <q-icon name="check" />
            </q-item-section>
          </q-item>
          <q-item clickable @click="setProgress('listened')" class="q-pa-xs">
            <q-item-section>
              <q-item-label>들은 작품</q-item-label>
            </q-item-section>
            <q-item-section v-if="progress === 'listened'" side>
              <q-icon name="check" />
            </q-item-section>
          </q-item>
          <q-item clickable @click="setProgress('replay')" class="q-pa-xs">
            <q-item-section>
              <q-item-label>다시 듣기</q-item-label>
            </q-item-section>
            <q-item-section v-if="progress === 'replay'" side>
              <q-icon name="check" />
            </q-item-section>
          </q-item>
          <q-item clickable @click="setProgress('postponed')" class="q-pa-xs">
            <q-item-section>
              <q-item-label>보류</q-item-label>
            </q-item-section>
            <q-item-section v-if="progress === 'postponed'" side>
              <q-icon name="check" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-btn v-if="userName === 'admin'" dense @click="openCustomTitleEditor" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="제목 편집" />

      <q-btn dense @click="showReviewDialog = true" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="리뷰 작성" />

      <q-btn v-if="metadata.state && playWorkId !== metadata.id" dense @click="resumeThisHistroy" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="이 작품의 재생 기록 이어 듣기" />
      <q-btn v-if="metadata.state" dense @click="clearThisHistroy" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="재생 기록 삭제">
        <q-tooltip>재생 기록에 삭제된 오디오 파일이 있으면 정상 재생되지 않을 수 있습니다. 이 버튼으로 기록을 지울 수 있습니다.</q-tooltip>
      </q-btn>

      <q-btn dense @click="$emit('translateCwd')" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="현재 폴더의 오디오 번역">
        <q-tooltip>하위 폴더의 오디오는 포함되지 않습니다.</q-tooltip>
      </q-btn>

      <q-btn dense @click="scanWorkFile" color="cyan q-mt-sm shadow-4 q-mx-xs q-px-sm" label="로컬 파일 스캔" />

      <q-dialog v-model="showTitleDialog">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-card-section>
            <div class="text-h6">작품 제목 편집</div>
          </q-card-section>

          <q-card-section>
            <q-input
              v-model="customTitleInput"
              label="사용자 지정 제목"
              hint="비워 두면 사용자 지정 제목을 삭제합니다."
              maxlength="300"
              counter
              autofocus
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="취소" v-close-popup />
            <q-btn color="primary" label="저장" :loading="savingTitle" @click="saveCustomTitle" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <WriteReview v-if="showReviewDialog" @closed="processReview" :workid="metadata.id" :metadata="metadata"></WriteReview>
    </div>
  </div>
</template>

<script>
import CoverSFW from 'components/CoverSFW'
import WriteReview from './WriteReview'
import NotifyMixin from '../mixins/Notification.js'
import WorkTitleMixin from '../mixins/WorkTitle.js'
import { mapState } from 'vuex'

export default {
  name: 'WorkDetails',

  mixins: [NotifyMixin, WorkTitleMixin],

  components: {
    CoverSFW,
    WriteReview
  },

  props: {
    metadata: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      rating: 0,
      userMarked: false,
      progress: '',
      showReviewDialog: false,
      showTags: true,
      showTitleDialog: false,
      customTitleInput: '',
      savingTitle: false
    }
  },

  computed: {
    sortedRatings: function() {
      function compare(a, b) {
        return (a.review_point > b.review_point) ? -1 : 1;
      }
      return this.metadata.rate_count_detail.slice().sort(compare);
    },
    
    dlsiteCode() {
      let c = String(this.metadata.id);
      c = this.metadata.id > 1000000 
        ? c.padStart(8,'0')  // 8位RJ番号
        : c.padStart(6,'0'); // 6位RJ番号
      return c;
    },

    ...mapState('AudioPlayer', [
      'playing',
      'playWorkId'
    ]),
    ...mapState('User', {
      userName: 'name'
    })
  },

  watch: {
    // 需要用watch因为父component pages/work.vue是先用空值初始化的
    metadata (newMetaData) {
      if (newMetaData.userRating) {
        this.userMarked = true;
        this.rating = newMetaData.userRating;
      } else {
        this.userMarked = false;
        this.rating = newMetaData.rate_average_2dp || 0;
      }
      this.progress = newMetaData.progress;

      // 极个别作品没有标签
      if (newMetaData.tags && newMetaData.tags[0].name === null) {
        this.showTags = false;
      }
    },
  },

  methods: {
    openCustomTitleEditor () {
      this.customTitleInput = this.metadata.customTitle || this.workDisplayTitle(this.metadata)
      this.showTitleDialog = true
    },

    async saveCustomTitle () {
      if (this.savingTitle) return
      this.savingTitle = true

      try {
        const response = await this.$axios.put(`/api/work/${this.metadata.id}/custom-title`, {
          customTitle: this.customTitleInput
        })
        const customTitle = response.data.customTitle || ''
        this.$emit('title-updated', customTitle)
        this.showTitleDialog = false
        this.$q.notify({ message: '작품 제목을 저장했습니다.', color: 'positive' })
      } catch (error) {
        const message = error.response
          ? (error.response.data.error || `${error.response.status} ${error.response.statusText}`)
          : (error.message || error)
        this.showErrNotif(message)
      } finally {
        this.savingTitle = false
      }
    },

    setProgress (newProgress) {
      this.progress = newProgress;
      const submitPayload = {
        'user_name': this.$store.state.User.name, // 用户名不会被后端使用
        'work_id': this.metadata.id,
        'progress': newProgress
      };
      this.submitProgress(submitPayload);
    },

    submitProgress (payload) {
      const params = {
        starOnly: false,
        progressOnly: true
      }
      this.$axios.put('/api/review', payload, {params})
        .then((response) => {
          this.showSuccNotif(response.data.message);
          this.$emit('reset');
        })
        .catch((error) => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
          } else {
            this.showErrNotif(error.message || error)
          }
        })
    },

    setRating (newRating) {
      const submitPayload = {
        'user_name': this.$store.state.User.name, // 用户名不会被后端使用
        'work_id': this.metadata.id,
        'rating': newRating
      };
      this.submitRating(submitPayload);
    },

    submitRating (payload) {
      this.$axios.put('/api/review', payload)
        .then((response) => {
          this.showSuccNotif(response.data.message);
          this.$emit('reset');
        })
        .catch((error) => {
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
          } else {
            this.showErrNotif(error.message || error)
          }
        })
    },

    processReview () {
      this.showReviewDialog = false;
    },

    resumeThisHistroy() {
      this.$emit("resumeHistroy")
    },

    clearThisHistroy() {
      this.$q.dialog({
        title: '주의',
        message: '이 작품의 재생 기록을 삭제하시겠습니까?',
        cancel: "취소",
        ok: "확인"
      }).onOk(async () => {
        this.$axios.delete('/api/histroy', { data: { work_id: this.metadata.id } })
          .then((_) => {
            this.$q.notify("재생 기록을 삭제했습니다.")
          })
          .catch((err) => {
            this.$q.notify("재생 기록을 삭제하지 못했습니다:", err.message)
            console.error(err)
          })
      })
    },

    async scanWorkFile() {
      try {
        const response = await this.$axios.post(`/api/work/scan/${this.metadata.id}`);
        if (response.data.memo) {
          this.$router.go(0);
        }
      } catch(err) {
        console.error(err);
        this.showErrNotif(err.message || err);
      }
    }
  }
}
</script>

<style scoped lang="scss">
@media (max-width: 1023px) {
  .work-details-row {
    justify-content: center;
  }

  .work-details-row > .work-details-cover {
    flex: 0 0 100%;
    width: 100%;
    max-width: 560px;
  }

  .work-details-row > .work-details-info {
    flex: 0 1 auto;
    width: fit-content;
    max-width: 100%;
  }
}
</style>
