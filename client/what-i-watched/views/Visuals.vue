<template>
	<div>
		<h2>I have watched {{total}}</h2>
		<div class="filters">
		</div>
		<input v-model="searchText" />
		<button v-on:click="search()">Search</button>
		<div class="filters">
			<button v-on:click="filter()">Not Started</button>
		</div>
    <div class="table" v-if="resultVisuals.length > 0">
      <div class="table__head">
        <div class="table__headCol tablet">Poster</div>
        <div class="table__headCol">Title</div>
        <div class="table__headCol desktop">Country/Language/Release Date</div>
        <div class="table__headCol">Ratings/Progress</div>
        <div class="table__headCol">Actions</div>
      </div>
      <Visual v-for="v in resultVisuals" :key="v.id" v-bind:v="v" v-bind:getVisuals="getVisuals"></Visual>
    </div>
		<transition-group v-if="list.length > 0" name="visual" class="" appear>
		</transition-group>
		<div class="paginations" v-if="total != 0">
			<router-link class="pagination__link" v-bind:class="{ active: page == p }" v-for="p in totalPages" :key="p" :to="{ name: 'page', params: { pageId: p }}">{{p}}</router-link>
		</div>
	</div>
</template>
<script>
import Visual from '../components/Visual.vue';
export default {
	components: {
		Visual,
	},
	data() {
		return {
			searchText:'',
			limit: 20,
			page: 1,
			total: 0,
			totalPages: 0,
			list: [],
			filters: [],
			loading: true,
			admin: window.localStorage.getItem('admin') || false
		};
	},
	computed: {
		resultVisuals() {
			if (this.filters.length != 0) {
				return this.list.filter((v) => {
					if (this.filters.indexOf('not_start') != -1) {
						return v.current_episode == 0;
					} else {
						return this.filters.indexOf(v.visual_type) != -1;
					}
				});
			} else {
				return this.list;   
			}
		}
	},
	mounted() {
		const pageId = this.$route.params.pageId;
		if (typeof pageId != 'undefined') {
			this.page = pageId;
		} else {
			this.page = 1;
		}
		this.getVisuals(this.page);
	},
	watch:{
		$route (to, from){
			this.page = to.params.pageId;
			this.getVisuals(this.page);
		}
	},
	methods: {
		gotoAdmin() {
			window.localStorage.setItem('admin', true);
			this.admin = true;
		},
		getVisuals(page = 1) {
			this.page = page;
			const params = {
				page: this.page,
				limit: this.limit
			};
			this.$http.get(this.$store.state.api.visualList, {params}).then(res => {
				this.list = res.body.results;
				this.total = res.body.total;
				this.totalPages = Math.ceil(this.total/this.limit);
				this.loading = false;
			});
		},
		search() {
			this.$http.get('https://what-i-watched.herokuapp.com/api/search?keyword=' + this.searchText).then(res=>{
				if (res.ok) {
					this.list = res.body.results;
				}
			});
		},
		filter() {
			this.$http.get('https://what-i-watched.herokuapp.com/api/visuals?type=not_start').then(res=>{
				if (res.ok) {
					this.list = res.body.results;
				}
			});
		}
	}
};
</script>
<style>
.table {
	width: 100%;
	text-align: left;
	border-radius: 10px;
}
.table__head {
  display: flex;
}
.table__head .table__headCol {
	font-weight: bold;
  transition: 0.3s;
  padding: 5px;
  flex:1;
}
.table tbody tr {
	color: #808080;
}
.table tbody tr:nth-child(even) {
	background: #f5f5f5;
}
/* moving */
.visual-move {
	transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.visual-enter-active {
	transition: all 300ms ease-out;
	transform: translateX(3%);
}

/* disappearing */
.visual-leave-active {
	transition: all 200ms ease-in;
}

/* appear at / disappear to */
.visual-enter,
.visual-leave-to {
	opacity: 0;
	transform: translateX(-3%);
}
.pagination__link {
	display: inline-block;
	padding: 2px 5px;
	margin-right: 5px;
	border: 1px solid #ff4081;
	border-radius: 5px;
	cursor: pointer;
	transition: 0.3s;
	margin-bottom: 5px;
}
.pagination__link.active,.pagination__link:hover {
	background: #ff4081;
	color: #ffffff;
}
.tablet,
.desktop {
  display: none;
}
@media (min-width: 768px) {
  .tablet {
    display: block;
  }
}
@media (min-width:1024px) {
  .desktop {
    display: block;
  }
}
</style>