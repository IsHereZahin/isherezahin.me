<template>
  <div class="uses-page">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <h1 class="page-title">My Tech Stack</h1>
        <div class="title-decoration"></div>
      </div>
    </header>

    <!-- Introduction -->
    <section class="intro-section">
      <p class="intro-text">The complete collection of hardware and software I use daily for development, design, and
        content creation.</p>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Redesigned Workstation Section -->
      <section class="workstation-section">
        <div class="section-label">
          <span class="label-number">01</span>
          <h2 class="label-text">Workstation</h2>
        </div>

        <!-- Tab Navigation - Redesigned as Pills -->
        <div class="device-tabs">
          <button class="device-tab" :class="{ 'active': activeTab === 'laptop' }" @click="activeTab = 'laptop'">
            <span class="tab-icon">💻</span>
            <span class="tab-text">Laptop</span>
          </button>
          <button class="device-tab" :class="{ 'active': activeTab === 'desktop' }" @click="activeTab = 'desktop'">
            <span class="tab-icon">🖥️</span>
            <span class="tab-text">Desktop</span>
          </button>
        </div>

        <!-- Device Showcase -->
        <div class="device-showcase">
          <!-- Laptop Content -->
          <div class="device-content" v-if="activeTab === 'laptop'">
            <div class="device-card">
              <div class="device-header">
                <h3 class="device-title">Lenovo Thinkpad T460s</h3>
                <div class="device-badge">Primary</div>
              </div>

              <div class="device-body">
                <div class="device-image-container">
                  <img src="../assets/img/uses/laptop.jpg" alt="Lenovo Thinkpad T460s" class="device-image" />
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <p class="overlay-text">My daily driver for coding on the go</p>
                    </div>
                  </div>
                </div>

                <div class="device-info">
                  <div class="specs-grid">
                    <div class="spec-card">
                      <div class="spec-icon">⚡</div>
                      <div class="spec-details">
                        <h4 class="spec-title">Processor</h4>
                        <p class="spec-value">Intel Core i7</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">🧠</div>
                      <div class="spec-details">
                        <h4 class="spec-title">Memory</h4>
                        <p class="spec-value">16GB RAM</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">💾</div>
                      <div class="spec-details">
                        <h4 class="spec-title">Storage</h4>
                        <p class="spec-value">512GB SSD</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">🖥️</div>
                      <div class="spec-details">
                        <h4 class="spec-title">Display</h4>
                        <p class="spec-value">14" Full HD</p>
                      </div>
                    </div>
                  </div>

                  <div class="device-description">
                    <p>My reliable workhorse for coding, writing, and everyday tasks. Lightweight enough to carry around
                      but powerful enough for development work.</p>
                    <div class="device-features">
                      <span class="feature-tag">Portable</span>
                      <span class="feature-tag">Reliable</span>
                      <span class="feature-tag">Linux Compatible</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Content -->
          <div class="device-content" v-if="activeTab === 'desktop'">
            <div class="device-card">
              <div class="device-header">
                <h3 class="device-title">Custom Desktop PC</h3>
                <div class="device-badge">Workstation</div>
              </div>

              <div class="device-body">
                <div class="device-image-container">
                  <img src="../assets/img/uses/desktop.jpg" alt="Custom Desktop PC" class="device-image" />
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <p class="overlay-text">Powerhouse for development and design</p>
                    </div>
                  </div>
                </div>

                <div class="device-info">
                  <div class="specs-grid">
                    <div class="spec-card">
                      <div class="spec-icon">⚡</div>
                      <div class="spec-details">
                        <h4 class="spec-title">CPU</h4>
                        <p class="spec-value">Ryzen 5 5600G</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">🧠</div>
                      <div class="spec-details">
                        <h4 class="spec-title">RAM</h4>
                        <p class="spec-value">32GB DDR4</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">💾</div>
                      <div class="spec-details">
                        <h4 class="spec-title">SSD + HDD</h4>
                        <p class="spec-value">1TB NVMe + 2TB HDD</p>
                      </div>
                    </div>

                    <div class="spec-card">
                      <div class="spec-icon">🎮</div>
                      <div class="spec-details">
                        <h4 class="spec-title">GPU</h4>
                        <p class="spec-value">Radeon iGPU + GTX 1650</p>
                      </div>
                    </div>
                  </div>

                  <div class="device-description">
                    <p>High-performance setup for dev work, editing & gaming. Optimized for smooth multitasking.</p>
                    <div class="device-features">
                      <span class="feature-tag">Fast</span>
                      <span class="feature-tag">Powerful</span>
                      <span class="feature-tag">Versatile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- OS Section - Unchanged -->
      <section class="os-section">
        <div class="section-label">
          <span class="label-number">02</span>
          <h2 class="label-text">Operating Systems</h2>
        </div>

        <div class="os-grid">
          <div class="os-item">
            <div class="os-icon">
              <img src="../assets/img/uses/windows.png" alt="Windows 10" />
            </div>
            <div class="os-info">
              <h3 class="os-name">Windows 10</h3>
              <p class="os-device">Laptop</p>
            </div>
          </div>
          <div class="os-item">
            <div class="os-icon">
              <img src="../assets/img/uses/Linux.png" alt="Linux" />
            </div>
            <div class="os-info">
              <h3 class="os-name">Linux</h3>
              <p class="os-device">Desktop</p>
            </div>
          </div>
          <div class="os-item">
            <div class="os-icon">
              <img src="../assets/img/uses/ubuntu.png" alt="Ubuntu" />
            </div>
            <div class="os-info">
              <h3 class="os-name">Ubuntu</h3>
              <p class="os-device">Desktop</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Accessories Section - Unchanged -->
      <section class="accessories-section">
        <div class="section-label">
          <span class="label-number">03</span>
          <h2 class="label-text">Accessories</h2>
        </div>

        <div class="accessories-list">
          <div class="accessory-item">
            <div class="accessory-image">
              <img src="../assets/img/uses/smartphone.png" alt="Galaxy A16 5G" />
            </div>
            <div class="accessory-info">
              <h3 class="accessory-name">Galaxy A16 5G</h3>
              <p class="accessory-type">Smart Phone</p>
            </div>
          </div>
          <div class="accessory-item">
            <div class="accessory-image">
              <img src="../assets/img/uses/earbuds.png" alt="" />
            </div>
            <div class="accessory-info">
              <h3 class="accessory-name">AirPods Pro 2</h3>
              <p class="accessory-type">Earbuds</p>
            </div>
          </div>
          <div class="accessory-item">
            <div class="accessory-image">
              <img src="../assets/img/uses/Watch.png" alt="Forest" />
            </div>
            <div class="accessory-info">
              <h3 class="accessory-name">Forest</h3>
              <p class="accessory-type">Watch</p>
            </div>
          </div>
          <div class="accessory-item">
            <div class="accessory-image">
              <img src="../assets/img/uses/bottle.png" alt="THERMOS" />
            </div>
            <div class="accessory-info">
              <h3 class="accessory-name">THERMOS</h3>
              <p class="accessory-type">Drink Bottle</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tools Section - Unchanged -->
      <section class="tools-section">
        <div class="section-label">
          <span class="label-number">04</span>
          <h2 class="label-text">Development Tools</h2>
        </div>

        <div class="tools-categories">
          <div class="category">
            <h3 class="category-name">Code & Development</h3>
            <div class="tools-list">
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/vs-code.png" alt="VS Code" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">VS Code</h4>
                  <p class="tool-purpose">Code Editor</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/docker.png" alt="Docker" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Docker</h4>
                  <p class="tool-purpose">Containerization</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/git.png" alt="Git" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Git</h4>
                  <p class="tool-purpose">Version Control</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/theme.png" alt="Github Theme" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Github Theme</h4>
                  <p class="tool-purpose">Dark Theme</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/material.png" alt="Material" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Material</h4>
                  <p class="tool-purpose">Icon Theme</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/xampp.png" alt="Xampp" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Xampp</h4>
                  <p class="tool-purpose">Database</p>
                </div>
              </div>
            </div>
          </div>

          <div class="category">
            <h3 class="category-name">Design & Collaboration</h3>
            <div class="tools-list">
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/figma.png" alt="Figma" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Figma</h4>
                  <p class="tool-purpose">Design</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/postman.png" alt="Postman" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Postman</h4>
                  <p class="tool-purpose">API Testing</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/trello.png" alt="Trello" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Trello</h4>
                  <p class="tool-purpose">Project Management</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/coding/skype.png" alt="Skype" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Skype</h4>
                  <p class="tool-purpose">Communication</p>
                </div>
              </div>
            </div>
          </div>

          <div class="category">
            <h3 class="category-name">Testing & Infrastructure</h3>
            <div class="tools-list">
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/testing-tools/JMeter_Logo.png" alt="JMeter" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">JMeter</h4>
                  <p class="tool-purpose">Performance Testing</p>
                </div>
              </div>
              <div class="tool-item">
                <div class="tool-icon">
                  <img src="../assets/img/uses/testing-tools/pest.svg" alt="Pest" />
                </div>
                <div class="tool-info">
                  <h4 class="tool-name">Pest</h4>
                  <p class="tool-purpose">Testing Framework</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'UsesPage',
  data() {
    return {
      activeTab: 'laptop'
    };
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-primary);
  background-color: var(--color-bg);
  color: var(--text-color);
  line-height: 1.6;
}

