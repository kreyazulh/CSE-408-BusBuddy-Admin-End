<script>
  import { onMount } from "svelte";
  import Navbar from "../GlobalComponents/navbar.svelte";
  import { isAuthenticated } from "../../auth";
  import ErrorPopUp from "../GlobalComponents/PopUps/errorPopUp.svelte";
  import SuccessfulPopUp from "../GlobalComponents/PopUps/successfulPopUp.svelte";
  import { navigate } from "svelte-routing";

  let notices = [];
  let text = "";
  let addNoticeResponse = "";
  let success = -1;

  let editID = "";
  let editText = "";

  async function getNoticeList() {
    const response = await fetch("http://localhost:3000/api/notice/");
    const data = await response.json();
    notices = data;
    for (let i = 0; i < notices.length; i++) {
      notices[i].date = new Date(notices[i].date).toDateString();
    }
    console.log(notices);
  }

  async function addNotice() {
    // Create a JSON object with the data
    let today = new Date();
    let tod = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + today.getTimezoneOffset();
  
    const noticeData = {
      date: tod,
      text: text,
    };

    try {
      const response = await fetch("http://localhost:3000/api/notice/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noticeData),
      });
      console.log(response);
      console.log(noticeData);
      // fornow = await response.json();

      if (response.ok) {
        // Request was successful
        addNoticeResponse = "Notice added successfully";
        success = 1;
      } else {
        // Request failed
        addNoticeResponse = "Failed to add notice";
        success = 0;
      }
      // navigate('/noticeList');
      location.reload();
    } catch (error) {
      console.error("Error:", error);
      addNoticeResponse = "Error occurred";
      success = 0;
    }
  }

  function editNoticeBody(idx) {
    notices[idx].text = editText;
    editText = "";
    editID = "";
    //update the notice
  }

  async function deleteNotice(idx) {
    notices.splice(idx, 1);
    //remove the notice
  }

  function changeToEditMode(idx) {
    editID = notices[idx].id;
    editText = notices[idx].text;
  }

  onMount(async () => {
    getNoticeList();
  });
</script>

{#if $isAuthenticated}
  <main
    class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 via-maroon-900 to-black-900"
  >
    <div class="z-20">
      <Navbar />
    </div>

    <div class="flex-1 ml-56 w-full pl-4 py-8">
      <div class="flex items-start justify-start h-18">
        <h1 class="text-3xl font-bold underline uppercase text-white-700">
          Notices
        </h1>
      </div>

      <div class="flex flex-row justify-end mr-5 h-fit">
        <input
          type="text"
          bind:value={text}
          placeholder="Enter notice text"
          class="input bg-white border border-gray-400 rounded-lg p-2 mr-4"
        />
        <button
          on:click={addNotice}
          class="bg-indigo-500 hover:bg-indigo-700 text-white-700 font-bold py-2 px-4 rounded"
          >Add Notice</button
        >
      </div>

      <div
        class="flex flex-col items-start justify-start max-w-full space-y-3 my-3 overflow-hidden"
      >
        {#each notices as notice, index}
          <div
            class="{index % 2 === 0
              ? 'bg-gray-200'
              : 'bg-white-700'} hover:bg-gray-300 rounded-lg flex flex-col w-full h-fit px-3 py-3"
          >
            <span class="flex justify-between mt-1 mb-2">
              <p
                class="text-xl font-semibold text-gray-700 border-b-2 border-gray-400"
              >
                {notice.id}
              </p>
              <p class="text-lg font-semibold text-maroon-500 mr-10">
                {notice.date}
              </p>
            </span>
            {#if editID === notice.id}
              <input
                class="w-full h-10 border-2 border-gray-300 rounded-lg px-2 py-2"
                bind:value={editText}
              />
            {:else}
                <p class="text-normal font-normal text-black-900">
                  {notice.text}
                </p>
            {/if}

            <div class="flex items-center justify-end w-full my-2 mr-5">
              {#if editID !== notice.id}
                <button
                  class="bg-transparent mx-2"
                  on:click={() => changeToEditMode(index)}
                >
                  <i
                    class="bx bxs-edit text-maroon-500 hover:text-maroon-900 scale-150"
                  ></i>
                </button>
              {:else}
                <button
                  class="bg-transparent mx-2"
                  on:click={() => editNoticeBody(index)}
                >
                  <i
                    class="bx bxs-save text-maroon-500 hover:text-maroon-900 scale-150"
                  ></i>
                </button>
              {/if}
              <button
                class="bg-transparent mx-2"
                on:click={() => deleteNotice(index)}
              >
                <i
                  class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"
                ></i>
              </button>
            </div>
          </div>
        {/each}
      </div>
          <!-- success popup -->
          {#if success==1}
          <SuccessfulPopUp successMessage={addNoticeResponse}
          on:closeSuccess={()=>{success=-1;
          navigate("/busList");}}/>
        {:else if success==0}
          <ErrorPopUp errorMessage={addNoticeResponse}
          on:closeError={()=>(success=-1)}/>
        {/if}
    </div>
  </main>
{:else}
  <div>
    <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
  </div>
{/if}
