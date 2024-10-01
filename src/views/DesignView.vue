<template>
    <main id="main">
        <section id="project" style="margin-top: 70px">
            <div class="container">
                <!-- Page Head -->
                <div class="row page-head gap-2">
                    <h1 class="white-head fw-bold text-green-800 theme-color">Website's Design</h1>
                    <p>This website was made with <span style="color: var(--rad);">❤️</span>. <br>I have mentioned all the languages and tools that I used to create this website on this page. The theme colors of this website are also listed.</p>
                    <hr class="bg-light" />
                </div>
                <img src="../assets/img/home/about-shape-3.svg" loading="lazy" alt="" class="shape shape-3">
                <div class="content p-5">
                    <div class="row">
                        <h3 class="scroll-m-32 white-head">Inspiration</h3>
                        <p class="mb-5">
                            For this website Special thanks to 
                            <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://honghong.me/">Hong</a>, 
                            <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://bootstrapmade.com/">Bootstrap Made</a> and
                            <a class="tech-color" target="_blank" rel="noopener noreferrer" href="https://theodorusclarence.com/">Clarence</a>
                            for their inspiring portfolio designs. Their work greatly influenced my own creation. While I made significant customizations, 
                            their designs were a fantastic starting point :)
                        </p>
                    </div>
                    <div class="row">
                        <h4 class="scroll-m-32 white-head text-decoration-none">Languages & Tools</h4>
                        <p>I was using this tool and language to build this website.</p>
                        <div class="tech-stack">
                            <div class="tech">
                                <img src="https://skillicons.dev/icons?i=html" alt="HTML"/>
                                <div class="tooltip"><span class="tech-name">HTML:</span> The standard markup language for creating web pages.</div>
                            </div>
                            <div class="tech">
                                <img src="https://skillicons.dev/icons?i=css" alt="CSS"/>
                                <div class="tooltip"><span class="tech-name">CSS:</span> A style sheet language used for describing the presentation of a document written in HTML.</div>
                            </div>
                            <div class="tech">
                                <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js"/>
                                <div class="tooltip"><span class="tech-name">Node.js:</span> A JavaScript runtime built on Chrome's V8 JavaScript engine.</div>
                            </div>
                            <div class="tech">
                                <img src="https://skillicons.dev/icons?i=vue" alt="Vue.js"/>
                                <div class="tooltip"><span class="tech-name">Vue.js:</span> A progressive framework for building user interfaces.</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <h4 class="scroll-m-32 white-head text-decoration-none mt-5">Color Palette</h4>
                        <div class="row">
                            <div data-fade="2" class="mt-3 rounded p-4 border-2 border-dashed border-gray-300">
                                <div class="flex items-end justify-between">
                                    <h2 class="capitalize">Uses Color</h2>
                                    <button class="rounded-md border text-lg">
                                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                        </svg>
                                    </button>
                                </div>
                                <p class="mt-1 text-sm text-gray-600">Font Family: Open Sans</p>
                                <div class="grid sm:grid-cols-2">
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 bg-white"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Light</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 bg-dark"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Dark</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 theme"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Theme</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 border-color"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Border</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 text-color"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Text Color</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 blackly"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Blackly</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 danger"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Danger</p>
                                        </div>
                                    </div>
                                    <div class="mt-4 flex items-center gap-2">
                                        <div class="h-10 w-10 rounded shadow-sm border border-gray-300 shrink-0 gradient"></div>
                                        <div class="flex-col">
                                            <p class="color-name">Gradient</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<style>
.tech-stack {
    justify-content: left;
}
.mt-8 {
    margin-top: 2rem;
}
.rounded {
    border-radius: 0.375rem;
}
.p-4 {
    padding: 1rem;
}
.color-name {
    margin-top: 8px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    display: block;
}
.border-2 {
    border-width: 2px;
}
.border-dashed {
    border-style: dashed;
}
.border-gray-300 {
    border-color: var(--blackly);
}
.dark\:border-gray-600 {
    border-color: #718096;
}
.capitalize {
    color: var(--white);
    text-transform: capitalize;
}
.flex {
    display: flex;
}
.items-end {
    align-items: flex-end;
}
.justify-between {
    justify-content: space-between;
}
.rounded-md {
    border-radius: 0.375rem;
}
.p-2 {
    padding: 0.5rem;
}
.focus\:outline-none {
    outline: none;
}
.border {
    border-width: 1px;
}
.text-lg {
    font-size: 1.125rem;
}
.text-sm {
    font-size: 0.875rem;
}

.grid {
    display: grid;
}
.sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.h-10 {
    height: 2.5rem;
}
.w-10 {
    width: 2.5rem;
}
.shadow-sm {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.dark\:shadow-none {
    box-shadow: none;
}
.bg-white {
    background-color: var(--white);
}
.bg-dark {
    background-color: var(--color-bg);
}
.theme {
    background-color: var(--theme);
}
.border-color {
    background-color: var(--border);
}
.text-color {
    background-color: var(--text);
}
.blackly {
    background-color: var(--blackly);
}
.danger {
    background-color: var(--rad);
}
.gradient {
    background-image: linear-gradient(to right, #02a963, #00bfff);
}
</style>
