import { mapState } from 'vuex'
import { displayWorkTitle } from '../utils/workTitle'

export default {
  computed: {
    ...mapState('AudioPlayer', ['workTitleMode'])
  },

  methods: {
    workDisplayTitle (work) {
      return displayWorkTitle(work, this.workTitleMode)
    },

    workTitleQueue (work, queue) {
      const title = this.workDisplayTitle(work)
      return queue.map(track => Object.assign({}, track, { workTitle: title }))
    }
  }
}
