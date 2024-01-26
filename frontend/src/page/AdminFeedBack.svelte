<script>
    import '.././app.css';

    let subject = 'Reckless Driving';
    let feedbackId = 101; 
    let driverName = 'Md. Altaf Hossain';
    let routeName = 'Mirpur 10 - Farmgate';
    let specificDate = '24 July, 2023';
    let date = '24 July, 2023';
    let actions = '';
    let complaint = 'Complaint';
    let isToggle = false;
  
    function respondToFeedback() {
        isToggle = !isToggle;
        //send actions to database
    }

    function profileClicked() {
        window.location.href = '/admin-profile';
    }

    function FeedbackClicked() {
        window.location.href = '/admin-feedback';
    }

    function RequisitionClicked() {
        window.location.href = '/admin-requisition';
    }

    function TrackingHistoryClicked() {
        window.location.href = '/admin-tracking-history';
    }

    function BusAllocationClicked() {
        window.location.href = '/admin-bus-allocation';
    }

    function LogOutClicked() {
        window.location.href = '/';
    }

  </script>
  
  <div class="admin-see-feedback">
    <div class="feedback-parent">
      <h1 class="feedback" id="feedback">Feedback</h1>
      <h2 class="reckless-driving">{subject}</h2>
      <div class="feeback-id-101-container">
        <span class="feeback-id">Feeback ID</span>
        <span>: {feedbackId}</span>
      </div>
      <div class="bus-information-parent">
        <h5 class="bus-information">Bus Information:</h5>
        <div class="group-parent">
          <div class="driver-name-parent">
            <div class="driver-name-container">
              <p class="driver-name">{driverName}</p>
              <p class="blank-line">&nbsp;</p>
            </div>
            <div class="driver">
              <span class="feeback-id">
                <span>Driver</span>
              </span>
              <span>
                <span class="feeback-id"> </span>
                <span class="span1"> : </span>
              </span>
            </div>
          </div>
          <div class="route-parent">
            <div class="route">Route :</div>
            <div class="route-name">
              <p class="driver-name">{routeName}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="specific-date">Specific Date : {specificDate}</div>
      <p class="driver-name">
        <span class="date">Date : </span>
        <span>{date} </span>
      </p>
      <h2 class="actions">Actions</h2>
      <div class="complaint">Complaint</div>
      <textarea class="frame-child" name="text" bind:value={actions} placeholder="Action"/>
      <p class="frame-item"> {complaint}</p>
    </div>
    {#if isToggle==false}
        <button class="button" on:click={respondToFeedback}>Respond</button>
    {:else}
        <button class="toggled-button" on:click={respondToFeedback}>Responded</button>
    {/if}
    <nav class="admin" id="navbar">
        <div class="group-container">
          <div class="rectangle-parent">
            <div class="group-child"></div>
            <div class="sidebar-desktop">
              <div class="sidebar-list-active">
                <img class="sheet-icon" alt="" src="/sheet.svg" />

                <div class="selected"></div>
                <div class="title">Profile</div>
                <img
                  class="iconlylight-outlinecall"
                  alt=""
                  src="iconlylightoutlinecall.svg"
                />

                <img
                  class="sidebar-list-active-child"
                  alt=""
                  src="group-37886.svg"
                />
              </div>
              <div class="sidebar-list-inactive">
                <div class="title">Feedbacks</div>
                <div class="icon-sidebar-inactive-2"></div>
                <img
                  class="iconlylight-outlineactivity"
                  alt=""
                  src="icon--sidebar--inactive--4-contacts.svg"
                />
              </div>
              <div class="sidebar-list-inactive">
                <div class="title">Requisitions</div>
                <img
                  class="icon-sidebar-inactive-2"
                  alt=""
                  src="icon--sidebar--inactive--3-ideas.svg"
                />
              </div>
              <div class="sidebar-list-inactive">
                <div class="title">Analytics</div>
                <img
                  class="iconlylight-outlineactivity"
                  alt=""
                  src="iconlylightoutlineactivity.svg"
                />
              </div>
              <div class="sidebar-list-inactive"></div>
            </div>
          </div>
          <h1 class="admin1">Admin</h1>
        </div>
        <div class="sidebar-desktop1">
          <button class="sidebar-list-active1" on:click={profileClicked}>
            <img class="sheet-icon1" alt="" src="sheet1.svg" />

            <div class="selected1"></div>
            <div class="title4">Profile</div>
            <div class="iconlylight-outlinecall"></div>
            <img
              class="sidebar-list-active-item"
              alt=""
              src="group-37886.svg"
            />
          </button>
          <button class="sidebar-list-active1" on:click={FeedbackClicked}>
            <div class="title5">Feedbacks</div>
            <div class="icon-sidebar-inactive-21"></div>
            <img
              class="iconlylight-outlineactivity"
              alt=""
              src="icon--sidebar--inactive--4-contacts1.svg"
            />
          </button>
          <button class="sidebar-list-active1" on:click={RequisitionClicked}>
            <div class="title4">Requisitions</div>
            <img
              class="icon-sidebar-inactive-2"
              alt=""
              src="icon--sidebar--inactive--3-ideas1.svg"
            />
          </button>
          <button class="sidebar-list-active1" on:click={TrackingHistoryClicked}>
            <div class="title4">Tracking History</div>
            <img class="vector-icon" alt="" src="vector.svg" />
          </button>
          <button class="sidebar-list-active1" on:click={BusAllocationClicked}>
            <div class="title4">Bus Allocation</div>
            <img class="list-box-icon" alt="" src="listbox.svg" />
          </button>
        </div>
        <button class="sidebar-list-inactive8" on:click={LogOutClicked}>
          <div class="title4">Logout</div>
          <img
            class="iconlylight-outlineactivity"
            alt=""
            src="iconlylightoutlineactivity1.svg"
          />
        </button>
      </nav>
      <div class="selected2"></div>
      <img class="sheet-icon2" alt="" src="sheet1.svg" />

      <button class="ellipse-parent" on:click={FeedbackClicked}>
        <div class="group-item"></div>
        <div class="x">X</div>
      </button>
    </div>


<style>
    .feedback,
.reckless-driving {
  margin: 0 !important;
  position: absolute;
  font-weight: 400;
  font-family: inherit;
}
.feedback {
  top: 0;
  left: 408px;
  font-size: 50px;
  color: #605858;
  z-index: 0;
}
.reckless-driving {
  top: 96px;
  left: 11px;
  font-size: 29px;
  display: inline-block;
  width: 708px;
  height: 42px;
  flex-shrink: 0;
  z-index: 1;
}
.feeback-id {
  font-weight: 600;
}
.feeback-id-101-container {
  position: absolute;
  margin: 0 !important;
  top: 158px;
  left: 11px;
  display: inline-block;
  width: 183px;
  height: 17px;
  flex-shrink: 0;
  z-index: 2;
}
.bus-information {
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  font-size: inherit;
  font-weight: 600;
  font-family: inherit;
  display: inline-block;
  width: 223px;
  height: 33px;
}
.driver-name {
  margin: 0;
}
.blank-line {
  margin: 0;
  font-size: var(--font-size-smi);
}
.driver-name-container {
  position: absolute;
  top: 0;
  left: 75px;
  display: inline-block;
  width: 283px;
  height: 20px;
}
.span1 {
  font-weight: 600;
  font-family: var(--font-inter);
}
.driver,
.driver-name-parent {
  position: absolute;
  left: 0;
  height: 20px;
}
.driver {
  top: 0;
  display: inline-block;
  width: 63px;
}
.driver-name-parent {
  top: 24px;
  width: 358px;
}
.route-name,
.route {
  position: absolute;
  top: 0;
  display: inline-block;
  height: 20px;
}
.route {
  left: 0;
  font-weight: 600;
  width: 63px;
}
.route-name {
  left: 74px;
  width: 284px;
}
.group-parent,
.route-parent {
  position: absolute;
  top: 0;
  left: 0;
  width: 358px;
  height: 20px;
}
.group-parent {
  top: 25px;
  height: 44px;
  font-size: var(--font-size-mini);
}
.bus-information-parent,
.specific-date {
  position: absolute;
  margin: 0 !important;
  top: 200px;
  left: 11px;
  width: 358px;
  height: 69px;
  z-index: 3;
}
.specific-date {
  top: 314px;
  font-size: 17px;
  font-weight: 600;
  display: inline-block;
  width: 267px;
  height: 20px;
  flex-shrink: 0;
  z-index: 4;
}
.date {
  font-weight: 600;
  font-family: var(--font-open-sans);
}
.actions,
.complaint
{
  position: absolute;
  margin: 1pt !important;
  padding-top: 2pt !important;
  display: inline-block;
}
.actions,
.complaint {
  font-size: var(--font-size-4xl);
  font-weight: 600;
  color: var(--color-dimgray-100);
}
.actions {
  top: 567px;
  left: 17px;
  font-family: inherit;
  width: 175px;
  z-index: 6;
}
.complaint {
  top: 379px;
  left: 11px;
  width: 181px;
  z-index: 7;
}
.frame-child {
  border: 0;
  background-color: var(--color-gainsboro-100);
  top: 604px;
  left: 11px;
  border-radius: var(--br-base);
  width: 80%;
  height: 145px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 8;
  padding: 5pt;
  font-family: var(--font-open-sans);
  font-size: 19px;
}
.frame-child,
.frame-item {
  position: absolute;
  margin: 0 !important;
}
.frame-item {
  border: 0;
  background-color: var(--color-gainsboro-100);
  font-family: var(--font-open-sans);
  font-size: 19px;
  top: 416px;
  left: 9px;
  border-radius: var(--br-base);
  width: 80%;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 9;
  padding: 5pt;
}
.feedback-parent {
  position: absolute;
  top: 56px;
  left: 309px;
  width: 1064px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}
.button {
  cursor: pointer;
  border-radius: 10px;
  border: 0;
  padding: 0;
  background-color: #621414;
  position: absolute;
  top: 874px;
  left: 85%;
  font-size: 30px;
  font-weight: 600;
  font-family: var(--font-open-sans);
  color: var(--color-white);
  text-align: center;
  display: inline-block;
  width: 146px;
  height: 56px;
}

.toggled-button{
cursor: pointer;
  border-radius: 10px;
  border: 0;
  padding: 0;
  background-color: green;
  position: absolute;
  top: 874px;
  left: 85%;
  font-size: 30px;
  font-weight: 600;
  font-family: var(--font-open-sans);
  color: var(--color-white);
  text-align: center;
  display: inline-block;
  width: 146px;
  height: 56px;
}
.group-child {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-maroon-500);
  width: 255px;
  height: 1024px;
}
.selected,
.sheet-icon {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
}
.sheet-icon {
  width: 100%;
  right: 0;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  opacity: 0.08;
}
.selected {
  background-color: var(--main-lightblue);
  width: 3px;
}
.title {
  position: absolute;
  width: calc(100% - 96px);
  top: calc(50% - 10px);
  left: 72px;
  letter-spacing: 0.2px;
  font-weight: 600;
  display: inline-block;
}
.iconlylight-outlinecall {
  position: absolute;
  top: 21px;
  left: 31px;
  width: 16px;
  height: 16px;
  display: none;
}
.sidebar-list-active-child {
  position: absolute;
  top: 18px;
  left: 234px;
  width: 3px;
  height: 19px;
}
.sidebar-list-active {
  position: relative;
  width: 255px;
  height: 56px;
  color: var(--main-lightblue);
}
.icon-sidebar-inactive-2 {
  position: absolute;
  top: calc(50% - 8px);
  left: 32px;
  width: 16px;
  height: 16px;
  overflow: hidden;
}
.sidebar-list-inactive {
  position: relative;
  width: 255px;
  height: 56px;
}
.iconlylight-outlineactivity {
  position: absolute;
  height: 28.57%;
  width: 6.27%;
  top: 35.71%;
  right: 81.18%;
  bottom: 35.71%;
  left: 12.55%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.sidebar-desktop {
  position: absolute;
  top: 130px;
  left: 0;
  background-color: var(--sidebar-bg);
  overflow: hidden;
  display: none;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.rectangle-parent {
  position: absolute;
  top: 0;
  left: 0;
  width: 255px;
  height: 1024px;
}
.admin1 {
  margin: 0;
  position: absolute;
  top: 39px;
  left: 69px;
  font-size: var(--font-size-16xl);
  letter-spacing: 0.2px;
  font-weight: 700;
  font-family: inherit;
  color: var(--color-white);
  text-align: center;
}
.group-container,
.selected1,
.sheet-icon1 {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
}
.group-container {
  width: 98.08%;
  right: 1.92%;
}
.selected1,
.sheet-icon1 {
  display: none;
}
.sheet-icon1 {
  width: 100%;
  right: 0;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  opacity: 0.08;
}
.selected1 {
  background-color: var(--main-lightblue);
  width: 3px;
}
.title4 {
  position: absolute;
  width: calc(100% - 96px);
  top: calc(50% - 10px);
  left: 72px;
  font-size: var(--font-size-base);
  letter-spacing: 0.2px;
  font-weight: 600;
  font-family: var(--font-open-sans);
  color: var(--sidebar-gray);
  text-align: left;
  display: inline-block;
}
.title4:hover {
  color: var(--main-lightblue);
}
.sidebar-list-active-item {
  position: absolute;
  top: 18px;
  left: 234px;
  width: 3px;
  height: 19px;
  display: none;
}
.sidebar-list-active1 {
  cursor: pointer;
  border: 0;
  padding: 0;
  background-color: transparent;
  position: relative;
  width: 255px;
  height: 56px;
}
.title5 {
  position: absolute;
  width: calc(100% - 96px);
  top: calc(50% - 10px);
  left: 72px;
  font-size: var(--font-size-base);
  letter-spacing: 0.2px;
  font-weight: 600;
  font-family: var(--font-open-sans);
  color: var(--main-lightblue);
  text-align: left;
  display: inline-block;
}
.icon-sidebar-inactive-21 {
  position: absolute;
  top: calc(50% - 8px);
  left: 32px;
  width: 16px;
  height: 16px;
  overflow: hidden;
  display: none;
}
.vector-icon {
  position: absolute;
  height: 32.14%;
  width: 9.02%;
  top: 30.36%;
  right: 80%;
  bottom: 37.5%;
  left: 10.98%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.list-box-icon,
.sidebar-desktop1 {
  position: absolute;
  top: 16px;
  left: 28px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
.sidebar-desktop1 {
  height: 22.62%;
  width: 98.08%;
  top: 16.16%;
  right: 1.92%;
  bottom: 61.23%;
  left: 0;
  background-color: var(--color-maroon-500);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.sidebar-list-inactive8 {
  cursor: pointer;
  border: 0;
  padding: 0;
  background-color: transparent;
  position: absolute;
  height: 4.52%;
  width: 98.08%;
  top: 74.88%;
  right: 0;
  bottom: 20.6%;
  left: 1.92%;
}
.admin {
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 260px;
  height: 1238px;
  text-align: left;
  font-size: var(--font-size-base);
  color: var(--sidebar-gray);
  font-family: var(--font-open-sans);
}
.selected2,
.sheet-icon2 {
  height: calc(100% - 968px);
}
.selected2 {
  position: absolute;
  top: 260px;
  bottom: 708px;
  left: 0;
  background-color: var(--main-lightblue);
  width: 3px;
}
.sheet-icon2 {
  width: calc(100% - 1185px);
  top: 261px;
  right: 1180px;
  bottom: 707px;
  left: 5px;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  opacity: 0.08;
}
.group-item,
.sheet-icon2,
.x {
  position: absolute;
}
.group-item {
  top: 0;
  left: 0;
  border-radius: 50%;
  background-color: #d9d9d9;
  width: 62px;
  height: 62px;
}
.x {
  top: 12px;
  left: 18px;
  font-size: 32px;
  font-family: var(--font-prosto-one);
  color: #621414;
  text-align: left;
  display: inline-block;
  width: 32px;
  height: 30px;
}
.ellipse-parent {
  cursor: pointer;
  border: 0;
  padding: 0;
  background-color: transparent;
  position: absolute;
  top: 35px;
  left: 92%;
  width: 62px;
  height: 62px;
}
.ellipse-parent:active{
  background-color: transparent;
  box-shadow: none;
  transform: translateY(4px);
}
.admin-see-feedback {
  position: relative;
  background-color: #f5f5f9;
  width: 100%;
  height: 1024px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-base);
  color: var(--color-black-700);
  font-family: var(--font-open-sans);
}

</style>