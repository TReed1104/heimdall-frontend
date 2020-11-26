<template>
    <div id="desk-view" class="container">
        <h1 class="page-title">Desk Details</h1>
        <div v-if="this.desk != null" id="view_form_wrapper">
            <h2>General</h2>
            <p>
                Name: {{ this.desk.name.toUpperCase() }}<br/>
                ID: {{ this.desk.id }} <br/>
                Room: {{ this.desk.room.toUpperCase() }} <br/>
                Number Of Computers: {{ this.desk.number_of_computers }}
            </p>
            <h2>Computers</h2>
            <ul class="list-group w-50">
                <li v-for="computer in this.desk.computers" :key="computer.id" class="list-group-item">
                    <div class="col- float-left">
                        <h5>{{ computer.machine_name }}</h5>
                    </div>
                    <div class="col- float-right">
                        <router-link :to="{name: 'Computer View', params: {id: computer.id}}" tag="button" class="btn btn-dark" push>View</router-link>
                        <router-link :to="{name: 'Computer Edit', params: {id: computer.id}}" tag="button" class="btn btn-dark" push>Edit</router-link>
                    </div>
                </li>
                <template v-if="this.desk.computers.length == 0">There are no computers assigned to this desk</template>
            </ul>
            <br/>
            <router-link :to="{name: 'Desk Edit', params: { id: this.desk.id }}" tag="button" class="btn btn-dark" push>Edit Desk</router-link>
            <router-link :to="{name: 'Desks List'}" tag="button" class="btn btn-dark" push>Back To Desk List</router-link>
        </div>
        <div v-else id="view_form_wrapper">
            <h2>{{ DefaultPageText }}</h2>
            <br/>
            <router-link :to="{name: 'Desks List'}" tag="button" class="btn btn-dark" push>Back To Desk List</router-link>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                desk: null,
                loading: true,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    let deskID = undefined;
                    if (Object.keys(this.$route.params).length != 0) {
                        deskID = this.$route.params.id;
                    }
                    if (deskID == undefined) {
                        return "No Desk Selected";
                    }
                    if (this.desk == null) {
                        return "Desk not found";
                    }
                }
            }
        },
        methods: {
            GetDeskDetails() {
                this.loading = true;
                // Get the computer ID from the vue-router param
                let deskID = undefined;
                if (Object.keys(this.$route.params).length != 0) {
                    deskID = this.$route.params.id;
                }
                // Check the computer ID param was supplied
                if (deskID == undefined) {
                    this.desk = null;
                    this.loading = false;
                    return;
                }
                // Get the computer details from the Heimdall API
                axios.get(this.$store.getters.heimdallServerAddress + "/desk_handler?id=" + deskID).then(response => {
                    this.desk = response.data.data.desk;
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.desk = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetDeskDetails();
            this.timer = setInterval(this.GetDeskDetails, 15000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>