.uses-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header */
.header {
  margin-bottom: 60px;
  position: relative;
}

.header-content {
  position: relative;
  display: inline-block;
}

.page-title {
  font-size: 5rem;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.title-decoration {
  position: absolute;
  bottom: 15px;
  left: 0;
  width: 100%;
  height: 12px;
  background-color: var(--theme);
  opacity: 0.3;
  z-index: 1;
}

/* Introduction */
.intro-section {
  margin-bottom: 80px;
}

.intro-text {
  font-size: 1.5rem;
  max-width: 800px;
  color: var(--grey);
  font-family: var(--font-secondary);
  font-style: italic;
}

/* Section Label */
.section-label {
  display: flex;
  align-items: baseline;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}

.label-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme);
  margin-right: 15px;
}

.label-text {
  font-size: 2rem;
  font-weight: 700;
}

/* NEW WORKSTATION SECTION STYLES */
.workstation-section {
  margin-bottom: 100px;
}

/* Device Tabs */
.device-showcase {
  padding: 40px;
  background: linear-gradient(to bottom, var(--color-bg), var(--highlight-gray));
  border-radius: 16px;
}

.device-tabs {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
}

.device-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background-color: var(--blackly);
  border: none;
  border-radius: 50px;
  color: var(--grey);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-tab.active {
  background-color: var(--theme);
  color: var(--white);
  box-shadow: 0 5px 15px rgba(14, 204, 150, 0.3);
}

