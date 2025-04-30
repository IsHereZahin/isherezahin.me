<template>
  <div class="portfolio-container">
    <!-- Code Editor View (shown first) -->
    <div v-if="animationStage === 'code'" class="code-editor-container">
      <div class="code-editor">
        <div class="editor-header">
          <div class="editor-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="editor-title">PortfolioIntro.vue</div>
        </div>
        <div class="editor-content-wrapper">
          <div class="line-numbers">
            <div v-for="n in 10" :key="n" class="line-number">{{ n }}</div>
          </div>
          <pre
            class="editor-content"><code>{{ displayedCode }}</code><span class="cursor" v-if="animationStage === 'code'"></span></pre>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${typingProgress}%` }"></div>
      </div>
    </div>

    <!-- Terminal View (shown after code) -->
    <div v-else-if="animationStage === 'terminal'" class="terminal-container">
      <div class="terminal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="terminal-title">terminal</div>
        </div>
        <div class="terminal-content">
          <div class="terminal-line">
            <span class="terminal-prompt">zahin@portfolio:~$</span>
            <span class="terminal-command">{{ terminalCommand }}</span>
          </div>
          <div v-if="showNpmOutput" class="terminal-output">
            <div class="npm-line" v-for="(line, index) in visibleNpmOutputLines" :key="index" v-html="line"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual Portfolio View (shown after animation) -->
    <section v-else class="min-vh-100 d-flex align-items-center py-5 animate-fade-in">
      <div class="container">
        <div class="row g-5 align-items-center">
          <div class="col-lg-7">
            <header class="animate-fade-in">
              Hello! I'm Zahin, a
              <span class="sky-bg">developer</span> based in
              Bangladesh.
            </header>
            <div class="mt-4">
              <p>
                I specialize in building <span class="text-user-bg">user-friendly</span>,
                <span class="text-user-bg">efficient</span>, and
                <span class="text-user-bg">scalable</span> web applications.
                My philosophy? Technology should simplify life, not complicate it.
              </p>
              <p>
                I started learning to code in <span class="soft-bg">2019</span> when I was
                <span class="soft-bg">16</span>. Over time, I turned it into a career. Today, I work extensively with
                <span class="highlighted-text-front-end">Laravel</span>,
                <span class="green-bg">Vue.js</span>,
                <span class="docker" style="font-weight: 500;">Docker</span>,
                <span class="nextjs" style="font-weight: 500;">Next.js</span>, and
                <span class="sky-bg" style="font-weight: 500;">React.js</span>.
              </p>
              <p>
                I'm currently working at
                <a href="https://www.iconicsolutionsbd.com/" target="_blank" class="sky-bg">
                  Iconic Solutions Pvt. Ltd.</a>
              </p>
              <p>
                Feel free to drop me a message or say hello on my
                <router-link to="/guestbook" exact-active-class="active-link" class="guestbook-bg"
                  style="background-color: #fef9c3; color: #272727;">GuestBook</router-link>.
                I'd love to connect!
              </p>
            </div>
            <div class="mt-4 d-flex flex-wrap gap-3 animate-fade-in">
              <a href="https://drive.google.com/uc?export=download&id=1BKimrEZ4-U5x-n52vnIiTmtvIv-_-fzn"
                class="custom-btn">Download Resume</a>
              <a href="https://github.com/isherezahin" target="_blank" class="custom-btn">View GitHub</a>
            </div>
          </div>
          <div class="col-lg-5 text-center">
            <img src="../../assets/img/me/home-image.jpg" alt="Profile" class="img-fluid rounded-3"
              style="width: 70%; height: auto; object-position: center;" />
          </div>
        </div>
      </div>
      <img src="../../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animationStage: 'code',
      terminalCommand: '',
      showNpmOutput: false,
      npmOutputIndex: 0,
      visibleNpmOutputLines: [],
      npmOutputLines: [
        '> npm run dev',
        '',
        '> isherezahin.me@0.0.0 dev',
        '> vite',
        '',
        '',
        '  <span class="npm-info">VITE v5.4.14</span>  ready in 543 ms',
        '',
        '  <span class="npm-success">➜</span>  Local:   <span class="npm-url">http://localhost:5173/</span>',
        '  <span class="npm-success">➜</span>  Network: <span class="npm-url">http://192.168.11.25:5173/</span>',
        '  <span class="npm-success">➜</span>  Vercel: <span class="npm-url">https://isherezahin.vercel.app/</span>',
        '  <span class="npm-success">➜</span>  Netlify: <span class="npm-url">https://isherezahin.netlify.app/</span>'
      ],
      npmOutputInterval: null,
      typingProgress: 0,
      displayedCode: '',
      currentCodeIndex: 0,
      fullCode: `<template>
  <header class="animate-fade-in">
    Hello! I'm Zahin, a developer based in Bangladesh.
  </header>
  
  <div class="mt-4">
    <p>
      I'm currently working at Iconic Solutions Pvt. Ltd.
    </p>
  </div>
