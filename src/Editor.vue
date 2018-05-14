<!-- 
	ref. https://serversideup.net/uploading-files-vuejs-axios/
	ref. https://serversideup.net/preview-file-uploads-with-axios-and-vuejs/
span-->
<template>
	<div class="container">
		<h1>업로드 기능 개편 테스트(개발중이어서 갑자기 안될 수도)</h1>
		<ul>
			<li>여러 이미지 업로드 (빠른 이어붙이기 가능)</li>
			<li>선택된 이미지 제거</li>
			<li>메인 이미지 선택 (이미지 클릭시 메인 이미지 선정)</li>
			<li>이미지 프리뷰</li>
			<li>정렬 기능</li>
			<li>캡션 기능</li>
		</ul>
		<h3 @click="check" style="cursor:pointer">→ 현재 목록 체크 (F12 console 로 확인)</h3>
		<h3>→ 업로드 확인하러 가기 (아직)</h3>

		<input type="file" id="files" ref="files" accept="image/*" multiple @change="handleFilesUpload()"/>
		<div style="height: 10px"></div>

		<button id="add-files" @click="addFiles()">사진 추가</button>

		<div style="height: 20px"></div>

		<div v-show="files.length > 0"><b>사진 목록</b></div>

		<div style="height: 20px"></div>

		<div id="preview-container">
			<div v-for="(file, key) in files" class="file-listing">
				<img class="preview selected" v-if="main_img_idx == key" v-bind:ref="'image' + parseInt( key )" @click="select(key)"/>
				<img class="preview" v-if="main_img_idx != key" v-bind:ref="'image' + parseInt( key )" @click="select(key)"/>
				<br>
				{{ file.name }} 
				<div style="color:gray; cursor:pointer;">
					캡션(미완성): {{ captions[key] }}
					<input type="text" v-model="captions[key]"/>
				</div>
				<span class="mv" @click="mvUp(key)"><b>위로!</b></span>
				<span class="mv" @click="mvDown(key)"><b>아래로!!</b></span>
				<span class="remove-file" @click="removeFile(key)">(제거)</span>
				<div style="height: 10px"></div>
			</div>	
		</div>

		<div style="height: 20px"></div>

		<button id="submit" @click="submitFiles()">업로드</button>
	</div>
</template>
<script>
export default {
  data () {
    return {
			files: [],
			captions: [],
			main_img_idx: 0,
			EMPTY: "[##CAPTION##EMPTY##]",
    }
  },
  components: {
  },
  methods: {
		init() {
			this.files =  [];
			this.captions = [];
			this.main_img_idx = 0;
		},
		handleFilesUpload() {
			let uploadedFiles = this.$refs.files.files;
			for (let i = 0 ; i < uploadedFiles.length; i++){
				this.files.push( uploadedFiles[i] );	
				if (this.captions.length < this.files.length)
					this.captions.push(this.EMPTY);
			}
			this.getImagePreviews();
		},
		getImagePreviews() {
			for (let i = 0 ; i < this.files.length; i ++) {
				if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name )) {
					let reader = new FileReader();	

					reader.addEventListener("load", function () {
						this.$refs['image' + parseInt(i)][0].src = reader.result;	
					}.bind(this), false);
					// bind the values of the local component through the '.bind(this)'

					// read in the file at the key in the array
					reader.readAsDataURL(this.files[i]);
				}	
			}	
		},
		submitFiles() {
			if (this.files.length == 0){
				alert('아무런 파일도 선택 안하셨어요');	
				return;
			}
			let formData = new FormData();
			
			for (let i = 0 ; i < this.files.length; i++ ){
				let file = this.files[i];	
				formData.append('photos', file);
			}

			this.$http.post('http://stdio.kr:45454/multiple-files',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			).then((res) => {
				alert(res.data);
				this.init();
				console.log("Success!");
			})
			.catch(() => {
				alert('에러, 서버가 안켜졌을 수도');
				console.log("Failure!");
			});
		},
		addFiles() {
			this.$refs.files.click();	
		},
		removeFile(key) {
			this.files.splice(key, 1);	
			this.captions.splice(key, 1);	
			this.getImagePreviews();
		},
		select(key) {
			alert('메인 이미지 변경');
			this.main_img_idx = key;	
		},
		check () {
			console.log("check", this.files);	
		},
		mvUp (key) {
			if (key == 0) return;
			let tmp = this.files[key - 1];
			this.files[key - 1] = this.files[key];
			this.files[key] = tmp;
			this.getImagePreviews();
		},
		mvDown(key) {
			if (key + 1 == this.files.length) return;
			let tmp = this.files[key + 1];
			this.files[key + 1] = this.files[key];
			this.files[key] = tmp;
			this.getImagePreviews();
		},
		fillCaption(key) {
			alert('캡션 작성 기능 추가중');	
		}
  }
}
</script>
<style scoped>
	.container {
		position: relative;	
	}
	span.remove-file {
		color: red;	
		cursor: pointer;
		font-weight: bold;
	}
	div.file-listing img{
		max-width: 30%;
		cursor: pointer;
	}
	input[type=file]{
		position: absolute;
		opacity: 0;
		top: -1000px;
	}
	#add-files {
		font-size: 2em;	
	}	
	#submit {
		font-size: 2em;	
	}
	.selected {
		border: 7px solid rgb(43,244,226);	
	}
	.mv {
		text-decoration: underline;	
		font-size: 1.5em;
		cursor: pointer;
		color: green;
	}
</style>
