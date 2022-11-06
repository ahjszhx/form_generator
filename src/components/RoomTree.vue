<template>
  <q-tree
    ref="orgTree"
    :nodes="props"
    accordion
    selected-color="red"
    node-key="id"
    label-key="nodeName"
    tick-strategy="leaf"
    :ticked.sync="ticked"
    :expanded.sync="expanded"
    @lazy-load="onLazyLoad"
  >
    <template v-slot:default-header="prop">
      <div class="node-box">
        <q-icon
          :name="'img:' + require(`../statics/icons/icon_${prop.node.icon}.png`)"
          size="20px"
        />
        <div class="text-weight-bold">{{ prop.node.nodeName }}</div>
        <!-- <div class="text-weight-bold" v-if="isShow2">
          <q-chip>{{ prop.node.type }}</q-chip>
        </div>-->
      </div>
    </template>
  </q-tree>
</template>

<script>
import {
  getChildrenByKey, getLocationTreePower
} from '../api/data'
export default {
  data () {
    return {
      props: [],
      ticked: [],
      expanded: []
    }
  },
  mounted () {
    getLocationTreePower().then(res => {
      this.props.splice(0, this.props.length)
      this.props.push(res.data)
      this.init()
    })
  },
  watch: {
    ticked (newValue, oldValue) {
      this.choose(newValue)
    }
  },
  methods: {
    init () {
      const { props } = this
      if (props.length === 1) {
        // 仅有一个节点展开
        this.expanded.push(props[0].id)
      }
    },
    onLazyLoad ({ node, key, done, fail }) {
      // 获取子节点
      // const label = node.nodeName
      var children
      console.log('c' + children)
      children = getChildrenByKey(key)
      console.log(key + 'children' + children)
      // console.log(children[1])
      children = children.then(res => {
        console.log(res.data)
        // return res.data
        done(res.data.children)
      })
    },
    getChildrenByKey (key) {
      getChildrenByKey(key).then(res => {
        // console.log('data' + res.data)
        return res.data
      })
    },
    choose (list) {
      this.$emit('choose', list)
    }
  }
}
</script>

<style lang="scss" scoped>
.node-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 11pt;
  color: #333;
  width: 100%;

  img {
    margin-right: 4px;
  }
  div {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
