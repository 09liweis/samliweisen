<template>
  <div class="form">
    <div style="display:flex;">
      <div style="width:50%;">
        <div v-for="(v,k) in visual" :key="k">
          <div>
            <span>{{k}}:</span>
            <img v-if="k=='poster'" :src="v"/>
            <span v-else>{{v}}</span>
            <a @click="editField(k)">Edit</a></div>
        </div>
      </div>
      <div class="input-form" style="width:50%;">
        <div class="input-form-group">
          <label>{{currentField}}</label>
          <input v-model="currentVal"/>
          <a @click="updateField(currentField)">Update</a>
        </div>
        <div v-if="currentField == 'release_date'">
          <div v-for="d in release_dates" :key="d" @click="currentVal = d.substring(0, 10)">{{d}}</div>
        </div>
        <div style="display:flex;" v-if="currentField == 'poster' && posters.length > 0">
          <img style="width:33%;" v-for="p in posters" :key="p" :src="p" @click="currentVal=p"/>
        </div>
        <div v-if="loading">Loading</div>
        <button v-on:click="handleSubmit">Submit</button>
      </div>
    </div>
    <!-- <mu-raised-button label="Add Image" class="demo-raised-button" primary v-on:click="gotoAddImage()" /> -->
    
    <!-- <div class="songs">
      <mu-raised-button label="Add Song" class="demo-raised-button" primary v-on:click="gotoAddSong()" />
      <mu-list>
        <mu-list-item v-for="s in songs" v-bind:title="s.title" :key="s.id" v-on:click="editSong(s)">
          <mu-avatar v-bind:src="s.image" slot="rightAvatar"/>
        </mu-list-item>
      </mu-list>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentField:'douban_id',
      currentVal:'',
      loading:false,
      posters: [],
      searchOpen: false,
      searchs: [],
      visual: {
        id: 0,
        title: '',
        original_title: '',
        douban_id: '',
        douban_rating: '0.0',
        imdb_id: '',
        imdb_rating: '0.0',
        rotten_id: '',
        rotten_rating: 0,
        rotten_audience_rating: 0,
        release_date: '',
        poster: '',
        summary: '',
        online_source: '',
        episodes: 1,
        current_episode: 0,
        visual_type: 'movie',
        website: '',
        languages:[],
        countries:[],
        duration:0,
      },
      release_dates: [],
      songs: []
    };
  },
  mounted() {
    const id = this.$route.params.id;
    if (typeof id != 'undefined') {
      this.getVisual(id);
      this.getSongs(id);
    }
  },
  methods: {
    editField(k){
      this.currentField = k;
      this.currentVal = this.visual[k];
    },
    updateField(k) {
      this.visual[k] = this.currentVal;
      if (k == 'douban_id') {
        this.renderDouban();
      }
    },
    // toggleSearch() {
    // 	this.searchOpen = !this.searchOpen;
    // },
    gotoAddSong() {
      this.$router.push({path: '/' + this.$route.params.id + '/song/add'});
    },
    // gotoAddImage() {
    // 	this.$router.push({path: '/' + this.$route.params.id + '/image/add'});
    // },
    renderFromSearch(id) {
      this.toggleSearch();
      this.visual.douban_id = id;
      this.renderDouban();
    },
    handleSubmit() {
      const options = this.visual;
      this.$http.post(this.$store.state.api.visualSubmit, options).then(res => {
        if (res.status == 200) {
          if (res.body.code == 'exist') {
            alert('Douban Id exist');
          } else {
            this.$router.push({ path: '/' });
          }
        }
      });
    },
    getVisual(id) {
      this.$http.get(this.$store.state.api.visualDetail + id).then(res => {
        this.visual = res.body.result;
        if (this.visual.douban_id) {
          this.renderDouban();
        }
      });
    },
    // searchDouban(e) {
    // 	const val = e.target.value;
    // 	const api = '/api/visuals/search?keyword=' + val;
    // 	// 'https://api.douban.com/v2/movie/search?q=' + val + '&apikey=0df993c66c0c636e29ecbb5344252a4a'
    // 	this.$http.get(api).then(res => {
    // 		this.searchs = [];
    // 		if (res.status == 200) {
    // 			console.log(res.body);
    // 			this.searchs = res.body;
    // 		}
    // 	});
    // },
    renderDouban() {
      const {douban_id} = this.visual;
      if (douban_id == '') {
        alert('Empty douban id');
        return;
      }
      var api = '/api/visuals/summary';
      this.loading = true;
      this.$http.post(api,{douban_id}).then(res => {
        const douban = res.body;
        this.loading = false;
        for (const [key, value] of Object.entries(this.visual)) {
          if (douban[key]) {
            this.visual[key] = douban[key];
          }
        }
        if (douban.episodes > 1) {
          this.visual.visual_type = 'tv';
        }
        this.release_dates = douban.release_dates;
        this.renderIMDB();
      }, res => {
        //error
      });
    },
    renderIMDB() {
      if (this.visual.imdb_id == '') return;
      const options = {
        params: {
          i: this.visual.imdb_id,
          apikey: '6ad10fa5'
        }
      };
      this.$http.jsonp('https://www.omdbapi.com/', options).then(res => {
        if (res.body.Response != 'False') {
          if (res.body.Ratings[1] && res.body.Ratings[1].Source == 'Rotten Tomatoes') {
            this.visual.rotten_rating = res.body.Ratings[1].Value.replace('%', '');   
          }
          this.posters.push(res.body.Poster);
        }
      });
    },
    getSongs(visual_id) {
      this.$http.get(this.$store.state.api.songList + '?visual_id=' + visual_id).then((res) => {
        if (res.status == 200) {
          this.songs = res.body.results;
        }
      });
    },
    editSong(s) {
      let visual_id = this.$route.params.id;
      this.$router.push({ path: '/song/' + s.id + '/edit' });
    }
  }
};
</script>
<style scope>
.form-poster {
  width: 50%;
}
</style>