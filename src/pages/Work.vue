<template>
  <div>
    <WorkDetails :metadata="metadata" @reset="requestData()" @resumeHistroy="resumeMetadataPlayHistroy" @translateCwd="translateCwd" @title-updated="updateCustomTitle" />
    <!-- <WorkQueue :queue="tracks" :editable="false" /> -->
    <WorkTree ref="workTree" :tree="tree" :metadata="metadata" :editable="false" />
  </div>
</template>

<script>
import WorkDetails from 'components/WorkDetails'
// import WorkQueue from 'components/WorkQueue'
import WorkTree from 'components/WorkTree'
import NotifyMixin from '../mixins/Notification.js'
import WorkTitleMixin from '../mixins/WorkTitle.js'
import { mapState } from 'vuex'

export default {
  name: 'Work',

  mixins: [NotifyMixin, WorkTitleMixin],

  components: {
    WorkDetails,
    // WorkQueue,
    WorkTree
  },

  data () {
    return {
      workid: this.$route.params.id,
      metadata: {
        id: parseInt(this.$route.params.id),
        circle: {}
      },
      tree: []
    }
  },

  computed: {
    ...mapState('AudioPlayer', [
      'playing',
      'playWorkId'
    ]),
  },

  watch: {
    workTitleMode () {
      this.applyDisplayTitleToTree()
    },

    $route (to) {
      this.workid = to.params.id;
      this.metadata.state = null;
      this.requestData();
    },
    
    metadata() {
    }
  },

  created () {
    this.requestData()
  },

  methods: {
    async requestMetaData() {
      try {
        const response = await this.$axios.get(`/api/work/${this.workid}`);
        this.metadata = response.data
        this.applyDisplayTitleToTree()
        // 如果有播放状态记录
        // 同时当前尚未播放，则设置历史播放进度
        if (this.metadata.state && this.playWorkId == 0) {
          this.resumeMetadataPlayHistroy()
        }
      } catch (error ) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
        } else {
          this.showErrNotif(error.message || error)
        }
      }
    },

    async requestTracks() {
      try {
        const response = await this.$axios.get(`/api/tracks/${this.workid}`);
        this.tree = response.data;
        this.applyDisplayTitleToTree()
      } catch (error) {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          this.showErrNotif(error.response.data.error || `${error.response.status} ${error.response.statusText}`)
        } else {
          this.showErrNotif(error.message || error)
        }
      }
    },

    requestData () {
      this.requestMetaData();
      this.requestTracks();
    },

    updateCustomTitle (customTitle) {
      this.$set(this.metadata, 'customTitle', customTitle)
      this.applyDisplayTitleToTree()
    },

    applyDisplayTitleToTree () {
      const title = this.workDisplayTitle(this.metadata)
      const updateNodes = nodes => {
        nodes.forEach(node => {
          if (node.type === 'folder') {
            updateNodes(node.children)
          } else if (Object.prototype.hasOwnProperty.call(node, 'workTitle')) {
            this.$set(node, 'workTitle', title)
          }
        })
      }

      updateNodes(this.tree)
      if (this.playWorkId === this.metadata.id) {
        this.$store.commit('AudioPlayer/SET_WORK_TITLE_FOR_WORK', {
          workId: this.metadata.id,
          title
        })
      }
    },

    resumeMetadataPlayHistroy() {
      this.$store.commit('AudioPlayer/SET_QUEUE', {
        workId: this.metadata.id,
        queue: this.workTitleQueue(this.metadata, this.metadata.state.queue),
        index: this.metadata.state.index,
        resetPlaying: false,
        resumeHistroySeconds: this.metadata.state.seconds,
      })
      console.log(`resume seconds = ${this.metadata.state.seconds}`)
    },

    // 翻译当前浏览目录的所有音频文件
    translateCwd() {
      this.$refs.workTree.translateCwd();
    }
  }
}
</script>
