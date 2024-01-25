<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/adminLogin.svelte';
  import Start from './page/start.svelte';
  import Mashroor from './page/mashroor.svelte';
  import BusStaffList from './page/busStaffList.svelte';
  import Start from './page/navbar.svelte';
  import CreateRoute from './page/createRoute.svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    navigate('/start');
  });
</script>

<main>
  <Router>
    <Route path="/login" component={Login} />
    <Route path="/start" component={Start} />
    <Route path="/mashroor" component={Mashroor} />
    <Route path="/busStaffList" component={BusStaffList} />
    <Route path="/createRoute" component={CreateRoute} />
  </Router>
</main>

