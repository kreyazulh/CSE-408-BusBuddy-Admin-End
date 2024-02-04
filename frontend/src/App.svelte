<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/adminLogin.svelte';
  import upcomingTrips from './page/upcomingTrips.svelte';
  import pastTrips from './page/pastTrips.svelte';
  import Navbar from './page/navbar.svelte';
  import busAdd from './page/busAdd.svelte';
  import BusStaffList from './page/BusStaffPages/busStaffList.svelte';
  import CreateRoute from './page/createRoute.svelte';
  import StaffProfile from './page/BusStaffPages/staffProfile.svelte';
  import AddStudent from './page/userPages/addStudent.svelte';
  import AddStaff from './page/BusStaffPages/addStaff.svelte';
  import ScheduleTrip from './page/scheduleTrip.svelte';
  import BusList from './page/busList.svelte';
  import RouteList from './page/routeList.svelte';
  import AdminProfile from './page/adminProfile.svelte';
  import TripDetails from './page/tripDetails.svelte';
  import ShowLive from './page/showLive.svelte';
  import LiveTrack from './page/liveTrack.svelte';
  import FeedbackList from './page/userPages/feedbackList.svelte';
  import FeedbackStudent from './page/userPages/feedbackStudent.svelte';


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
    <Route path="/scheduleTrip" component={ScheduleTrip} />
    <Route path="/busList" component={BusList} />
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
  </Router>

</main>

