<template>
  <div class="apply app-container">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input @change="nameChange" placeholder="请输入企业名称" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="企业代码">
        <el-input @change="codeChange" placeholder="请输入企业代码" v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <Table v-loading="loading" size="small" :data="tabelData" :current-page.sync="formData.page" :page-size.sync="formData.limit" :total="total" @change="paginationChange">
      <el-table-column prop="name" label="企业名称" align="center" width="150" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="code_type" label="企业代码类型" width="150" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ codeTypes[scope.row.code_type] }}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="企业代码" width="170" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="legal_persona_name" label="法人姓名" width="120" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="legal_persona_wechat" label="法人微信号" width="180" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="apply_time" label="提交时间" width="180" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.apply_time) }}
          <!-- <el-tag size="mini" :type="tagType[scope.row.status]">{{ status[scope.row.status] }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag size="mini" :type="tagType[scope.row.status]">{{ status[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="end_time" label="完结时间" width="180" align="center"> </el-table-column> -->
      <el-table-column label="操作" min-width="240px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleLook(scope)">查看</el-button>
          <el-button size="mini" @click="handleEdit(scope)" v-if="scope.row.status === 0">编辑</el-button>
          <el-button size="mini" @click="handleCheck(scope)" v-if="scope.row.status === 1">审核提交</el-button>
          <el-button size="mini" @click="handleBack(scope)" type="danger" v-if="scope.row.status === 1">退回</el-button>
          <!-- <el-button size="mini">编辑</el-button> -->
          <!-- <el-button size="mini" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
    </Table>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Table from '@/components/Table/index.vue'
import { getApplys, checkPass, sendBack } from '@/api/applys'
import { parseTime } from '@/utils/index'
import { IApply } from '@/api/types'
@Component({
  name: 'apply',
  components: {
    Table
  }
})
export default class extends Vue {
  private loading = false
  private tabelData = []
  private total = 0
  private codeTypes = {
    1: '统一社会信用代码',
    2: '组织机构代码',
    3: '营业执照注册号'
  }

  private status = {
    0: '退回',
    1: '待审核',
    2: '待提交微信',
    3: '微信审核中'
    // 0: '草稿',
    // 1: '申请',
    // 2: '提交微信',
    // 3: '退回',
    // 4: '完结'
  }

  private tagType = {
    0: 'danger',
    1: 'info',
    2: 'warning',
    3: 'success'
  }

  private formData = {
    name: '',
    code: '',
    page: 1,
    limit: 20
  }

  $EventBus: any

  async getApplys() {
    this.loading = true
    try {
      const res = await getApplys(this.formData)
      const data = res.data || {}
      this.tabelData = data.items || []
      this.total = data.total || 0
    } catch (error) {
      console.log('error', error)
    }
    this.loading = false
  }

  parseTime(time?: object | string | number | null) {
    return parseTime(time)
  }

  paginationChange() {
    this.getApplys()
  }

  nameChange() {
    this.formData.page = 1
    this.getApplys()
  }

  codeChange() {
    this.formData.page = 1
    this.getApplys()
  }

  async handleCheck(scope: { row: IApply }) {
    this.loading = true
    try {
      const res = (await checkPass(scope.row.apply_id)) as any
      if (res.code === 20000) {
        this.getApplys()
      }
    } catch (error) {
      console.log('error', error)
    }
    this.loading = false
  }

  async sendBack(scope: { row: IApply }, reason: string) {
    this.loading = true
    try {
      const res = (await sendBack({
        apply_id: scope.row.apply_id,
        reason: reason
      })) as any
      if (res.code === 20000) {
        this.getApplys()
      }
    } catch (error) {
      console.log('error', error)
    }
    this.loading = false
  }

  async handleBack(scope: { row: IApply }) {
    this.$prompt('退回原因', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\w+/,
      inputErrorMessage: '请输入请退回原因'
    }).then((res: any) => {
      this.sendBack(scope, res.value)
    })
  }

  handleLook(scope: { row: IApply }) {
    this.$router.push(`/apply/${scope.row.apply_id}`)
  }

  handleEdit(scope: { row: IApply }) {
    this.$router.push(`/apply/apply-edit/${scope.row.apply_id}`)
  }

  created() {
    // console.log('getApplys created')
    this.getApplys()
    // this.$EventBus.$on('updateApplyList', () => {
    //   console.log('updateApplyList')
    //   this.getApplys()
    // })
  }

  // destroyed() {
  //   console.log('getApplys destroyed')
  //   this.$EventBus.$off('updateApplyList')
  // }
}
</script>
