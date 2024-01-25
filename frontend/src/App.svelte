<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/adminLogin.svelte';
  import Navbar from './page/navbar.svelte';
  import Mashroor from './page/mashroor.svelte';
  import BusStaffList from './page/busStaffList.svelte';
  import CreateRoute from './page/createRoute.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    navigate('/login');
  });
</script>

<main>
  <Router>
    <Route path="/login" component={Login} />
    <Route path="/start" component={Navbar} />
    <Route path="/mashroor" component={Mashroor} />
    <Route path="/navbar" component={Navbar} />
    <Route path="/busStaffList" component={BusStaffList} />
    <Route path="/createRoute" component={CreateRoute} />
  </Router>
</main>

