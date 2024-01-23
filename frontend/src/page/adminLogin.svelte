<script>
    import '.././app.css';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
  
    let id = '';
    let password = '';
    let loginStatus = '';
  
    async function handleLoginClick() {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      });
  
      const result = await response.json();
      console.log('Received result:', result);
  
      if (result.status === 'success') {
        loginStatus = 'Login successful!';
      } else {
        loginStatus = 'Login failed. Please check your ID and password.';
      }
    }
  
    function handleForgotPasswordClick() {
      // Handle forgot password button click
     
    }
    function togglePasswordVisibility() {
        var passwordInput = document.querySelector('.password1');
        var eyeIcon = document.querySelector('.eye-icon');

        if (passwordInput.getAttribute('type') === 'password') {
            passwordInput.setAttribute('type', 'text');
            eyeIcon.innerHTML = '👁️';
        } else {
            passwordInput.setAttribute('type', 'password');
            eyeIcon.innerHTML = '👁️';
        }
    }

  </script>

<main>
  <div class="admin-login-frame">
    <div class="admin-logindefault">
      <div class="admin-logindefault-inner">
        <div class="frame-container">
          <div class="upper-section-container">
            <div class="upper-section1">
              <h2 class="login-text1" id="loginText">
                <div class="login3">Login</div>
              </h2>
              <div class="credentials1">
                <input
                  type="text"
                  class="username1"
                  placeholder="Username"
                  bind:value={id} 
                  required
                />
                <div class="password-rem1">
                  <div class="password-container">
                      <input
                          type="password"
                          class="password1"
                          placeholder="Password"
                          bind:value={password}
                          required
                      />
                      <button class="eye-icon" on:click= {togglePasswordVisibility}>
                          👁️
                      </button>
                  </div>
                  <div class="remember1">
                      <input
                          class="fluentcheckbox-checked-16-fil1"
                          type="checkbox"
                      />
                      <div class="remember-me1">Remember me</div>
                  </div>
              </div>
                <div class="login-bt-fp1">
                  <button class="login4" on:click={handleLoginClick}>
                    <div class="login5">Login</div>
                  </button>
                  <button class="forgot-password1" on:click={handleForgotPasswordClick}>
                    Forgot password ?
                  </button>
                </div>
              </div>
            </div>
          </div>
          {#if loginStatus}
            <p>{loginStatus}</p>
          {/if}
        </div>
      </div>
      <img
        class="logo-busbuddy-1-icon1"
        alt=""
        src="logo-busbuddy-1@2x.png"
      />
    </div>
  </div>
</main>

<style>
.login3 {
  position: relative;
  font-weight: 600;
}
.login-text1,
.password1,
.username1 {
  display: flex;
  justify-content: flex-start;
}
.login-text1 {
  margin: 0;
  flex-direction: column;
  align-items: flex-start;
  font-size: inherit;
  font-family: inherit;
}
.password1,
.username1 {
  border: 1px solid var(--color-white);
  background-color: transparent;
  font-family: var(--font-noto-sans);
  font-size: var(--font-size-xl);
  border-radius: var(--br-xs);
  box-sizing: border-box;
  width: 400px;
  flex-direction: row;
  padding: var(--padding-sm) var(--padding-base);
  align-items: center;
}

.password-container {
        position: relative;
    }

.eye-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        background-color: transparent;
    }

.fluentcheckbox-checked-16-fil1 {
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  overflow: hidden;
  flex-shrink: 0;
}
.remember-me1 {
  position: relative;
  font-weight: 500;
}
.password-rem1,
.remember1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--gap-9xs);
}
.password-rem1 {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--gap-xs);
}
.login5 {
  position: relative;
  font-size: var(--font-size-xl);
  font-weight: 600;
  font-family: var(--font-noto-sans);
  color: var(--color-white);
  text-align: left;
}
.login4 {
  cursor: pointer;
  border: 0;
  padding: var(--padding-sm) var(--padding-3xs);
  background-color: var(--color-salmon);
  border-radius: var(--br-xs);
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login4:active {
  background-color: var(--color-salmon);
  box-shadow: none;
  transform: translateY(4px);
}
.forgot-password1 {
  cursor: pointer;
  border: 0;
  padding: 0;
  background-color: transparent;
  position: relative;
  font-size: var(--font-size-base);
  font-weight: 500;
  font-family: var(--font-noto-sans);
  color: var(--color-white);
  text-align: left;
  display: inline-block;
}
.forgot-password1:active {
  background-color: transparent;
  box-shadow: none;
  transform: translateY(4px);
}
.credentials1,
.login-bt-fp1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-xs);
}
.credentials1 {
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--gap-6xl);
  font-size: var(--font-size-base);
}
.upper-section1 {
  gap: var(--gap-sm);
}
.frame-container,
.upper-section-container,
.upper-section1 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.frame-container {
  position: absolute;
  top: 97px;
  left: 40px;
  align-items: center;
}
.admin-logindefault-inner {
  position: absolute;
  top: calc(50% - 388px);
  right: 42px;
  border-radius: var(--br-xl);
  background: linear-gradient(
      -38.77deg,
      rgba(171, 157, 157, 0.19),
      rgba(235, 204, 204, 0)
    ),
    rgba(109, 18, 18, 0.14);
  box-shadow: -8px 4px 5px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(53px);
  width: 480px;
  height: 796px;
  overflow: hidden;
}
.logo-busbuddy-1-icon1 {
  position: absolute;
  top: 259px;
  left: 113px;
  width: 553px;
  height: 466px;
  object-fit: cover;
}
.admin-logindefault {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #a81919, rgba(120, 27, 27, 0));
  width: 100%;
  height: 1024px;
  overflow: hidden;
}
.admin-login-frame {
  position: relative;
  background-color: var(--color-black);
  width: 100%;
  height: 1024px;
  overflow: hidden;
  text-align: left;
  font-size: var(--font-size-17xl);
  color: var(--color-white);
  font-family: var(--font-noto-sans);
}

</style>