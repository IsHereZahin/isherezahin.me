<template>
    <div class="relative rounded-xl p-1" ref="cardsRef">    
        <div class="d-flex flex-column gap-4 rounded custom-padding">
            <div class="row gap-4">
                <div class="col-md-6 position-relative custom-size mx-auto">
                    <img src="../../assets/img/qu.jpg" alt="Me sit in front of my desk and coding" class="image">
                    <div id="next-js" class="next-js tool">Next.js</div>
                    <div id="vue-js" class="vue-js tool">Vue.js</div>
                    <div id="laravel" class="laravel tool">Laravel</div>
                    <div id="react-js" class="react-js tool">React.js</div>

                    <div id="pointer" class="pointer">
                        <svg width="16.8" height="18.2" viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"/>
                        </svg>
                        <span class="pointer-label">
                            isherezahin
                        </span>
                    </div>
                </div>

                <div class="col-md-6 d-flex flex-column justify-content-center custom-padding">
                    <p class="fw-bold mb-2 gradient-text">
                        Any questions about software?
                    </p>
                    <p class="reach-out">
                        Feel free to reach out to me! 
                        <span class="coll-text">I'm available for collaboration.</span>
                    </p>
                    <div class="my-4">
                        <a href="mailto:isherezahin@gmail.com" class="mail-button">
                            isherezahin@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    border-radius: 20px;
    width: 5rem;
    height: 5rem;
}

.custom-padding {
    padding: 24px;
}

.custom-size {
    width: 16rem;
    height: 16rem;
}

.tool {
    position: absolute;
    padding: 1px 8px;
    border-radius: 24px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: transform 0.5s ease-out, opacity 0.5s ease-out, background-color 0.5s ease-out;
}

.tool.hover {
    transform: scale(1.2);
    opacity: 0.9;
    background-color: rgba(179, 182, 181, 0.2);
}

.next-js {
    bottom: 48px;
    left: 56px;
    color: var(--white);
    background-color: rgba(0, 187, 0, 0.1);
}

.vue-js {
    top: 80px;
    left: 8px;
    color: #42b883;
    background-color: rgba(66, 184, 131, 0.1);
}

.laravel {
    bottom: 80px;
    right: 4px;
    color: #ff2d20;
    background-color: rgba(255, 45, 32, 0.1);
}

.react-js {
    top: 40px;
    right: 32px;
    color: #61dafb;
    background-color: rgba(29, 78, 216, 0.1);
}

.pointer {
    position: absolute;
    transition: transform 0.5s ease;
}

.pointer svg {
    fill: #f00;
    stroke: #fff;
    stroke-width: 1;
}

.pointer-label {
    position: relative;
    left: 16px;
    border-radius: 1.5rem;
    background-color: #f00;
    padding: 2px 4px;
    font-size: 0.75rem;
    color: #fff;
}

/* Light mode gradient */
.gradient-text {
    background-image: linear-gradient(to right, #434343, #616161, #a0a0a0);
    color: transparent;
    background-clip: text;
    font-size: 1.875rem;
    line-height: 2.25rem;
}

/* Dark mode gradient */
@media (prefers-color-scheme: dark) {
    .gradient-text {
        background-image: linear-gradient(to right, #e9e7e7, #afaeae, #666666); /* Dark mode titanium gradient */
    }
}

.reach-out {
    color: (--white);
}


.coll-text {
    color: var(--grey);
}

.mail-button {
    color: white !important;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    background-color: #ef4444;
    transition: 0.3s ease;
    border: 1px solid #ef4444;
}

.mail-button:hover {
    background-color: var(--button-bg-hover);
    border: 1px solid var(--button-bg-hover);
}
</style>

<script>
export default {
    mounted() {
        this.autoHover();
    },
    methods: {
        autoHover() {
            const tools = document.querySelectorAll('.tool');
            const pointer = document.querySelector('#pointer');
            const container = document.querySelector('.col-md-6.position-relative.custom-size.mx-auto');
            
            let index = 0;
            const interval = 2000; // Time to stay on each tool in milliseconds
            const hoverDelay = 300;

            const movePointer = () => {
                if (index >= tools.length) {
                    index = 0; // Reset the pointer to the first tool
                }

                const tool = tools[index];
                const toolRect = tool.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Calculate offsets relative to the container
                const topOffset = toolRect.top - containerRect.top + toolRect.height / 2;
                const leftOffset = toolRect.left - containerRect.left + toolRect.width / 2;

                pointer.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out, background-color 0.5s ease-out';
                pointer.style.transform = `translate(${leftOffset}px, ${topOffset}px)`;

                // Remove hover effect from all tools
                tools.forEach((t) => t.classList.remove('hover'));

                // Add hover effect to the current tool after the delay
                setTimeout(() => {
                    tool.classList.add('hover');
                }, hoverDelay);

                index++;
            };

            movePointer();
            setInterval(movePointer, interval);
        },
    },
};
</script>
