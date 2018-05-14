<!-- 
	ref. https://serversideup.net/uploading-files-vuejs-axios/
	ref. https://serversideup.net/preview-file-uploads-with-axios-and-vuejs/
-->
<template>
	<div class="container">
		<label>File
			<input type="file" id="files" ref="files" multiple @change="handleFilesUpload()"/>
		</label>
		<button @click="submitFiles()">Submit</button>
	</div>
</template>
<script>
export default {
  data () {
    return {
			files: ''
    }
  },
  components: {
  },
  methods: {
		handleFilesUpload() {
			//this.file = this.$refs.file.files[0];
			this.files = this.$refs.files.files;
		},
		submitFiles() {
			let formData = new FormData();
			
			for (let i = 0 ; i < this.files.length; i++ ){
				let file = this.files[i];	
				formData.append('photos', file);
			}

			this.$http.post('http://192.168.182.195:45454/multiple-files',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			).then(() => {
				console.log("Success!");
			})
			.catch(() => {
				console.log("Failure!");
			});
		}
  }
}
</script>
<style scoped>
<style>
