<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/AdminPages/adminLogin.svelte';
  import upcomingTrips from './page/TripPages/upcomingTrips.svelte';
  import pastTrips from './page/TripPages/pastTrips.svelte';
  import Navbar from './page/GlobalComponents/navbar.svelte';
  import busAdd from './page/BusPages/busAdd.svelte';
  import BusStaffList from './page/BusStaffPages/busStaffList.svelte';
  import StaffProfile from './page/BusStaffPages/staffProfile.svelte';
  import EditStaff from './page/BusStaffPages/editStaff.svelte';
  import CreateRoute from './page/RoutePages/createRoute.svelte';
  import AddStudent from './page/userPages/addStudent.svelte';
  import AddStaff from './page/BusStaffPages/addStaff.svelte';
  import ScheduleTrip from './page/TripPages/scheduleTrip.svelte';
  import BusList from './page/BusPages/busList.svelte';
  import EditBus from './page/BusPages/editBus.svelte';
  import BusDetails from './page/BusPages/busDetails.svelte';
  import RouteList from './page/RoutePages/routeList.svelte';
  import AdminProfile from './page/AdminPages/adminProfile.svelte';
  import TripDetails from './page/TripPages/tripDetails.svelte';
  import ShowLive from './page/LiveTracking/showLive.svelte';
  import LiveTrack from './page/LiveTracking/liveTracking.svelte';
  import FeedbackList from './page/FeedBackPages/feedbackList.svelte';
  import FeedbackStudent from './page/FeedBackPages/feedbackStudent.svelte';
  import FeedbackTeacher from './page/FeedBackPages/feedbackTeacher.svelte';
  import UserList from './page/userPages/userList.svelte';
  import RequisitionList from './page/userPages/requisitionList.svelte';
  import Notifications from './page/Notifications/notifications.svelte';
  import Requisition from './page/userPages/requisition.svelte';
  import RouteDetails from './page/RoutePages/routeDetails.svelte';



  import { onMount } from 'svelte';
  import { isAuthenticated, checkSession } from './auth';

  onMount(async () => {
    const initialIsAuthenticated = await checkSession();
    isAuthenticated.set(initialIsAuthenticated);

    const requestedRoute = window.location.pathname;
    console.log('Requested route:', requestedRoute);
    const isAuthenticatedValue = $isAuthenticated;
    console.log('isAuthenticatedValue:', isAuthenticatedValue);

    if (isAuthenticatedValue) {
      navigate(requestedRoute);
    } else {
      navigate('/login');
    }
        }
    );
</script>

<main>
  <Router>
    <Route path="/login" component={Login} />
    <Route path="/start" component={Navbar} />
    <Route path="/navbar" component={Navbar} />
    <Route path="/busStaffList" component={BusStaffList} />
    <Route path="/createRoute" component={CreateRoute} />
    <Route path="/staffProfile" component={StaffProfile} />
    <Route path="/addStaff" component={AddStaff} />
    <Route path="/editStaff" component={EditStaff} />
    <Route path="/scheduleTrip" component={ScheduleTrip} />
    <Route path="/busList" component={BusList} />
    <Route path="/editBus" component={EditBus} />
    <Route path="/busDetails" component={BusDetails} />
    <Route path="/upcomingTrips" component={upcomingTrips}/>
    <Route path="/pastTrips" component={pastTrips}/>
    <Route path="/busAdd" component={busAdd} />
    <Route path="/routeList" component={RouteList} />
    <Route path="/profile" component={AdminProfile} />
    <Route path="/showLive" component={ShowLive} />
    <Route path="/tripDetails" component={TripDetails} />
    <Route path="/liveTrack" component={LiveTrack} />
    <Route path="/addStudent" component={AddStudent} />
    <Route path="/feedbackList" component={FeedbackList} />
    <Route path="/feedbackStudent" component={FeedbackStudent} />
    <Route path="/feedbackTeacher" component={FeedbackTeacher} />
    <Route path="/userList" component={UserList} />
    <Route path="/requisitionList" component={RequisitionList} />
    <Route path="/notifications" component={Notifications} />
    <Route path="/requisition" component={Requisition} />
    <Route path="/routeDetails" component={RouteDetails} />
  </Router>

</main>

