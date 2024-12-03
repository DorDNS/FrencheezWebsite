<template>
  <div class="user-management-page">
    <div class="white-background">
      <h1>User Management</h1>
      <button @click="goToAdminPanel" class="back-to-admin-panel">
        Back to Admin Panel
      </button>
      <div class="user-grid">
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
          @click="selectUser(user)"
        >
          <h4>{{ user.username }}</h4>
          <p><strong>Full Name:</strong> {{ user.full_name }}</p>
          <p><strong>Admin:</strong> {{ user.admin ? 'Yes' : 'No' }}</p>
        </div>
        <div class="user-card add-user-card" @click="openAddUserModal">
          <span class="plus-icon">+</span>
        </div>
      </div>

      <!-- Modal for Adding a New User -->
      <div v-if="showAddUserModal" class="modal">
        <div class="modal-content">
          <h3>Add New User</h3>
          <form @submit.prevent="addUser">
            <input v-model="newUser.full_name" placeholder="Full Name" required />
            <input v-model="newUser.username" placeholder="Username" required />
            <input v-model="newUser.password" type="password" placeholder="Password" required />
            <button type="submit">Add User</button>
            <button type="button" @click="closeAddUserModal">Cancel</button>
          </form>
        </div>
      </div>

      <!-- Modal for Viewing User Details -->
      <div v-if="selectedUser" class="modal">
        <div class="modal-content">
          <h3>User Details</h3>
          <p><strong>Full Name:</strong> {{ selectedUser.full_name }}</p>
          <p><strong>Username:</strong> {{ selectedUser.username }}</p>
          <button @click="toggleAdmin(selectedUser.id, !selectedUser.admin)">
            {{ selectedUser.admin ? 'Remove Admin' : 'Make Admin' }}
          </button>
          <button @click="deleteUser(selectedUser.id)">Delete User</button>
          <button @click="closeUserDetailsModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default {
  data() {
    return {
      users: [],
      showAddUserModal: false,
      selectedUser: null,
      newUser: {
        full_name: '',
        username: '',
        password: '',
      },
    };
  },
  methods: {
    fetchUsers() {
        const token = localStorage.getItem('token');
        axiosInstance
            .get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token
                },
            })
            .then((response) => {
                this.users = response.data; // Assuming `users` holds the data
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    },

    async addUser() {
      try {
        await axiosInstance.post('/admin/users', this.newUser, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.closeAddUserModal();
        this.fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error.response?.data || error.message);
      }
    },
    async deleteUser(userId) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
      }
    },
    async toggleAdmin(userId, isAdmin) {
        try {
            await axiosInstance.patch(
                `/admin/users/${userId}`,
                { admin: isAdmin ? 1 : 0 },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            // Update the selected user's admin status dynamically
            if (this.selectedUser && this.selectedUser.id === userId) {
                this.selectedUser.admin = isAdmin;
            }

            // Update the full user list in case you need it elsewhere
            const userIndex = this.users.findIndex((user) => user.id === userId);
            if (userIndex !== -1) {
                this.users[userIndex].admin = isAdmin;
            }
        } catch (error) {
            console.error('Error updating admin status:', error.response?.data || error.message);
        }
    },    
    selectUser(user) {
      this.selectedUser = user;
    },
    closeUserDetailsModal() {
      this.selectedUser = null;
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
      this.newUser = { full_name: '', username: '', password: '' };
    },
    goToAdminPanel() {
      this.$router.push('/admin');
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.user-management-page {
  max-width: 900px;
  margin: 20px auto;
  font-family: 'Rubik', sans-serif;
}

/* Conteneur blanc */
.white-background {
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.back-to-admin-panel {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #5f4b8b;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-to-admin-panel:hover {
  background-color: #4a3b6d;
  transform: scale(1.05);
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.user-card {
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.user-card:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.add-user-card {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ccc;
}

.plus-icon {
  font-size: 3rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>