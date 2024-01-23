<script>
  import '.././app.css';

  import { navigate } from 'svelte-routing';

  function handleGetStartedClick() {
     navigate('/login');
   }
</script>

<main>
    <div class="desktop-1">
      <img class="desktop-1-child" alt="" src="rectangle-1@2x.png" />

      <main class="frame">
        <section class="frame1">
          <h1 class="welcome-to-busbuddy">Welcome to BusBuddy</h1>
        </section>
        <section class="frame2">
          <main class="frame3">
            <section class="frame-child"></section>
            <div class="frame4">
              <img
                class="logowh-1-icon"
                alt=""
                src="logowh-1@2x.png"
              />
            </div>
          </main>
          <div class="frame5">
            <div class="frame6">
                <button class="get-started" on:click={handleGetStartedClick} id="getStarted">
                    GET STARTED
                  </button>
            </div>
          </div>
        </section>
      </main>
    </div>
</main>

<style>
  .desktop-1-child {
  position: relative;
  width: 1440px;
  height: 800px;
  object-fit: cover;
}
.welcome-to-busbuddy {
  margin: 0;
  position: relative;
  font-size: inherit;
  font-weight: 800;
  font-family: inherit;
}
.frame1 {
  width: 1138px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: center;
  font-size: 96px;
  color: #ecf8cc;
  font-family: var(--font-inter);
}
.frame-child {
  position: absolute;
  top: 233px;
  left: 0;
  background-color: #781b1b;
  width: 1440px;
  height: 542px;
}
.frame3,
.frame4,
.logowh-1-icon {
  position: absolute;
  top: 0;
  height: 528px;
}
.logowh-1-icon {
  left: 73px;
  width: 529px;
  object-fit: cover;
}
.frame3,
.frame4 {
  left: 419px;
  width: 602px;
  overflow: hidden;
}
.frame3 {
  left: 0;
  width: 1440px;
  height: 775px;
}
.get-started {
  cursor: pointer;
  border: 0;
  padding: 0;
  background-color: rgba(248, 245, 245, 0.99);
  position: absolute;
  top: 0;
  left: calc(60% - 165px);
  font-size: var(--font-size-17xl);
  font-weight: 700;
  font-family: var(--font-inter);
  color: var(--color-black);
  text-align: center;
  display: inline-block;
  width: 300px;
}
.get-started:active{
  background-color: rgba(248, 245, 245, 0.99);
  box-shadow: none;
  transform: translateY(4px);
}
.frame5,
.frame6{
  position: absolute;
  top: 23px;
  left: 30%;
  width: 322px;
  height: 44px;
  overflow: hidden;
}
.frame5 {
  top: 528px;
  left: 368px;
  width: 704px;
  height: 83px;
}
.frame2 {
  position: relative;
  width: 1440px;
  height: 775px;
  overflow: hidden;
  flex-shrink: 0;
}
.desktop-1,
.frame {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.frame {
  width: 1440px;
  height: 915px;
  flex-shrink: 0;
  justify-content: center;
  gap: 24px;
  margin-top: -605px;
}
.desktop-1 {
  position: relative;
  background-color: var(--color-white);
  width: 100%;
  height: 1024px;
  justify-content: flex-start;
}
</style>