<template>
    <div class="container">
        <div v-if="this.computers != null && this.computers.length > 0">
            <h4>Check Computers</h4>
            <br/>
            <ul class="list-group">
                <li class="list-group-item p-0" style="height: 30px; border: none;">
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Machine Name</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Room</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Desk</div>
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Mac Address</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">OS</div>
                    <div class="col-1 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Status</div>
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Last Seen</div>
                    <div class="col-2 status-grid-text float-left black-border bg-dark row-title" style="height: 100% !important;">Options</div>
                </li>
            </ul>
            <div class="scrollable-div-500">
                <ComputerDetails v-for="computer in this.computers" :key="computer.id" :computer="computer"></ComputerDetails>
            </div>
        </div>
        <br/>
        <br/>
    </div>
</template>

<script>
    import ComputerDetails from './ComputerDetails.vue'
    export default {
        data() {
            return {
            }
        },
        components: {
            ComputerDetails
        },
        props: {
            computers: {
                type: Array,
                required: true
            }
        },
        methods: {
        }
    }
</script>
