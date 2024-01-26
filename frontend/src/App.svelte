<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/adminLogin.svelte';
  import RouteAllocation from './page/allocateRoute.svelte';
  import Navbar from './page/navbar.svelte';
  import Mashroor from './page/mashroor.svelte';
  import BusStaffList from './page/busStaffList.svelte';
  import CreateRoute from './page/createRoute.svelte';
  import StaffProfile from './page/staffProfile.svelte';
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
    <!-- <Route path="/start" component={Navbar} /> -->
    <Route path="/mashroor" component={Mashroor} />
    <Route path="/navbar" component={Navbar} />
    <Route path="/busStaffList" component={BusStaffList} />
    <Route path="/createRoute" component={CreateRoute} />
    <Route path="/staffProfile" component={StaffProfile} />
    <Route path="/allocateRoute" component={RouteAllocation} />
  </Router>
</main>

