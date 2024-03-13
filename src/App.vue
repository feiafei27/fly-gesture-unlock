<template>
  <div class="main">
    <div class="header">
      <div>
        高频功能：
        <el-button-group>
          <el-button @click="gotoPage('/')" type="primary">
            设置
          </el-button>
          <el-button @click="gotoPage('/verification')" type="primary">
            校验
          </el-button>
          <el-button @click="gotoPage('/modify')" type="primary">
            修改
          </el-button>
        </el-button-group>
      </div>
      <div>
        个性化配置：
        <el-button-group>
          <el-button @click="gotoPage('/arbitraryNum')" type="primary">
            任意数量
          </el-button>
          <el-button @click="gotoPage('/arbitraryLocationSize')" type="primary">
            任意位置、大小
          </el-button>
          <el-button @click="gotoPage('/repeatSelect')" type="primary">
            重复选择
          </el-button>
          <el-button @click="gotoPage('/lineAutoSelect')" type="primary">
            线段自动选中
          </el-button>
        </el-button-group>
      </div>
      <div>
        样式配置：
        <el-button-group>
          <el-button @click="gotoPage('/extraStatus')" type="primary">
            任意额外状态
          </el-button>
          <el-button @click="gotoPage('/customStyle')" type="primary">
            样式高度自定义
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter();

const gotoPage = (path: string) => {
  router.push(path);
}
</script>

<style scoped lang="less">
.main {
  height: 100vh;

  display: flex;
  flex-direction: column;
  background-color: #e5e5e5;
  .header {
    height: 130px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > div {
      margin-top: 5px;
    }
  }

  .body {
    flex: 1;
  }
}
</style>