</template>`,
      typingSpeed: 80,
      typingTimeout: null
    }
  },
  mounted() {
    this.typeNextCharacter();
  },
  methods: {
    typeNextCharacter() {
      if (this.currentCodeIndex < this.fullCode.length) {
        this.displayedCode = this.fullCode.substring(0, this.currentCodeIndex + 1);
        this.currentCodeIndex++;

        this.typingProgress = (this.currentCodeIndex / this.fullCode.length) * 100;

        let delay;

        if (this.fullCode[this.currentCodeIndex - 1] === '\n') {
          delay = 60 + Math.random() * 20;
        } else if (this.fullCode[this.currentCodeIndex - 1] === '>') {
          delay = 35 + Math.random() * 15;
        } else if (this.fullCode[this.currentCodeIndex - 1] === ' ') {
          delay = 20 + Math.random() * 8;
        } else {
          delay = 15 + Math.random() * 20;
        }

        if (Math.random() < 0.01) {
          delay += 100 + Math.random() * 50;
        }

        this.typingTimeout = setTimeout(this.typeNextCharacter, delay);
      } else {
        setTimeout(() => {
          this.animationStage = 'terminal';
          this.startTerminalAnimation();
        }, 200);
      }
    },

    startTerminalAnimation() {
      let currentIndex = 0;
      const command = 'npm run dev';

      const typeTerminal = () => {
        if (currentIndex < command.length) {
          this.terminalCommand = command.substring(0, currentIndex + 1);
          currentIndex++;
          setTimeout(typeTerminal, 80 + Math.random() * 30);
        } else {
          setTimeout(() => {
            this.showNpmOutput = true;
            this.animateNpmOutput();
          }, 400);
        }
      };

      typeTerminal();
    },

    animateNpmOutput() {
      const showNextLine = () => {
        if (this.npmOutputIndex < this.npmOutputLines.length) {
          this.visibleNpmOutputLines.push(this.npmOutputLines[this.npmOutputIndex]);
          this.npmOutputIndex++;

          let delay = 120;
          if (this.npmOutputLines[this.npmOutputIndex - 1] === '') {
            delay = 70;
          } else if (this.npmOutputIndex > 6) {
            delay = 170;
          }

          setTimeout(showNextLine, delay);
        } else {
          setTimeout(() => {
            this.animationStage = 'portfolio';
          }, 1200);
        }
      };

      showNextLine();
    }
  },
  beforeUnmount() {
    clearTimeout(this.typingTimeout);
  }
}
</script>

<style scoped>
header {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
}

.sky-bg {
  background-color: var(--highlight-blue);
  padding: 0 0.25rem;
  font-weight: 700;
}

.docker {
  background-color: var(--highlight-bluer);
  padding: 0 0.25rem;
  font-weight: 700;
}

.nextjs {
  background-color: var(--blackly);
  padding: 0 0.25rem;
  font-weight: 700;
}

.text-user-bg {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

.highlighted-text-front-end {
  background-color: var(--highlight-pink);
  padding: 0 0.25rem;
}

.green-bg {
  background-color: var(--highlight-green);
  padding: 0 0.25rem;
}

.soft-bg {
  background-color: var(--highlight-gray);
  color: var(--text-color);
  padding: 0 0.25rem;
}

.guestbook-bg {
  background-color: var(--highlight-yellow);
  padding: 0 0.25rem;
}

/* Fade-in Animation */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Button Styles */
.custom-btn {
  color: white;
  font-weight: 400;
  text-decoration: none;
  padding: 0.5rem 2rem;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent), var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
  border-radius: 50px;
  background-color: var(--button-bg);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-btn:hover {
  background-color: var(--button-bg-hover);
}

.text-decoration-line-through {
  color: var(--cut);
}

/* Hover Animation for Images */
.img-fluid {
  transition: transform 0.3s ease-in-out;
}

.img-fluid:hover {
  cursor: pointer;
  transform: scale(1.05);
}

/* Animation Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0px);
  }
}

/* Code Editor Styles */
.portfolio-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-editor-container {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out forwards;
}

.code-editor {
  background-color: #0d1117;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #30363d;
}

.editor-header {
  background-color: #161b22;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #30363d;
}

.editor-dots {
  display: flex;
  gap: 6px;
  margin-right: 15px;
}

.editor-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.editor-dots span:nth-child(1) {
  background-color: #ff5f56;
}

.editor-dots span:nth-child(2) {
  background-color: #ffbd2e;
}

.editor-dots span:nth-child(3) {
  background-color: #27c93f;
}

.editor-title {
  color: #c9d1d9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.editor-content-wrapper {
  display: flex;
  height: 250px;
  overflow: hidden;
}

.line-numbers {
  padding: 15px 0;
  background-color: #0d1117;
  border-right: 1px solid #30363d;
  text-align: right;
  user-select: none;
}

.line-number {
  color: #6e7681;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 0 10px;
}

.editor-content {
  padding: 15px;
  margin: 0;
  color: #c9d1d9;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre;
  flex: 1;
}

.progress-bar {
  height: 4px;
  background-color: #161b22;
  margin-top: 10px;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: var(--theme, #58a6ff);
  transition: width 0.1s linear;
}

/* Cursor Animation */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #c9d1d9;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  from,
  to {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* Terminal Styles - More Realistic */
.terminal-container {
  width: 90%;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out forwards;
}

.terminal {
  background-color: #0c0c0c;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid #2a2a2a;
}

.terminal-header {
  background-color: #1f1f1f;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #2a2a2a;
}

.terminal-dots {
  display: flex;
  gap: 6px;
  margin-right: 15px;
}

.terminal-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dots span:nth-child(1) {
  background-color: #ff5f56;
}

.terminal-dots span:nth-child(2) {
  background-color: #ffbd2e;
}

.terminal-dots span:nth-child(3) {
  background-color: #27c93f;
}

.terminal-title {
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.terminal-content {
  padding: 15px;
  color: #e0e0e0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
  font-size: 14px;
  min-height: 300px;
  background-color: #0c0c0c;
}

.terminal-line {
  display: flex;
  margin-bottom: 10px;
}

.terminal-prompt {
  color: #4ade80;
  margin-right: 8px;
}

.terminal-command {
  color: #f0f0f0;
  position: relative;
}

.terminal-command::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 15px;
  background-color: #f0f0f0;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

.terminal-output {
  margin-top: 15px;
  color: #f0f0f0;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.npm-line {
  margin-bottom: 5px;
  animation: fadeIn 0.3s ease-out forwards;
}

.npm-info {
  color: #38bdf8;
  font-weight: bold;
}

.npm-success {
  color: #4ade80;
  font-weight: bold;
}

.npm-url {
  color: #c084fc;
  text-decoration: underline;
}

.npm-key {
  color: #fbbf24;
  font-weight: bold;
  padding: 2px 5px;
  background-color: #374151;
  border-radius: 3px;
}

/* Media Queries */
@media (max-width: 570px) {
  .img-fluid {
    width: 60% !important;
    height: auto;
  }

  header {
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 600;
  }

  .editor-content,
  .terminal-content {
    font-size: 12px;
  }
}

@media (max-width: 450px) {
  .img-fluid {
    width: 90% !important;
    height: auto;
  }

  .code-editor-container,
  .terminal-container {
    width: 95%;
  }
}

@media (max-width: 991px) {
  section {
    margin-top: 5vh;
  }
}
</style>