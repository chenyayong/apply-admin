<template>
  <div class="apply-edit">
    <el-form label-width="120px">
      <el-form-item label="企业名称">
        <el-input v-model="applyData.name"></el-input>
      </el-form-item>
      <el-form-item label="企业代码类型">
        <el-input v-model="applyData.code_type"></el-input>
      </el-form-item>
      <el-form-item label="企业代码">
        <el-input v-model="applyData.code"></el-input>
      </el-form-item>
      <el-form-item label="法人姓名">
        <el-input v-model="applyData.legal_persona_name"></el-input>
      </el-form-item>
      <el-form-item label="法人微信号">
        <el-input v-model="applyData.legal_persona_wechat"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex;justify-content: center;">
      <el-button type="primary" :loading="loading">编辑</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getApply } from '@/api/applys'
@Component({
  name: 'apply-edit'
})
export default class extends Vue {
  private loading = false

  private codeTypes = {
    1: '统一社会信用代码',
    2: '组织机构代码',
    3: '营业执照注册号'
  }

  private applyData = {
    name: '',
    code_type: '',
    code: '',
    legal_persona_name: '',
    legal_persona_wechat: ''
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

  created() {
    this.getApply()
  }
}
</script>

<style lang="scss" scoped>
.apply-edit {
  width: 400px;
  display: block;
  margin: 40px auto;
}
</style>
