<template>
  <div class="apply-detail app-container">
    <el-descriptions size="medium">
      <el-descriptions-item label="企业名称">{{ applyData.name }}</el-descriptions-item>
      <el-descriptions-item label="企业代码类型">{{ codeTypes[applyData.code_type] }}</el-descriptions-item>
      <el-descriptions-item label="企业代码">{{ applyData.code }}</el-descriptions-item>
      <el-descriptions-item label="法人姓名">{{ applyData.legal_persona_name }}</el-descriptions-item>
      <el-descriptions-item label="法人微信号">{{ applyData.legal_persona_wechat }}</el-descriptions-item>
      <el-descriptions-item label="提交时间">{{ parseTime(applyData.apply_time) }}</el-descriptions-item>
      <!-- <el-descriptions-item label="完结时间">{{ applyData.end_time }}</el-descriptions-item> -->
    </el-descriptions>
    <div class="apply-status">申请状态</div>
    <el-steps finish-status="success" process-status="wait" :active="status" align-center>
      <el-step :title="item.title" v-for="(item, index) in steps" :key="index"></el-step>
    </el-steps>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getApply } from '@/api/applys'
import { parseTime } from '@/utils/index'
import { IApply } from '@/api/types'
@Component({
  name: 'ApplyDetail'
})
export default class extends Vue {
  private codeTypes = {
    1: '统一社会信用代码',
    2: '组织机构代码',
    3: '营业执照注册号'
  }

  private steps = [
    {
      title: '退回',
      description: '这是一段很长很长'
    },
    {
      title: '待审核',
      description: '这是一段很长很长很长的描述性文字'
    },
    {
      title: '待提交微信',
      description: '这是一段很长很长很长的描述性文字'
    },
    {
      title: '微信审核中',
      description: '这是一段很长很长很长的描述性文字'
    }
    // {
    //   title: '完结',
    //   description: '这是一段很长很长很长的描述性文字'
    // }
  ]

  private applyData: IApply = {
    apply_id: 0,
    name: '',
    code_type: -1,
    code: '',
    legal_persona_wechat: '',
    legal_persona_name: '',
    submit_time: new Date(),
    end_time: new Date(),
    status: -1
  }

  get status() {
    // const status = this.applyData.status
    // if (status === 3) {
    //   this.steps.splice(3 + 1, 1)
    // } else if (status === 4) {
    //   this.steps.splice(4 - 1, 1)
    // }
    // return status + 1
    return this.applyData.status + 1
  }

  parseTime(time?: object | string | number | null) {
    return parseTime(time)
  }

  created() {
    this.getApply()
  }

  async getApply() {
    const id = this.$route.params.id
    try {
      const res = (await getApply(id)) as any
      if (res.code === 20000) {
        this.applyData = res.data
      }
    } catch (error) {}
  }
}
</script>
<style lang="scss" scoped>
.apply-status {
  padding: 30px 0;
  text-align: center;
}
</style>
