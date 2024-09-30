<template>
  <div class="container">
    <div class="custom_container">
      <div class="custom_header">
        <!-- SVG icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin size-4" style="transform: rotate(30deg);">
          <line x1="12" x2="12" y1="17" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 1 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
        Pinned
      </div>
      <div>
        Thank you for visiting my website. I would greatly appreciate any feedback you might have on my work. Please feel free to leave a comment. Thank you!
      </div>
    </div>

    <div v-if="!user" class="btn-login">
      <button class="login-button gap-2" @click="signInWithGithub">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="mr-2" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        <span>Login</span>
      </button>
      <p>to continue leaving a message</p>
    </div>

    <div v-if="user" class="auth_user_data">
      <p>Logged in as <span class="display_name">{{ user.displayName || user.email }}</span></p>

      <div class="comment-form">
        <textarea v-model="message" placeholder="Write your message here..." class="form-textarea" required></textarea>
        <div class="post-btn">
          <button @click="logout" class="action-button">Logout</button>
          <button @click="postMessage" class="action-button" :disabled="isPostButtonDisabled">Post Comment</button>
        </div>
        <p v-if="warning" class="alert alert-warning">Warning: You cannot post an empty comment.</p>
        <p v-if="success" class="alert alert-success">Comment posted successfully!</p>
      </div>
    </div>

    <div class="comments-list" v-if="messages.length">
      <div v-for="message in messages" :key="message.id" class="comment">
        <div class="comment-header">
          <img class="avatar" :src="message.avatar" alt="User Avatar">
          <div class="comment-info">
            <span class="comment-author">
              {{ message.displayname }}
              <div class="verified-container">
                <img v-if="message.verified" src="/src/assets/img/testimonials/verified.png" height="22" width="22" alt="Verified" class="verified-icon">
                <span class="tooltip-text">Verified user</span>
              </div>
            </span>
          </div>
          <span class="comment-timestamp">{{ formatDate(message.time) }}</span>
        </div>
        <div class="comment-body" v-html="formatComment(message.message)"></div>

        <!-- Show delete button if the logged-in user is the owner of the comment -->
        <div class="comment-actions" v-if="user && (user.email === message.email || isAdmin(user.email) || isModerator(user.email))">
          <button @click="deleteComment(message.id)" class="btn btn-danger btn-sm delete-button">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <p v-else>No comments yet. Be the first to leave one!</p>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { auth, provider, signInWithPopup, signOut, db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from '../firebase'; // Import necessary Firebase methods

export default {
  data() {
    return {
      user: null,
      message: '',
      messages: [],
      warning: false,
      success: false,
    };
  },
  computed: {
    isPostButtonDisabled() {
      return this.message.trim() === '';
    }
  },
  methods: {
    async signInWithGithub() {
      try {
        const result = await signInWithPopup(auth, provider);
        this.user = result.user;
      } catch (error) {
        console.error("GitHub Sign-in Error:", error);
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        console.error("Sign out Error:", error);
      }
    },
    async postMessage() {
      if (!this.message.trim()) {
        this.warning = true;
        setTimeout(() => (this.warning = false), 2000);
        return;
      }
      
      const newMessage = {
        message: this.message,
        displayname: this.user.displayName || this.user.email,
        email: this.user.email,
        avatar: this.user.photoURL || '/public/manavatar.jpg',
        verified: this.user.emailVerified,
        time: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, 'messages'), newMessage);
        this.success = true;
        this.message = '';
        setTimeout(() => (this.success = false), 2000);
      } catch (error) {
        console.error('Error posting message:', error);
      }
    },
    async deleteComment(commentId) {
      try {
        // Display the SweetAlert confirmation dialog with dark theme
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You won’t be able to undo this!',
          icon: 'warning',
          iconColor: '#f8bb86', // Customize the icon color for dark theme
          background: '#333', // Dark background
          color: '#fff', // Text color
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
        });

        // If the user confirms, proceed with the deletion
        if (result.isConfirmed) {
          await deleteDoc(doc(db, 'messages', commentId));
          
          // Show success message with dark theme
          Swal.fire({
            title: 'Deleted!',
            text: 'The comment has been deleted.',
            icon: 'success',
            background: '#333',
            color: '#fff',
            iconColor: '#a5dc86', // Success icon color
          });
        }
      } catch (error) {
        // Show error message with dark theme
        Swal.fire({
          title: 'Error',
          text: 'There was an error deleting the comment.',
          icon: 'error',
          background: '#333',
          color: '#fff',
          iconColor: '#f27474', // Error icon color
        });
        console.error('Error deleting comment:', error);
      }
    },
    formatDate(timestamp) {
      if (timestamp) {
        const date = timestamp.toDate();
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
      }
      return '';
    },
    formatComment(text) {
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      const specialUrls = new Set([
        'https://example.com/liked-url', // Example of a special URL to highlight
      ]);

      return text.replace(urlPattern, (url) => {
        const isSpecial = specialUrls.has(url);
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${isSpecial ? 'highlight-url' : ''}">${url}</a>`;
      });
    },
    fetchMessages() {
      const q = query(collection(db, 'messages'), orderBy('time', 'desc'));
      onSnapshot(q, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            message: data.message,
            displayname: data.displayname,
            avatar: data.avatar,
            time: data.time,
            verified: data.verified,
            email: data.email, // Include email to check ownership
          };
        });
      });
    },
    isAdmin(email) {
      return email === "abuzahinmohammadnowsin@gmail.com";
    },
    isModerator(email) {
      return email === "isherezahin@gmail.com";
    }
  },
  mounted() {
    this.fetchMessages();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      }
    });
  }
};
</script>

