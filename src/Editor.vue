<!-- 
	ref. https://serversideup.net/uploading-files-vuejs-axios/
	ref. https://serversideup.net/preview-file-uploads-with-axios-and-vuejs/
span-->
<template>
	<div id="root">
		<!-- ( -->
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

			<!-- ( -->
			<div id="editor-head">
				<input type="text" id="title" placeholder="이 곳에 제목을 입력해주세요." autocomplete="off">
				
				<div style="height: 50px;"></div>
				<hr>
				<div style="height: 30px;"></div>

				<div id="editor-menu">
					<div id="add-img" class="editor-menu-item">
						<input type="file" id="files" ref="files" accept="image/*" multiple @change="handleFilesUpload()"/>
						<span @click="addFiles()">+ 이미지 추가</span>
					</div>
					<div class="editor-menu-item" v-if="!isSecret" @click="toggleSecret">전체공개</div>
					<div class="editor-menu-item" v-if="isSecret"  @click="toggleSecret"><b>비공개</b></div>
					<div class="editor-menu-item">바인더선택</div>
					<div class="editor-menu-item">저작권 라이센스</div>
				</div>

				<div style="height: 30px;"></div>
			</div> 
			<!-- ) -->
		</div>
		<!-- ) -->
		<!-- ( -->
		<div class="bottom-container">
			<!-- ( -->
			<div id="editor-bottom">
				<div id="previews">
					
					<div v-for="(file, key) in files" class="file-listing">
						<!-- ( -->
						<div class="preview-container">
							<img class="preview selected" v-if="main_img_idx == key" v-bind:ref="'image' + parseInt( key )" @click="select(key)"/>
							<img class="preview" v-if="main_img_idx != key" v-bind:ref="'image' + parseInt( key )" @click="select(key)"/>
							<i class="fas fa-arrow-circle-up mv mvUp" @click="mvUp(key)"></i>
							<i class="fas fa-arrow-circle-down mv mvDown" @click="mvDown(key)"></i>
							<i class="fas fa-times-circle remove" @click="removeFile(key)"></i>
						</div>
						<!-- ) -->
						<div style="color:gray; cursor:pointer;">
							캡션(미완성): {{ captions[key] }}
							<input type="text" v-model="captions[key]"/>
						</div>
						<div style="height: 10px"></div>
					</div>	
				</div>

				<div style="height: 20px"></div>

				<textarea placeholder="이 곳에 내용을 입력해 주세요."></textarea>

				<button id="submit" @click="submitFiles()">Finish</button>

				<div style="height: 50px;"></div>
			</div> 
			<!-- ) -->
		</div>
		<!-- ) -->
	</div>
</template>
<script>
export default {
  data () {
    return {
			isSecret: false,
			files: [],
			captions: [],
			main_img_idx: 0,
			EMPTY: "[##CAPTION##EMPTY##]",
    }
  },
  components: {
  },
  methods: {
		toggleSecret() {
			this.isSecret = !this.isSecret;
		},
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
			
			console.log("remove Result");
			console.log(this.files);
			console.log(this.captions);

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
		background: white;	
		position: relative;	
	}
	.bottom-container {
		background: rgb(253,253,253);	
		position: relative;	
	}

	span.remove-file {
		color: red;	
		cursor: pointer;
		font-weight: bold;
	}
	div.file-listing img{
		width: 95%;
		cursor: pointer;
	}
	input[type=file]{
		position: absolute;
		opacity: 0;
		top: -1000px;
	}
	#submit {
		font-size: 1.5em;	
		width: 100%;
    background-color: transparent; /* Green */
    border: 1px solid rgb(103,179,177);
		color: rgb(103,179,177);
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
		cursor: pointer;
	}
	.selected {
    border: 7px solid rgb(103,179,177);
	}

	.mv {
		font-size: 2.5em;
		cursor: pointer;
    color: rgb(103,179,177);
	}
	.mvUp {
		position: absolute;
		top: 100px;
		left: -70px;
	}
	.mvDown {
		position: absolute;
		bottom: 100px;
		left: -70px;
	}
	.remove {
		position: absolute;
		top: 20px;
		right: 70px;
		font-size: 2.5em;
		cursor: pointer;
    color: white; 
	}

	.preview-container {
		position: relative;	
	}

	#title {
		background: transparent;
		border: none;
		font-size: 2em;
		width: 800px;
	}
	#editor-head {
		width: 60%;
		margin: auto;
		background: white;
	}

	#editor-bottom{
		width: 60%;
		margin: auto;
		background: rgb(253,253,253);
	}

	hr {
		display: block;
		height: 1px;
		border: 0;
		border-top: 1px solid #ccc;
		margin: 1em 0;
		padding: 0; 
	}

	textarea {
		width: 90%;	
		border: none;
		font-size: 1.1em;
		min-height: 300px;
		resize: none;
		background: rgb(253,253,253);
	}

	textarea:focus, input:focus {
		outline-width: 0;	
	}

	#editor-menu {
		width: 100%;
		height: 50px;
	}
	.editor-menu-item {
		display: inline-block;
		width: 24%;	
		text-align: center;
		color: rgb(150,150,150);
		cursor: pointer;
	}
	#add-img {
		color: rgb(103,179,177);
	}
	::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		color: rgb(150,150,150);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder { /* Internet Explorer 10-11 */
		color: rgb(150,150,150);
	}

	::-ms-input-placeholder { /* Microsoft Edge */
		color: rgb(150,150,150);
	}
</style>
