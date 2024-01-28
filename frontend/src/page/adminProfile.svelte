<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isAuthenticated } from '../auth';
    import Navbar from './navbar.svelte';
    // Import any required components or functions
    let admin = {id: '', password: '', email: '', photo: ''};
    // Fetch admin details
    async function fetchAdminDetails() {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            let data = await response.json();
            admin = data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    onMount(async () => {
        fetchAdminDetails();
    });

  </script>

    <main class="flex min-h-screen min-w-full bg-gradient-to-b from-maroon-500 to-maroon-900">
        <div>
            <Navbar />
        </div>
  
  <div class="min-h-screen bg-gray-100 py-6 flex flex-1 justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="absolute inset-0 bg-gradient-to-r from-red-300 to-red-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <div>
            <img src="{admin.photo}" alt="Admin Photo" class="h-24 w-24 rounded-full mx-auto"/>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div class="flex justify-center">
                <h3 class="text-xl font-bold">{admin.id}</h3>
              </div>
              <ul class="list-disc space-y-2">
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <!-- Icon -->
                    </svg>
                  </span>
                  <p class="ml-2">
                    Role: <span class="font-semibold">Administrator</span>
                  </p>
                </li>
                <li class="flex items-start">
                  <span class="h-6 flex items-center sm:h-7">
                    <svg class="flex-shrink-0 h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <!-- Icon -->
                    </svg>
                  </span>
                  <p class="ml-2">Email: <span class="font-semibold">{admin.email}</span></p>
                </li>
                <!-- Add more list items as needed -->
              </ul>
              <div class="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Want to change any details?</p>
                <p>
                  <a href="#" class="text-cyan-600 hover:text-cyan-700"> Update Profile &rarr; </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </main>
  
  <style>
    /* Add custom styles or overrides for Tailwind CSS here */
  </style>
  