<template>
    <div class="container">
      <div class="custom_container">
        <div class="custom_header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin size-4" style="transform: rotate(30deg);">
            <line x1="12" x2="12" y1="17" y2="22"></line>
            <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 1 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
          </svg>
          Pinned
        </div>
        <div>
            I appreciate your time exploring my website. If we’ve worked together, I kindly request that you leave a testimonial about your experience. Your feedback helps me improve!
        </div>
      </div>
  
      <div v-if="!user" class="btn-login">
        <button class="login-button gap-2" @click="signInWithGithub">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="mr-2" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          <span>Login</span>
        </button>
        <p>to continue leaving a testimonial</p>
      </div>
  
      <div v-if="user" class="auth_user_data">
        <p>Logged in as <span class="display_name">{{ user.displayName || user.email }}</span></p>
  
        <div class="testimonial-form">
          <textarea v-model="testimonial" placeholder="Write your testimonial here..." class="form-textarea" required></textarea>
          <input v-model="designation" placeholder="Write your designation here..." required />
          <div class="post-btn">
            <button @click="logout" class="action-button">Logout</button>
            <button @click="postTestimonial" class="action-button" :disabled="isPostButtonDisabled">Post testimonial</button>
          </div>
          <p v-if="warning" class="alert alert-warning">Warning: You cannot post an empty testimonial.</p>
          <p v-if="success" class="alert alert-success">Testimonial posted successfully!</p>
        </div>
      </div>
    </div>
  
      <div class="testimonials" v-if="testimonials.length">
        <div class="testimonial" v-for="testimonial in testimonials" :key="testimonial.id">
          <img :src="testimonial.avatar" alt="testimonial" class="testimonial-img" />
          <p class="testimonial-text" v-html="formattestimonial(testimonial.testimonial)"></p>
  
          <div class="testimonial-footer">
            <h3 class="testimonial-name">
              <a :href="testimonial.link" target="_blank">{{ testimonial.displayname }}</a>
            </h3>
            <p class="testimonial-designation">{{ testimonial.designation }}</p>
          </div>
  
          <div class="testimonial-actions" v-if="user && (user.email === testimonial.email || isAdmin(user.email) || isModerator(user.email))">
            <button @click="deletetestimonial(testimonial.id)" class="btn btn-danger btn-sm delete-button">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <p v-else>No testimonials yet. Be the first to leave one!</p>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import { auth, provider, signInWithPopup, signOut, db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from '../firebase';
  
  export default {
    data() {
      return {
        user: null,
        testimonial: '',
        designation: '',
        testimonials: [],
        warning: false,
        success: false,
      };
    },
    computed: {
      isPostButtonDisabled() {
        return this.testimonial.trim() === '' || this.designation.trim() === '';
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
      async postTestimonial() {
        if (!this.testimonial.trim()) {
          this.warning = true;
          setTimeout(() => (this.warning = false), 2000);
          return;
        }
        
        const newTestimonial = {
          testimonial: this.testimonial,
          displayname: this.user.displayName || this.user.email,
          designation: this.designation || 'No designation provided', // Default value if not provided
          email: this.user.email,
          avatar: this.user.photoURL || '/public/manavatar.jpg',
          time: serverTimestamp(),
        };
  
        try {
          await addDoc(collection(db, 'testimonials'), newTestimonial);
          this.success = true;
          this.testimonial = '';
          this.designation = ''; // Reset designation field
          setTimeout(() => (this.success = false), 2000);
        } catch (error) {
          console.error('Error posting testimonial:', error);
        }
      },
      async deletetestimonial(testimonialId) {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to undo this!',
            icon: 'warning',
            iconColor: '#f8bb86',
            background: '#333',
            color: '#fff',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
          });
  
          if (result.isConfirmed) {
            await deleteDoc(doc(db, 'testimonials', testimonialId));
            Swal.fire({
              title: 'Deleted!',
              text: 'The testimonial has been deleted.',
              icon: 'success',
              background: '#333',
              color: '#fff',
            });
          }
        } catch (error) {
          console.error('Error deleting testimonial:', error);
        }
      },
      async getTestimonials() {
        const q = query(collection(db, 'testimonials'), orderBy('time', 'desc'));
        onSnapshot(q, (snapshot) => {
          this.testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
      },
      formattestimonial(text) {
        return text.split('\n').map(line => `<p>${line}</p>`).join('');
      },
      isAdmin(email) {
        return email === 'admin@example.com';
      },
      isModerator(email) {
        return email === 'abuzahinmohammadnowsin@gmail.com';
      },
    },
    created() {
      this.getTestimonials();
      this.user = auth.currentUser;
    },
    mounted() {
      auth.onAuthStateChanged(user => {
        this.user = user;
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

.testimonial-form {
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

input,
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

.testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .testimonial {
    text-align: center;
    background-color: var(--color-bg);
    color: var(--color-text);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid var(--border);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .testimonial:hover {
    transform: translateY(-5px);
  }

  .testimonial-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 10px auto;
    border: 2px solid var(--theme);
  }

  .testimonial-text {
    font-size: 16px;
    color: var(--grey);
    margin-bottom: 10px;
  }

  .testimonial-name {
    font-size: 1.2em;
    font-weight: bold;
    color: var(--white);
  }

  .testimonial-name a {
    text-decoration: none;
    color: inherit;
  }

  .testimonial-footer {
    margin-top: auto;
    padding-top: 15px;
  }

  .testimonial-designation {
    font-size: 0.9em;
    color: var(--grey);
  }

  .testimonial:hover .testimonial-name {
    color: var(--theme);
  }

  @media (max-width: 768px) {
    .testimonial-text {
      font-size: 14px;
    }

    .testimonial-name {
      font-size: 1.1em;
    }

    .testimonial-img {
      width: 80px;
      height: 80px;
    }
  }

</style>