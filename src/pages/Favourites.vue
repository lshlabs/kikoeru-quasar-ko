<template>
  <q-page padding>
    <div class="fit row wrap justify-between items-start q-px-sm">
      <div class="col-lg-3 col-sm-12 col-xs-12 favourites-toggle-scroll">
          <q-btn-toggle
            v-model="mode"
            @input="changeMode"
            no-caps
            rounded
            toggle-color="primary"
            class="text-bold outline-style"
            style="width: max-content; white-space: nowrap;"
            :options="[
              {label: '재생 기록', value: 'histroy'},
              {label: '내 평가', value: 'review'},
              {label: '청취 상태', value: 'progress'},
              {label: '분류별 정리', value: 'folder'},
            ]"
          />
      </div>

      <!-- 排序选项 -->
      <div v-if="mode != 'histroy'" class="col-auto row q-pt-md">
        <q-select dense rounded outlined v-model="sortBy" :options="sortOptions"/>
        <q-btn
          :disable="sortButtonDisabled"
          dense
          round
          outline
          padding="sm"
          class="q-ml-sm"
          :icon="direction? 'arrow_downward' : 'arrow_upward'"
          @click="switchSortMode" 
        />
      </div>
    </div>

    <!-- 进度选项，仅在我的进度tab选项中显示-->
    <div
      v-if="mode === 'progress'"
      class="q-px-sm q-pt-md favourites-toggle-scroll"
    >
      <q-btn-toggle
        v-model="progressFilter"
        @input="changeProgressFilter"
        toggle-color="primary"
        rounded
        class="outline-style"
        style="width: max-content; white-space: nowrap;"
        :options="[
          {label: '듣고 싶음', value: 'marked'},
          {label: '듣는 중', value: 'listening'},
          {label: '들은 작품', value: 'listened'},
          {label: '다시 듣기', value: 'replay'},
          {label: '보류', value: 'postponed'}
        ]"
      />
    </div>

    <!-- 作品列表 -->
    <div>
      <div class="q-px-sm q-pt-md">
        <q-infinite-scroll @load="onLoad" :offset="500" :disable="stopLoad" ref="scroll" v-if="mode !=='folder'">
          <div class="row justify-center text-grey" v-if="works.length === 0">작품에 별점을 주거나 청취 상태를 지정하면 여기에 표시됩니다.</div>
          <q-list bordered separator class="shadow-2" v-if="works.length">
             <FavListItem v-for="work in works" :key="work.id" :workid="work.id" :metadata="work" @reset="reset()" :mode="mode"></FavListItem> 
          </q-list>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>

        <div v-else class="row justify-center text-grey">아직 지원하지 않는 기능입니다.</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import FavListItem from 'components/FavListItem'
import NotifyMixin from '../mixins/Notification.js'

export default {
  name: 'Favourites',

  mixins: [NotifyMixin],

  components: {
    FavListItem
  },

  props: {
    route: {
      type: String,
      default: 'review'
    },
    progress: {
      type: String,
      default: 'marked'
    }
  },

  computed: {
    direction () {
      return this.sortMode === 'desc'
    },

    sortButtonDisabled () {
      return this.sortBy.order === 'allage' || this.sortBy.order === 'nsfw'
    }
  },

  data() {
    return {
      mode: 'histroy',
      progressFilter: 'marked',
      works: [],
      stopLoad: false,
      pagination: { currentPage:0, pageSize:12, totalCount:0 },
      sortMode: 'desc',
      sortBy: {
          label: '표시한 날짜',
          order: 'updated_at'
        },
      sortOptions: [
        {
          label: '표시한 날짜',
          order: 'updated_at'
        },
        {
          label: '평가',
          order: 'userRating'
        },
        {
          label: '발매일',
          order: 'release'
        },
        {
          label: '리뷰 수',
          order: 'review_count'
        },
        {
          label: '판매량',
          order: 'dl_count'
        },
        {
          label: '전연령 신작',
          order: 'allage'
        },
        {
          label: '성인용 신작',
          order: 'nsfw'
        }
      ]
    }
  },

  created() {
    this.mode = this.route;
    this.progressFilter = this.progress;
  },

  mounted() {
    if (localStorage.sortByFavourites) {
      try {
        this.sortBy = JSON.parse(localStorage.sortByFavourites);
      } catch {
        localStorage.removeItem('sortByFavourites');
      }
    }
  },

  watch: {
    sortBy(newSortOptionSetting) {
      localStorage.sortByFavourites = JSON.stringify(newSortOptionSetting);
      this.reset();
    },

    sortMode() {
      this.reset();
    },

    // Browser back and forth
    route() {
      this.mode = this.route;
      this.reset();
    },
    progress() {
      this.progressFilter = this.progress;
      this.reset();
    }
  },

  methods: {
    // Split two-way binding
    changeMode(newMode) {
      this.$router.push(`/favourites/${newMode}`);
      this.reset();
    },

    // Split two-way binding
    changeProgressFilter(newFilter) {
      this.$router.push(`/favourites/progress/${newFilter}`);
      this.reset();
    },

    switchSortMode() {
      if(this.sortMode ==='desc') {
        this.sortMode = 'asc'
      } else {
        this.sortMode = 'desc'
      }
    },

    onLoad (index, done) {
      this.requestWorksQueue()
        .then(() => done())
    },

    reset () {
      // Freeze the scroller first
      this.stopLoad = true
      this.pagination = { currentPage:0, pageSize:12, totalCount:0 }
      // Manually fetch first page content before enable scroller
      // Note: the internal API of the infinite scroller does not work well
      this.requestWorksQueue()
        .then(() => {
          this.stopLoad = false
        })
    },

    requestWorksQueue () {
      const params = {
        order: this.sortBy.order,
        sort: this.sortMode,
        page: this.pagination.currentPage + 1 || 1
      }

      if (this.sortBy.order === 'allage') {
        params.order = 'nsfw'
        params.sort = 'asc'
      }

      if (this.sortBy.order === 'nsfw') {
        params.order = 'nsfw'
        params.sort = 'desc'
      }

      if (this.mode === 'progress') {
        params.filter = this.progressFilter;
      }

      const requestUrl = this.mode == 'histroy' ? "/api/histroy" : 'api/review'
      return this.$axios.get(requestUrl, { params })
        .then((response) => {                  
          const works = response.data.works
          this.works = (params.page === 1) ? works.concat() : this.works.concat(works)
          this.pagination = response.data.pagination

          if (this.works.length >= this.pagination.totalCount) {
            this.stopLoad = true
          }
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
          this.stopLoad = true
        })
    },
  }
}
</script>

<style scoped>
.favourites-toggle-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
}

.favourites-toggle-scroll::-webkit-scrollbar {
  height: 4px;
}

.outline-style {
  border: 1px solid var(--q-color-primary);
}
</style>
