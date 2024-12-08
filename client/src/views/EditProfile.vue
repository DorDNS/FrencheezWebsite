<template>
  <div class="edit-profile">
    <h1>Edit Profile</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="full_name">Full Name</label>
        <input 
          type="text" 
          id="full_name" 
          v-model.trim="profile.full_name" 
          placeholder="Enter your full name" 
          required 
        />
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          type="text" 
          id="username" 
          v-model.trim="profile.username" 
          placeholder="Enter your username" 
          required 
        />
      </div>
      <div class="form-group">
        <label for="password">Password (optional)</label>
        <input 
          type="password" 
          id="password" 
          v-model="profile.password" 
          placeholder="Update your password" 
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model.trim="profile.description" 
          placeholder="Write something about yourself" 
          rows="4"
        ></textarea>
      </div>
      <button type="submit" class="save-button">Save Changes</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditProfile',
  data() {
    return {
      profile: {
        full_name: '',
        username: '',
        password: '', // Optional field
        description: '',
      },
    };
  },
  methods: {
    // Fetch user profile data
    async fetchProfile() {
      try {
        const response = await axios.get('/user/profile');
        this.profile = { ...response.data, password: '' }; // Reset password field
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to fetch profile. Please try again.');
      }
    },
    // Update user profile data
    async updateProfile() {
      try {
          // Only send the password if it has been modified
          const updatedProfile = { ...this.profile };
          if (!updatedProfile.password) {
              delete updatedProfile.password; // Remove password if not updated
          }

          // Send the update request to the backend
          await axios.put('/user/profile', updatedProfile);

          alert('Profile updated successfully!');
          this.fetchProfile(); // Refresh profile data after update
      } catch (error) {
          console.error('Error updating profile:', error);
          alert('Failed to update profile. Please try again.');
      }
    },
  },
  created() {
    this.fetchProfile(); // Fetch profile on component creation
  },
};
</script>

<style scoped>
.edit-profile {
max-width: 600px;
margin: 20px auto;
padding: 20px;
border: 1px solid #E0E0E0;
border-radius: 8px;
background-color: #FFFFFF;
font-family: "Rubik", sans-serif;
box-sizing: border-box;
}

.form-group {
margin-bottom: 15px;
}

.form-group label {
display: block;
margin-bottom: 5px;
font-weight: bold;
}

.form-group input,
.form-group textarea {
width: 100%;
padding: 10px;
border: 1px solid #CCC;
border-radius: 4px;
box-sizing: border-box; 
}

.save-button {
display: block;
width: 100%;
padding: 10px;
font-size: 1.2rem;
color: #FFFFFF;
background-color: #007BFF;
border: none;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
background-color: #0056b3;
transform: scale(1.02);
}

.save-button:active {
background-color: #004085;
transform: scale(0.98);
}
</style>