<style scoped>
.custom_container {
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(to right, #02a963, #00bfff) 5%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 0.5px solid var(--border);
}

.custom_header {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.display_name {
  color: var(--theme);
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: center;
  gap: 10px;
  padding: 1rem 1rem 1rem 0rem;
}
.auth_user_data {
  padding: 1rem 1rem 1rem 0rem;
}

.login-button {
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  border: 2px solid var(--color-bg);
  background: linear-gradient(to right, #02a963, #00bfff);
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
}

.login-button:hover {
  background: #2E3339;
  color: white;
  border: 2px solid var(--border);
}

.btn-login p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text);
}

.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px var(--color-bg);
}

.comment-form {
  margin-bottom: 2rem;
}

select {
  appearance: none;
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
  padding-right: 30px;
  border: 1px solid var(--border);
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  background-color: var(--color-background);
  color: var(--text);
}

select:focus {
  border-color: var(--text);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.form-textarea {
  height: 100px;
  resize: vertical;
}

.post-btn {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s, background-color 0.3s;
  outline: none;
  border: 2px solid var(--color-border);
  background-color: transparent;
  color: var(--text);
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
}

.action-button:hover {
  background-color: var(--blackly);
  color: var(--white);
}

.alert {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
}

.alert-warning {
  color: var(--rad);
}

.alert-success {
  color: var(--theme);
}

.comments-list {
  margin-top: 2rem;
}

.comment {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  background-color: var(--color-background);
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-timestamp {
  font-size: 0.875rem;
  color: var(--grey);
  margin-left: auto;
}


@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .comment-timestamp {
    font-size: 0.75rem;
    margin-left: 0;
    margin-top: 0.5rem;
  }
  .container {
    margin: auto;
    padding: 0;
  }
}


@media (max-width: 480px) {
  .comment-header {
    padding: 0 1rem;
  }
  .comment-timestamp {
    font-size: 0.75rem;
    margin-top: 0.15rem;
  }
  .avatar {
    width: 40px;
    height: 40px;
  }
  .comment-info {
    font-size: 0.875rem;
  }
  .verified-container {
    display: inline-block;
    margin-left: 0.5rem;
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
}

.comment-author img {
  margin-left: 0.1rem;
}

.github-username {
  font-size: 0.875rem;
  color: var(--grey);
  margin-top: -0.2rem;
}

.comment-body {
  white-space: pre-wrap;
  color: var(--color-text);
}

.highlight-user-link {
  text-decoration: underline;
  word-wrap: break-word;
}

.comment-body {
  overflow-wrap: break-word;
}

.comment-body a {
  display: inline;
  padding: 0.2rem;
  border-radius: 0.25rem;
}

@media (max-width: 600px) {
  .highlight-user-link {
    font-size: 0.875rem;
  }
  
  .comment-body {
    padding: 0.5rem;
  }
}

.verified-container {
  position: relative;
  display: inline-block;
}

.verified-icon {
  margin-left: 0.2rem;
  cursor: pointer;
}

.tooltip-text {
  visibility: hidden;
  background-color: var(--blackly);
  color: var(--white);
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position the tooltip above the icon */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.verified-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
.comment-actions {
  margin-top: 10px;
}

.delete-button {
  border: none;
  border-radius: 6px;
  background: var(--rad);
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

.delete-button:hover {
  background: var(--border);
  color: var(--rad);
}

.bi-trash {
  font-size: 1.2rem;
}
</style>