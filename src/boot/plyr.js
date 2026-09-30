import Vue from 'vue'
import VuePlyr from 'vue-plyr'
 
Vue.use(VuePlyr, {
  plyr: {
    controls: ['progress'],
    i18n: {
      seek: '재생 위치',
      seekLabel: '{currentTime} / {duration}',
      played: '재생됨',
      buffered: '버퍼링됨',
      currentTime: '현재 시간',
      duration: '재생 시간'
    }
  }
})
