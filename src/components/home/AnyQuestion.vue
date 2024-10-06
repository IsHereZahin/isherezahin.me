<template>
    <div class="relative rounded-xl p-1" ref="cardsRef">    
        <div class="flex flex-col gap-6 rounded-[11px] p-4 lg:p-6">
            <div class="row gap-12">
                <div class="col-md-6 relative size-64 max-md:mx-auto" ref="scope">
                    <img width="3975" height="3975" src="../../assets/img/qu.jpg" class="image" alt="Me sit in front of my desk and coding"/>
                    <div id="selenium" class="selenium bottom-12 left-14 px-2">Selenium</div>
                    <div id="vue-js" class="vue-js left-2 top-20 px-2">Vue.js</div>
                    <div id="laravel" class="laravel bottom-20 right-1 px-2">Laravel</div>
                    <div id="ui-ux" class="ui-ux right-8 top-10 px-2">UI/UX</div>
        
                    <div id="pointer" class="absolute">
                        <svg width="16.8" height="18.2" viewBox="0 0 12 13" class="fill-red-500" stroke="white" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"/>
                        </svg>
                        <span class="relative left-4 rounded-3xl bg-red-500 px-2 py-0.5 text-xs text-white">
                            isherezahin
                        </span>
                    </div>
                </div>

                <div class="col-md-6 flex flex-col justify-center px-4">
                    <p class="font-title mb-2 bg-gradient-to-r from-black to-black/70 bg-clip-text text-3xl font-bold text-transparent dark:from-zinc-100 dark:to-zinc-400">
                        Any questions about software?
                    </p>
                    <p class="text-zinc-800 dark:text-zinc-300">
                        Feel free to reach out to me! 
                        <span class="text-muted-foreground">I'm unavailable for collaboration.</span>
                    </p>
                    <div class="my-8">
                        <a href="mailto:isherezahin@gmail.com" class="bg-email-button rounded-full px-4 py-2 text-sm text-white">
                            isherezahin@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<!-- <script>
export default {
  mounted() {
    const pointer = this.$refs.scope.querySelector('#pointer');
    const skills = ['selenium', 'vue-js', 'laravel', 'ui-ux'];

    skills.forEach(skill => {
      const element = this.$refs.scope.querySelector(`#${skill}`);
      element.addEventListener('mouseover', (e) => this.movePointer(e, pointer));
    });
  },
  methods: {
    movePointer(event, pointer) {
        const skill = event.target;
        const rect = skill.getBoundingClientRect();
        const pointerRect = pointer.getBoundingClientRect();

        // Calculate the fixed position to move the pointer to
        const top = rect.top + (rect.height / 2) - (pointerRect.height / 2) - 315;
        const left = rect.left + (rect.width / 2) - (pointerRect.width / 2) - 420;

        pointer.style.transform = `translate(${left}px, ${top}px)`;
    }
    }
}
</script> -->
<style scoped>
.image {
    position: absolute;
    right: auto;
    left: 50%;
    top: 48%;
    transform: translate(-50%, -50%);
    opacity: 0.6;
    border-radius: 20px;
    width: 5rem;
    height: 5rem;
}

.relative {
    position: relative;
}

.rounded-xl {
    border-radius: 0.75rem;
}

.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.rounded-\[11px\] {
    border-radius: 11px;
}

.gap-12 {
    gap: 3rem;
}

.max-md\:flex-col {
    flex-direction: column;
}

.size-64 {
    width: 16rem;
    height: 16rem;
}

.max-md\:mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.absolute {
    position: absolute;
    transition: transform 0.5s ease;
}

.left-1\/2 {
    left: 50%;
}

.top-1\/2 {
    top: 50%;
}

.-translate-x-1\/2 {
    transform: translateX(-50%);
}

.-translate-y-1\/2 {
    transform: translateY(-50%);
}

.rounded-\[20px\] {
    border-radius: 20px;
}

.bottom-12 {
    bottom: 3rem;
}

.left-14 {
    left: 3.5rem;
}

.rounded-3xl {
    border-radius: 1.5rem;
}

.px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.text-xs {
    font-size: 0.75rem;
}

.selenium,
.vue-js,
.laravel,
.ui-ux {
    opacity: 1;
    font-size: 0.75rem;
    border-radius: 1.5rem;
    position: absolute;
    cursor: pointer;
    color: var(--white);
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.5s ease;
    transform: scale(1.1);
}

.selenium {
    color: #00bb00;
    background-color: rgba(0, 187, 0, 0.1);
}

.vue-js {
    color: #42b883;
    background-color: rgba(66, 184, 131, 0.1);
}

.laravel {
    color: #ff2d20;
    background-color: rgba(255, 45, 32, 0.1);
}

.ui-ux {
    color: #1d4ed8;
    background-color: rgba(29, 78, 216, 0.1);
}
.selenium:hover,
.vue-js:hover,
.laravel:hover,
.ui-ux:hover {
    transform: scale(1.3);
    opacity: 0.9;
    background-color: rgba(179, 182, 181, 0.2);
}

.left-2 {
    left: 0.5rem;
}

.top-20 {
    top: 5rem;
}

.bottom-20 {
    bottom: 5rem;
}

.right-1 {
    right: 0.25rem;
}

.right-8 {
    right: 2rem;
}

.top-10 {
    top: 2.5rem;
}

.fill-red-500 {
    fill: var(--rad);
}

.stroke-width-1 {
    stroke-width: 1;
}

.left-4 {
    left: 1rem;
}

.bg-red-500 {
    background-color: var(--rad);
}

.px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 0.75rem;
}

.justify-center {
    justify-content: center;
}

.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
}

.font-title {
    font-family: var(--font-title);
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-black {
    --tw-gradient-from: var(--color-bg);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 0, 0, 0));
}

.to-black\/70 {
    --tw-gradient-to: var(--color-bg);
}

.bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
}

.text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
}

.font-bold {
    font-weight: 700;
}

.text-transparent {
    color: transparent;
}

.dark\:from-zinc-100 {
    --tw-gradient-from: var(--text);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(245, 245, 245, 0));
}

.dark\:to-zinc-400 {
    --tw-gradient-to: var(--grey);
}

.text-zinc-800 {
    color: var(--blackly);
}

.dark\:text-zinc-300 {
    color: var(--grey);
}

.text-muted-foreground {
    color: var(--blackly);
}

.my-8 {
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.bg-email-button {
    border: 1px solid #ef4444;
    background-color: #ef4444;
}

.bg-email-button:hover {
    border: 1px solid var(--text);
    background-color: #2F415E;
}

.rounded-full {
    border-radius: 9999px;
}

.px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
}

.py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}

.text-sm {
    font-size: 0.875rem;
}
</style>
