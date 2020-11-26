<template>
    <li class="list-group-item p-0" style="height: 50px; border: none;">
        <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">{{ this.computer.machine_name }}</div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ this.computer.room }}</div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ this.computer.desk }}</div>
        <div class="col-2 status-grid-text float-left black-border text-uppercase" style="height: 100% !important;">{{ this.computer.mac_address }}</div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">{{ this.computer.os_name }}</div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;" v-bind:class="statusColouring">{{ this.computer.status }}</div>
        <div class="col-2 status-grid-text float-left black-border" style="height: 100% !important;">{{ this.computer.updated_at }}</div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">
            <router-link :to="{name: 'Computer View', params: {id: this.computer.id}}" tag="button" class="btn-sm btn-dark" push>View</router-link>
        </div>
        <div class="col-1 status-grid-text float-left black-border" style="height: 100% !important;">
            <router-link :to="{name: 'Computer Edit', params: {id: this.computer.id}}" tag="button" class="btn-sm btn-dark" push>Edit</router-link>
        </div>
    </li>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            computer: {
                type: Object,
                required: true
            }
        },
        computed: {
            statusColouring(){
                if (this.computer.status == "On") {
                    return 'pc-status-on'
                }
                else if (this.computer.status == "Asleep") {
                    return 'pc-status-asleep'
                }
                else if (this.computer.status == "Off") {
                    return 'pc-status-off'
                }
                else if (this.computer.status == "Check PC") {
                    return 'pc-status-check'
                }
            }
        }
    }
</script>
