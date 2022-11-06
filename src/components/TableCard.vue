<template>
  <div class="table-wrap">
    <div class="card-style">
      <!-- 表格标题 top -->
      <div class="card-top" v-if="$slots.top">
        <slot name="top"></slot>
      </div>
      <div class="card-content-wrap">
        <!-- 有左侧内容 -->
        <template v-if="$slots.left">
          <q-splitter
            v-model="splitterModel"
            :limits="[15, 50]"
            separator-class="separator-class"
          >
            <template v-slot:before>
              <!-- 表格左侧 left -->
              <div class="card-content-left" v-if="$slots.left">
                <slot name="left"></slot>
              </div>
            </template>
            <template v-slot:after>
              <div class="card-content-right">
                <!-- 表格筛选块 filter -->
                <div class="card-filter-wrap">
                  <div class="card-filter" v-if="$slots.filter">
                    <slot name="filter"></slot>
                  </div>
                </div>

                <!-- 表格内容块 table -->
                <div class="card-table-wrap">
                  <div class="card-table" v-if="$slots.table">
                    <slot name="table"></slot>
                  </div>
                </div>
              </div>
            </template>
          </q-splitter>
        </template>
        <template v-else-if="$slots.table">
          <div class="card-content-right">
            <!-- 表格筛选块 filter -->
            <div class="card-filter-wrap">
              <div class="card-filter" v-if="$slots.filter">
                <slot name="filter"></slot>
              </div>
            </div>

            <!-- 表格内容块 table -->
            <div class="card-table-wrap">
              <div class="card-table" v-if="$slots.table">
                <slot name="table"></slot>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      splitterModel: 22
    };
  }
};
</script>
<style lang="scss" scoped>
// 屏幕宽度小于500px后，不以卡片形式展现
@media screen and (max-width: 500px) {
  .table-wrap {
    padding: 0 !important;
  }
  .card-style {
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
// 屏幕宽度小于400px后，不以卡片形式展现
@media screen and (max-width: 450px) {
  .q-field {
    background-color: #ffffff;
    width: 100% !important;
  }
}

.card-style {
  width: 100%;
  height: 100%;
  flex: 1;
  background: #ffffff;
  border: 1px solid #e7e8f2;
  box-shadow: 0px 10px 20px 0px rgba(0, 139, 207, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
</style>
<style lang="scss">
.table-wrap {
  min-height: calc(100vh - var(--headerHeight));
  padding: 27px 24px;
  display: flex;
  flex-direction: column;
}
.card-top {
  border-bottom: 1px solid #e7e8f2;
  padding: 18px 24px;
  color: #333333;
  font-weight: bold;
  line-height: 16px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.separator-class {
  background-color: #e7e8f2;
}
.card-content-wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
  .q-splitter {
    width: 100%;
  }
  .card-content-left {
    padding: 15px;
    height: 300px;
  }
  .q-splitter__after {
    display: flex;
    flex-direction: column;
  }
  .card-content-right {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
.card-filter-wrap {
  padding: 15px;
  .card-filter {
    width: 100%;
    background: #f7f8fa;
    border-radius: 4px;
    padding: 9px;
    display: flex;
    flex-wrap: wrap;
    > * {
      margin: 6px;
    }
  }
  .q-field {
    background-color: #ffffff;
    width: 180px;
  }
}
.card-table-wrap {
  padding: 0 15px 15px;
  color: #333333;
  flex: 1;
  display: flex;
  flex-direction: column;
  .card-table {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .q-table__card {
    box-shadow: none;
    flex: 1;
  }
  thead tr:first-child {
    background: #f7f8fa;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    th {
      border: none;
    }
  }
  tr {
    background-color: #fff;
  }
  tr:hover {
    background-color: rgba($color: #008bcf, $alpha: 0.02);
  }
  .btn-col {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    width: 120px;
  }
}
.right-sticky {
  th:last-child::after,
  td:last-child::after {
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
    position: absolute;
    top: 0;
    bottom: 0px;
    left: 0;
    width: 30px;
    transform: translateX(-100%);
    transition: box-shadow 0.3s;
    content: "";
    pointer-events: none;
    background-color: transparent;
  }

  th:last-child,
  td:last-child {
    position: sticky;
    right: 0;
    z-index: 1;
    background-color: #ffffff;
  }

  .btn-col {
    border-left: none;
  }
}
</style>
