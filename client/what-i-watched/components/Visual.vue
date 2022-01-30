<template>
  <div class="visual">
    <div class="tablet">
      <img class="visual__poster" :src="'https://images.weserv.nl/?url='+v.poster" referrerpolicy ="never" />
    </div>
    <div class="visual__col title">
      <h3 class="visual__title">{{v.title}} <a v-if="v.website" :href="getWebsite(v.website)" target="_blank">Website</a></h3>
      <h3 class="visual__title" v-if="v.title != v.original_title">{{v.original_title}}</h3>
    </div>
    <div class="desktop">
      <div>{{v.countries.join(',')}}</div>
      <div>{{v.languages.join(',')}}</div>
      <span>{{v.release_date}}</span>
      <div v-if="v.duration">{{v.duration}} mins</div>
    </div>
    <div class="visual__col progress">
      <div class="visual__ratings">
        <a class="visual__rating link" v-bind:href="getLink(v.douban_id, 'douban')" target="_blank">
          <img class="visual__rating icon" src="https://img3.doubanio.com/f/talion/2f3c0bc0f35b031d4535fd993ae3936f4e40e6c8/pics/icon/dou32.png" alt="douban icon" />
          <span class="visual__rating">{{v.douban_rating}}</span>
        </a>
        <a class="visual__rating link" v-if="v.imdb_id" v-bind:href="getLink(v.imdb_id, 'imdb')" target="_blank">
          <span class="visual__rating icon imdb">IMDB</span>
          <span class="visual__rating">{{v.imdb_rating}}</span>
        </a>
        <a v-if="v.rotten_rating">
          <img class="visual__rating icon" src="https://vignette.wikia.nocookie.net/greatest-movies/images/1/16/Rotten_Tomatoes_fresh_rating_icon.png/revision/latest?cb=20170918174417" alt="Rotten Tomatoes Icon" />
          <span class="visual__rating">{{v.rotten_rating}}</span>
        </a>
      </div>
      <span class="visual__progress-episodes">{{v.current_episode}} / {{v.episodes}}</span>
      <div class="visual__progress">
        <mu-linear-progress mode="determinate" :value="(v.current_episode/v.episodes) * 100"/>
      </div>
    </div>
    <div class="visual__col actions">
      <div class="visual__action">
        <router-link class="visual__increaseepisode" :to="{ name: 'edit', params: { id: v.id }}">Edit</router-link>
        <a class="visual__increaseepisode" v-if="v.episodes != v.current_episode" v-on:click="increaseEpisode(v)">+1 ep</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['v', 'getVisuals'],
  data() {
    return {
    };
  },
  methods: {
    increaseEpisode(v) {
      this.$http.get(this.$store.state.api.increaseEpisode + '?id=' + v.id).then(res => {
        v.current_episode = res.body.current_episode;
        this.getVisuals();
      });
    },
    getLink(id, type) {
      if (type == 'douban') {
        return 'https://movie.douban.com/subject/' + id;
      }
      if (type == 'imdb') {
        return 'https://www.imdb.com/title/' + id;
      }
    },
    getWebsite(website) {
      if (website.indexOf('http') == -1) {
        return 'http://' + website;
      }
      return website;
    }
  }
};
</script>
<style>
.visual {
  border-top: 1px solid #bfbaba;
  display: flex;
}
.visual > div {
  flex:1;
  padding: 10px;
  transition: 0.3s;
}
.visual__poster {
  border-radius: 4px;
  width: 100px;
}
.visual__title {
  margin: 0;
  text-align: left;
  font-family: 'ZCOOL KuaiLe';
  font-weight: lighter;
}
.visual__rating {
  display: inline-block;
  vertical-align: middle;
}
.visual__rating.link {
  margin-right: 5px;
}
.visual__rating.icon {
  width: 20px;
  height: 20px;
}
.visual__rating.icon.imdb {
  width:auto;
  height:auto;
  background-color:#f5c518;
  color:#000;
  padding:1px;
  margin-right:2px;
}
.visual__progress-episodes {
  color: #000000;
}
.mu-linear-progress-determinate {
  background: #57c263;
}
.visual__increaseepisode {
  cursor: pointer;
  border: 1px solid pink;
  padding: 5px;
  border-radius: 5px;
  transition: 0.3s;
}
.visual__increaseepisode:hover {
  color: #fff;
  background-color: pink;
}
</style>