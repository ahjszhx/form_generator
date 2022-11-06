<template>
  <q-dialog v-model="dialogShow">
    <q-card style="max-width: 80vw;min-width:80vw;">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <span class="text-weight-bold">房间内详细信息</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator />
      <!-- 弹出内容 -->
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data  () {
    return {
      dialogShow: false
    }
  },
  props: {
    show: Boolean,
    loid: Array
  },
  watch: {
    show (newValue, oldValue) {
      this.dialogShow = newValue
    },
    dialogShow (newValue, oldValue) {
      if (!newValue) {
        this.$emit('close', newValue)
      }
    }
  }

}
</script>

<style>
</style>