.device-tab:hover:not(.active) {
  transform: translateY(-2px);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Device Card */
.device-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.device-header {
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.device-title {
  font-size: 1.8rem;
  font-weight: 700;
}

.device-badge {
  background-color: var(--blackly);
  color: var(--white);
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.device-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.device-image-container {
  position: relative;
  overflow: hidden;
  height: 100%;
  padding: 24px;
  background: linear-gradient(to bottom, var(--color-bg), var(--highlight-gray));
  border-radius: 20px;
}

.device-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease-in-out;
  border-radius: 20px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  padding: 32px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 20px;
}

.device-image-container:hover .image-overlay {
  opacity: 1;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.device-image-container:hover .device-image {
  transform: scale(1.05);
}

.overlay-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

.device-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.spec-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.spec-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(14, 204, 150, 0.1);
  border-radius: 10px;
}

.spec-title {
  font-size: 0.85rem;
  color: var(--grey);
  margin-bottom: 4px;
}

.spec-value {
  font-size: 1rem;
  font-weight: 600;
}

/* Device Description */
.device-description {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.device-description p {
  color: var(--grey);
  font-size: 1rem;
  line-height: 1.7;
}

.device-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-tag {
  background-color: rgba(14, 204, 150, 0.1);
  color: var(--theme);
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* OS Section */
.os-section {
  margin-bottom: 100px;
}

.os-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.os-item {
  background-color: var(--blackly);
  border-radius: 8px;
  padding: 30px;
  display: flex;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.os-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--theme);
}

.os-icon {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.os-icon img {
  max-width: 100%;
  max-height: 100%;
}

.os-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.os-device {
  color: var(--grey);
  font-size: 0.9rem;
}

/* Accessories Section */
.accessories-section {
  margin-bottom: 100px;
}

.accessories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.accessory-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1/1;
}

.accessory-image {
  width: 100%;
  height: 100%;
  background-color: var(--highlight-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.accessory-image img {
  max-width: 60%;
  max-height: 60%;
  transition: all 0.3s ease;
}

.accessory-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: var(--white);
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.accessory-item:hover .accessory-info {
  transform: translateY(0);
}

.accessory-item:hover .accessory-image {
  transform: scale(1.05);
}

.accessory-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.accessory-type {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Tools Section */
.tools-section {
  margin-bottom: 80px;
}

.tools-categories {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 4px solid var(--theme);
}

.tools-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.tool-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: var(--blackly);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.tool-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 50px;
  height: 50px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--highlight-gray);
  border-radius: 8px;
  padding: 10px;
}

.tool-icon img {
  max-width: 100%;
  max-height: 100%;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
}

.tool-purpose {
  color: var(--grey);
  font-size: 0.85rem;
}

/* Responsive */
@media (max-width: 992px) {
  .page-title {
    font-size: 4rem;
  }

  .device-body {
    grid-template-columns: 1fr;
  }

  .os-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 3rem;
  }

  .intro-text {
    font-size: 1.25rem;
  }

  .label-text {
    font-size: 1.75rem;
  }

  .device-title {
    font-size: 1.5rem;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 2.5rem;
  }

  .title-decoration {
    height: 8px;
    bottom: 10px;
  }

  .label-number {
    font-size: 1.25rem;
  }

  .label-text {
    font-size: 1.5rem;
  }

  .device-tabs {
    flex-direction: column;
    align-items: center;
  }

  .device-tab {
    width: 100%;
    justify-content: center;
  }

  .device-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .accessories-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .tools-list {
    grid-template-columns: 1fr;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .spec-icon {
    background-color: rgba(0, 230, 165, 0.1);
  }

  .feature-tag {
    background-color: rgba(0, 230, 165, 0.1);
  }

  .os-item,
  .tool-item {
    background-color: var(--blackly);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .tool-icon {
    background-color: var(--blackly);
  }

  .accessory-image {
    background-color: var(--blackly);
  }
}
</style>