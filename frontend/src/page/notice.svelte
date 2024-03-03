<script>
  import { onMount } from "svelte";
  import Navbar from "./GlobalComponents/navbar.svelte";
  import { isAuthenticated } from "../auth"

  let notices = [];
  let body = "";

  let changedRows = [];

  let editMode = false;

  async function getNotices() {
    const res = await fetch("http://localhost:3000/api/notice");
    const data = await res.json();
    console.log(data);
    notices = data;
    for(let i = 0; i < notices.length; i++){
      notices[i].time_stamp = new Date(notices[i].time_stamp).toDateString();
    }
    console.log(notices);
  }

  function editNotice(id) {
    editMode = !editMode;
    changedRows.push(id);
}

function editNoticeBody(id) {
    for (let i = 0; i < notices.length; i++) {
      if (notices[i].id === id) {
        notices[i].body = body;
      }
    }
}

    async function deleteNotice(id) {
      const res = await fetch(`http://localhost:3000/api/notice/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      console.log(data);
      getNotices();
    }

    async function saveNotice(id) {
        let index = notices.findIndex((notice) => notice.ID === id);
        console.log(notices[index].body);
      const res = await fetch(`http://localhost:3000/api/notice/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID: notices[index].ID, body: notices[index].body }),
      });
      const data = await res.json();
      console.log(data);
        editMode = false;
        changedRows = changedRows.filter((row) => row !== id);
      getNotices();
    }

    onMount(async () => {
        await getNotices();
    });
</script>

<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>

{#if $isAuthenticated}
  <main class="flex min-h-screen min-w-full">
    <div>
      <Navbar />
    </div>

    <!-- Heading -->
  <div class="flex-1 ml-56 w-full px-4 py-8 bg-white-700">
    <div class="flex items-start justify-start h-18">
      <h1 class="text-3xl font-bold underline uppercase text-maroon-500">Notices</h1>
    </div>
    <div class="flex flex-col items-start justify-start w-full">
        {#each notices as notice,index}
            <div class="{index % 2 === 0 ? 'bg-gray-200' : 'bg-white-700'} hover:bg-gray-300 rounded-lg flex flex-col w-full h-fit px-3 py-3">
                <p class="text-xl font-bold text-maroon-500">{notice.ID}</p>
                <p class="text-lg font-semibold text-gray-700">{notice.time_stamp}</p>
                {#if editMode}
                    <input class="w-full h-10 border-2 border-gray-300 rounded-lg px-2 py-2" bind:value={body}
                    on:input={() => editNoticeBody(notice.ID)}/>
                {:else}
                    <p class="text-normal font-normal text-black-900">{notice.body}</p>
                {/if}
                
                <div class="flex items-center justify-end w-full">
                    <button class="bg-transparent mx-2"
                    on:click={() => editNotice(notice.ID)}>
                    <i class="bx bxs-edit text-maroon-500 hover:text-maroon-900 scale-150"></i>
                    </button>
                    <button class="bg-transparent mx-2"
                    on:click={() => deleteNotice(notice.ID)}>
                    <i class="bx bxs-trash text-maroon-500 hover:text-maroon-900 scale-150"></i>
                    </button>
                    <button
                      class="bg-transparent mx-2"
                      on:click={() => saveNotice(notice.ID)}
                    >
                      {#if changedRows.includes(notice.ID)}
                        <i
                          class="bx bxs-save text-maroon-500 hover:text-maroon-900 scale-150"
                        ></i>
                      {:else}
                        <i
                          class="bx bxs-check-circle text-lime-500 hover:text-lime-700 scale-150"
                        ></i>
                      {/if}
                    </button>
                </div>
            </div>
        {/each}
    </div>




   </div>
  </main>
{:else}
    <div>
        <p class="text-3xl font-extrabold text-maroon-500">Access Denied</p>
    </div>
{/if}
  