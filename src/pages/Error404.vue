<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    
    <p class="text-faded">
      페이지를 찾을 수 없습니다. <strong>(404)</strong>
    </p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="홈으로"
    />
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
