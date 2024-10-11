<template>
  <div id="app">
    <section v-bind:class="{ 'fadeIn': animate }">
      <div class="row page-head gap-2" style="margin-top: 70px">
        <h1 class="white-head fw-bold text-green-800">Uses</h1>
        <p>This is the equipment I currently use for gaming, programming, making videos, and every day.</p>
      </div>
      <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
    </section>
    <section class="laptop-section">
      <h2>Laptop</h2>
      <div class="laptop-item">
        <img src="../assets/img/uses/laptop.jpg" alt="Lenovo Thinkpad T460s" />
        <p class="name">Lenovo Thinkpad T460s</p>
        <p class="subname">Laptop</p>
      </div>
    </section>
    <section>
      <h2>Operating System</h2>
      <div class="product-list">
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/windows.png" alt="Windows 10" />
          </div>
          <p class="name">Windows 10</p>
          <p class="subname">Laptop</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/Linux.png" alt="Linux" />
          </div>
          <p class="name">Linux</p>
          <p class="subname">Desktop</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/ubuntu.png" alt="ubuntu" />
          </div>
          <p class="name">ubuntu</p>
          <p class="subname">Desktop</p>
        </div>
      </div>
    </section>
    <section>
      <h2>Accessories</h2>
      <div class="product-list">
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/button-mobile.png" alt="Symphony Hero 20" />
          </div>
          <p class="name">Symphony Hero 20</p>
          <p class="subname">Phone</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/headphone.png" alt="Logi" />
          </div>
          <p class="name">Logi</p>
          <p class="subname">Headphone</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/Watch.png" alt="Forest Watch" />
          </div>
          <p class="name">Forest</p>
          <p class="subname">Watch</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/bottle.png" alt="THERMOS" />
          </div>
          <p class="name">THERMOS</p>
          <p class="subname">Drink Bottle</p>
        </div>
      </div>
    </section>
    <section>
      <h2>Tools</h2>
      <div class="product-list">
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/vs-code.png" alt="VS Code" />
          </div>
          <p class="name">VS Code</p>
          <p class="subname">Compiler</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/theme.png" alt="Theme" />
          </div>
          <p class="name">Github Theme</p>
          <p class="subname">Dark</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/postman.png" alt="Postman" />
          </div>
          <p class="name">Postman</p>
          <p class="subname">API</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/git.png" alt="Git" />
          </div>
          <p class="name">Git</p>
          <p class="subname">Control System</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/material.png" alt="material" />
          </div>
          <p class="name">material</p>
          <p class="subname">Icon Theme</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/xampp.png" alt="xampp" />
          </div>
          <p class="name">xampp</p>
          <p class="subname">Database</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/trello.png" alt="trello" />
          </div>
          <p class="name">trello</p>
          <p class="subname">Team Manage</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/chatgpt.png" alt="chatgpt" />
          </div>
          <p class="name">chatgpt</p>
          <p class="subname">AI</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/figma.png" alt="Figma" />
          </div>
          <p class="name">Figma</p>
          <p class="subname">Design</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/coding/skype.png" alt="skype" />
          </div>
          <p class="name">skype</p>
          <p class="subname">Communication</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/testing-tools/JMeter_Logo.png" alt="JMeter" />
          </div>
          <p class="name">JMeter</p>
          <p class="subname">Performance Testing</p>
        </div>
        <div class="product-item">
          <div class="image">
            <img src="../assets/img/uses/testing-tools/blazemeter.png" alt="Blazemeter" />
          </div>
          <p class="name">Blazemeter</p>
          <p class="subname">Testing Extension</p>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      animate: false
    };
  },
  mounted() {
    // Trigger animation when component is mounted
    this.animate = true;
  }
}
</script>

<style>
#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
section {
  margin-bottom: 40px;
}
h2 {
  margin-bottom: 30px;
}
.product-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.laptop-item {
  background-color: var(--border);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  flex: 1 1 200px;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  white-space: nowrap; /* Prevent text from breaking */
}
.laptop-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--blackly);
}
.laptop-item .image {
  height: 70%;
}
.laptop-item img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
.laptop-item .name,
.laptop-item .subname {
  white-space: nowrap; /* Prevent text from breaking */
}
.laptop-item .name {
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 10px;
  text-transform: uppercase;
}

.product-item {
  background-color: var(--border);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  flex: 1 1 200px;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  white-space: nowrap; /* Prevent text from breaking */
}
.product-item:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--blackly);
}
.product-item .image {
  height: 70%;
}
.product-item img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
.product-item .name,
.product-item .subname {
  white-space: nowrap; /* Prevent text from breaking */
}
.product-item .name {
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 10px;
  text-transform: uppercase;
}
.product-item .subname {
  font-size: 0.9em;
  color: var(--grey);
}
.laptop-item {
  background-color: transparent;
  padding: 0;
  box-shadow: none;
}
.laptop-item img {
  border-radius: 0;
}

@media (min-width: 575.98px) {
  .product-list {
    flex-direction: column;
  }
  .product-item {
    flex: 1 1 calc(50% - 20px); /* Two items per row */
    max-width: calc(50% - 20px);
  }
}


@media (min-width: 576px) and (max-width: 767.98px) {
  /* Small devices (landscape phones, 576px and up) */
  .product-list {
    flex-direction: row;
  }
  .product-item {
    flex: 1 1 calc(50% - 20px); /* Two items per row */
  }
  .product-item .name {
    margin-top: 40px;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  /* Medium devices (tablets, 768px and up) */
  .product-list {
    flex-direction: row;
  }
  .product-item {
    flex: 1 1 calc(33.33% - 20px); /* Three items per row */
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Large devices (desktops, 992px and up) */
  .product-list {
    flex-direction: row;
  }
  .product-item {
    flex: 1 1 calc(25% - 20px); /* Four items per row */
  }
}

@media (min-width: 1200px) and (max-width: 1399.98px) {
  /* Extra large devices (large desktops, 1200px and up) */
  .product-list {
    flex-direction: row;
  }
  .product-item {
    flex: 1 1 calc(20% - 20px); /* Five items per row */
  }
}

@media (min-width: 1400px) {
  /* Extra extra large devices (larger desktops, 1400px and up) */
  .product-list {
    flex-direction: row;
  }
  .product-item {
    flex: 1 1 calc(16.67% - 20px); /* Six items per row */
  }
}
</style>