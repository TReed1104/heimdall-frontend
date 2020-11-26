import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Monitoring from '../components/monitoring/Monitoring.vue'
import PCAvailability from '../components/availability/PCAvailability.vue'
import RoomsList from '../components/management/RoomsList.vue'
import RoomCreate from '../components/management/RoomCreate.vue'
import RoomView from '../components/management/RoomView.vue'
import RoomEdit from '../components/management/RoomEdit.vue'
import DesksList from '../components/management/DesksList.vue'
import DeskCreate from '../components/management/DeskCreate.vue'
import DeskView from '../components/management/DeskView.vue'
import DeskEdit from '../components/management/DeskEdit.vue'
import ComputerView from '../components/management/ComputerView.vue'
import ComputerEdit from '../components/management/ComputerEdit.vue'
import OperatingSystemList from '../components/monitoring/OperatingSystemList.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/app/monitoring',
            name: 'Monitoring',
            component: Monitoring
        },
        {
            path: '/app/availability/:room',
            name: 'PC Availability',
            component: PCAvailability
        },
        {
            path: '/admin/rooms',
            name: 'Rooms List',
            component: RoomsList
        },
        {
            path: '/admin/desks/:id?',
            name: 'Desks List',
            component: DesksList
        },
        {
            path: '/admin/room/:id?',
            name: 'Room View',
            component: RoomView
        },
        {
            path: '/admin/desk/:id?',
            name: 'Desk View',
            component: DeskView
        },
        {
            path: '/admin/computer/:id?',
            name: 'Computer View',
            component: ComputerView
        },
        {
            path: '/admin/create/room',
            name: 'Room Create',
            component: RoomCreate
        },
        {
            path: '/admin/create/desk',
            name: 'Desk Create',
            component: DeskCreate
        },
        {
            path: '/admin/edit/room/:id?',
            name: 'Room Edit',
            component: RoomEdit
        },
        {
            path: '/admin/edit/desk/:id?',
            name: 'Desk Edit',
            component: DeskEdit
        },
        {
            path: '/admin/edit/computer/:id?',
            name: 'Computer Edit',
            component: ComputerEdit
        },
        {
            path: '/app/monitoring/os',
            name: 'Operating System List',
            component: OperatingSystemList
        }
    ]
})