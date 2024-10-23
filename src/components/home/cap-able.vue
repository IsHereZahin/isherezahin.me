<template>
  <section id="capable">
    <div class="container">
      <div class="row flex-column-reverse flex-md-row justify-content-between gap-4">
          <h1 class="headline">What am i capable of</h1>
      </div>

      <div class="grid-container">
        <div class="row">
          <div class="col-xs-12 col-md-8">
            <div class="design-system-card">
              <h1>Build Scalable Web Applications</h1>
              <p>
                I create highly efficient and scalable web applications, leveraging my expertise in Laravel, Vue.js, and database management to deliver robust solutions.
              </p>

              <div class="control-buttons">
                <div class="button"><i class="bi bi-laptop"></i></div>
                <div class="button"><i class="bi bi-code-slash"></i></div>
              </div>

              <div class="user-interface">
                <div class="user-card">
                  <img src="../../assets/img/dark.png" alt="User" class="user-avatar" />
                  <div class="user-info">
                    <div class="user-name">IsHereZahin</div>
                    <div class="user-status">Online</div>
                  </div>
                </div>
                <div class="toggle-switches">
                  <div class="switch">
                    <span><i class="bi bi-code"></i></span>
                    <span><i class="bi bi-terminal"></i></span>
                    <span><i class="bi bi-server"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-md-4 create-interfaces">
            <h1>Create Interfaces<br>Users <span class="heart-bit">❤️</span> to Use</h1>
          </div>
        </div>

        <div class="row">

          <div class="col-xs-12 col-md-6 col-lg-7">
            <div class="mvp-container">
              <div class="icon-section mt-2">
                <div class="icon-item">
                  <div class="icon-circle" style="background-color: #42D1FF;">
                    <i class="bi bi-lightbulb"></i>
                  </div>
                  <p>Innovate</p>
                </div>
                <div class="icon-item">
                  <div class="icon-circle" style="background-color: #985CF5;">
                    <i class="bi bi-hammer"></i>
                  </div>
                  <p>Build</p>
                </div>
                <div class="icon-item">
                  <div class="icon-circle" style="background-color: #FFCE32;">
                    <i class="bi bi-check2-circle"></i>
                  </div>
                  <p>Deliver</p>
                </div>
              </div>
              <div class="text-section">
                <h1>Build an MVP</h1>
                <p>
                  Building a Minimum Viable Product (MVP) is my approach to quickly validate ideas, iterate fast, and ensure your product succeeds.
                </p>
              </div>
            </div>
          </div>

          <div class="col-xs-12 col-md-6 col-lg-5 branding">
            <div class="icon-container">
              <i class="bi bi-palette-fill"></i>
            </div>
            <h1>Enhance Brand Identity</h1>
            <p>
              I focus on enhancing the brand identity of your product by creating seamless designs that are both functional and aesthetically pleasing.
            </p>
          </div>

        </div>

        <div class="row">
          <div class="col-xs-12 col-md-5">
            <div class="research-strategy">
              <div class="icon-container">
                <i class="bi bi-book-fill"></i>
              </div>
              <h1>Research & Strategy</h1>
              <p>
                With a solid foundation in research, I develop data-driven strategies to ensure that your project aligns with user needs and business goals.
              </p>
            </div>
          </div>

          <div class="col-xs-12 col-md-7 conversion-rates">
            <div class="icon-container">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h1>Optimize Conversion Rates</h1>
            <p>
              My designs are built with conversion in mind. I aim to create a user-friendly experience that enhances engagement and drives results.
            </p>
          </div>
        </div>

      </div>

      <div class="row" style="margin-top: -30px;">
        <div class="custom-btn">
          <RouterLink to="/service" class="custom-button">See all services</RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.grid-container {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.design-system-card,
.create-interfaces,
.branding,
.mvp-container,
.research-strategy,
.conversion-rates {
  background: var(--color-background);
  border-radius: 10px;
  padding: 20px;
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  transition: box-shadow 0.3s;
  border: 1px solid var(--border);
}

.research-strategy {
  background: #225c92;
}

.design-system-card {
  border-radius: 15px;
  padding: 40px;
  margin: 0 auto;
}

.design-system-card h1,
.card h1 {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.design-system-card p,
.card p {
  font-size: 1rem;
  margin-bottom: 20px;
}

/* Control Buttons Styling */
.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.button {
  background: var(--color-background);
  padding: 10px 15px;
  border-radius: 8px;
  color: var(--white);
  cursor: pointer;
  transition: background 0.3s;
  border: 1px solid var(--border);
}

.button:hover {
  background: var(--color-heading);
}

/* User Interface Section */
.user-interface {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.user-card {
  display: flex;
  align-items: center;
  background: #1c2230;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info .user-name {
  font-size: 1rem;
  color: white;
}

.user-info .user-status {
  font-size: 0.9rem;
  color: #079b0f;
  margin-top: -5px;
}

/* Toggle Switches */
.toggle-switches {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.switch span {
  display: inline-block;
  color: white;
  background: #1c2230;
  padding: 10px 15px;
  border-radius: 50%;
  margin-left: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.switch span:hover {
  background: #273146;
}

/* Specific Card Backgrounds */
.create-interfaces {
  background-image: url(../../assets/img/asset/VKqOJIvUnWwZhJZLFLgVXCLY.avif.avif);
  background-size: cover;
}

.branding {
  background-image: url(../../assets/img/asset/branding.webp);
  background-size: cover;
}

.create-interfaces h1,
.branding h1 {
  font-size: xx-large;
}

p {
  font-size: 1em;
  color: #d8d8d8;
}

.heart-bit {
  color: #ff4e96;
}

.icon-container {
  font-size: 2rem;
  color: white;
  margin-bottom: 15px;
}

h1 {
  font-size: 1.5rem;
  margin: 10px 0;
}

/* MVP container for smaller screens */
.mvp-container {
  border-radius: 15px;
  padding: 20px;
  margin: 0 auto;
}

.mvp-container .icon-circle p {
  color: var(--white);
}

.icon-section {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.icon-item p {
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
}

.text-section h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.text-section p {
  font-size: 0.9rem;
}

.conversion-rates {
  background: transparent;
  color: white;
}

@media (max-width: 767px) {
  .create-interfaces, .mvp-container, .conversion-rates {
    margin-top: 20px;
  }
}

@media (prefers-color-scheme: light) {
  #capable {
    display: none;
  }
}
</style>
