<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import Login from './page/adminLogin.svelte';
  import Start from './page/start.svelte';
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
    <Route path="/createRoute" component={CreateRoute} />
  </Router>
</main>

