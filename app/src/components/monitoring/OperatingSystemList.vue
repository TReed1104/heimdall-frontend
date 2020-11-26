<template>
    <div id="page-content" class="container">
        <h1 class="page-title">Operating System List</h1>
        <br/>
        <div v-if="this.computers != null && this.computers.length > 0">
            <h4>Check Computers</h4>
            <br/>
            <ul class="list-group">
                <li class="list-group-item p-0" style="height: 30px; border: none;">
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Machine Name</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Room</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Desk</div>
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Mac Address</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">IP</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">OS</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">OS Release</div>
                    <div class="col-3 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">OS Build</div>
                </li>
            </ul>
            <div class="scrollable-div-500">
                <li v-for="computer in this.computers" :key="computer.id" class="list-group-item p-0" style="height: 50px; border: none;">
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">{{ computer.machine_name }}</div>
                    <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ computer.room }}</div>
                    <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ computer.desk }}</div>
                    <div class="col-2 status-grid-text float-left black-border text-uppercase" style="height: 100% !important;">{{ computer.mac_address }}</div>
                    <div class="col-1 status-grid-text float-left black-border text-uppercase" style="height: 100% !important;">{{ computer.ip_address }}</div>
                    <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ computer.os_name }}</div>
                    <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ computer.os_release }}</div>
                    <div class="col-3 status-grid-text float-left black-border" style="height: 100% !important;">{{ computer.os_build }}</div>
                </li>
            </div>
        </div>
        <div v-else>
            <h2>{{ DefaultPageText }}</h2>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { setInterval, clearInterval } from 'timers-browserify';
    export default {
        data() {
            return {
                loading: true,
                computers: null,
                timer: ''
            }
        },
        computed: {
            DefaultPageText(){
                if (this.loading) {
                    return "Loading...";
                }
                else {
                    return "No Computers found";
                }
            }
        },
        methods: {
            GetOperatingSystems() {
                axios.get(this.$store.getters.heimdallServerAddress + "/computers?detailed_response=true").then(response => {
                    this.computers = response.data.data.computers;
                    this.loading = false;
                }).catch(error => {
                    console.log(error);
                    this.computers = null;
                    this.loading = false;
                });
            }
        },
        mounted() {
            this.GetOperatingSystems();
            this.timer = setInterval(this.GetOperatingSystems, 30000);
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>
