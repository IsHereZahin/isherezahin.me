<template>
  <main>
    <section id="guestbook" style="margin-top: 70px">
      <div class="container">
        <!-- Page Head -->
        <div class="row page-head gap-2">
          <h1 class="white-head fw-bold text-green-800">Guestbook</h1>
          <p>Welcome to my Guestbook! You can tell me anything here!</p>
        </div>
          <PostMessage />
      </div>
    </section>
  </main>
</template>

<script>
import PostMessage from '../components/GuestBook.vue';

export default {
  components: { PostMessage}
};
</script>
