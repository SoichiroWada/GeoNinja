<template>
  <div class="signup container">
      <form class="card-panel" v-on:submit.prevent="signup">
          <h2 class="center deep-purple-text">Signup</h2>
          <div class="field">
              <label for="email">Email:</label>
              <input type="email" name="email" v-model="email">
          </div>
          <div class="field">
              <label for="password">Password:</label>
              <input type="password" name="password" v-model="password">
          </div>
          <div class="field">
              <label for="alias">Alias:</label>
              <input type="text" name="alias" v-model="alias">
          </div>
          <p class="green-text center" v-if="feedback">{{ feedback }}</p>
          <p class="red-text center" v-if="feedback2">{{ feedback2 }}</p>
          <div class="field center"></div>
          <button class="btn deep-purple">Signup</button>
      </form>
  </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init.js'
import firebase from 'firebase'

export default {
  name: 'Signup',
  data: function(){
            return {
                email: null,
                password: null,
                alias: null,
                feedback: null,
                feedback2: null,
                slug: null,
                loginTime: null,
                logoutTime: null
            }
        },
  methods: {
      signup(){
          if(this.alias && this.email && this.password){
            this.feedback = null;
            this.feedback2 = null;
            this.slug = slugify(this.alias, {
                replacement: '-',
                remove: /[$*_+~.()'"!\-:@]/g,
                lower: true
              })
              let ref = db.collection('users').doc(this.slug)
              ref.get().then(doc => {
                  if(doc.exists){
                      this.feedback2 = "This alias already exists"
                  } else {
                      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                      .then(() => {
                          let currentUser = firebase.auth().currentUser
                        //   console.log('currentUser.uid:',currentUser.uid)
                          ref.set({
                              alias: this.alias,
                              geolocation: null,
                              user_id: currentUser.uid,
                              email:this.email,
                              loginTime: Date.now(),
                              logoutTime:null
                          })
                      }).then(() => {
                          this.$router.push({ name: 'GMap' })
                      })
                      .catch(err => {
                          console.log(err)
                          this.feedback2 = err.message
                      })
                      this.feedback = "You can use this alias !"
                  }
              })
              console.log('this.slug:',this.slug)
          } else {
              this.feedback2 = "You must enter all fields"
          }
      }
  }
}
</script>

<style>
.signup{
  max-width: 400px;
  margin-top: 60px;
}
.signup h2{
  font-size: 2.4em;
}
.signup .field{
  margin-bottom: 16px;
}
</style>
