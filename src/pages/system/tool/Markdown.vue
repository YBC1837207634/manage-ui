<template>
  <div>

    <mavon-editor ref="mdedit" v-model="ruleForm.content" style="height: 80vh" @save="save">
    </mavon-editor>


  </div>

</template>

<script>
export default {
    name: 'Markdown',
    data() {
        return {
            ruleForm: {
                content: ''
            }
        }
    },
    methods: {
      save() {
        console.log(this.ruleForm.content)
      }
    }

}
</script>

<style>

</style>