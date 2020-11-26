<template>
    <div class="container">
        <button class="btn btn-dark w-25" type="button" data-toggle="collapse" :data-target="'#collapse_' + room.index" aria-expanded="false" :aria-controls="'collapse_' + room.index">
            {{ this.room.name }}
        </button>
        <div v-if="this.room.computers != null && this.room.computers.length > 0" class="collapse" :id="'collapse_' + room.index">
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
                <div class="scrollable-div-500">
                    <ComputerDetails v-for="computer in this.room.computers" :key="computer.id" :computer="computer"></ComputerDetails>
                </div>
            </ul>
        </div>
        <div v-else class="collapse" :id="'collapse_' + room.index">
            <br/>
            <h4>No Computers found</h4>
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
            room: {
                type: Object,
                required: true
            }
        },
        computed: {
        }
    }
</script>
