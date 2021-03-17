# Podcast-app
An app that allows creators and listeners to discuss about their favourite podcasts. 
Built over the course of 2 weeks.

Deployed on http://www.pod-cast.club/ [aws-deployment branch]

Portfolio page: https://jcleow.github.io/portfolio/podcast.html

![pod-cast-homepage](https://jcleow.github.io/portfolio/img/projects/podcastApp/homePage.png)

### Features ###
* Users can create a new podcast series and upload episodes associated with it, categorised by genres and subgenres. *Currently only support Soundcloud embed links for podcast uploads
* Upload profile pictures, podcast series wide and/or episode specific artworks.
* Discuss/comment on individual podcast episodes with other users
* Favourite comments and episodes, which will be recorded in user's profile pages.
* Create your own favourite playlist of episodes
* Follow your favourite users and check out their favourited comments and playlists

### Technologies Used ###
Frontend: HTML, CSS, Bootstrap, EJS
Backend: PostgresQL,Express
Version Control: Git

### Technical Details ###

* Designed a PostgresQL database with Express.js backend to perform CRUD actions
on podcasts, users, followings, likes and comments
* Introduced session authentication through cookies for login, registration and user-specific pages
* Integrated with Multer-S3 for image uploads, complete with EJS and Bootstrap for rendering
* Designed from scratch DB tables to support features above, and it was interesting to discover the follower-followee relationships in an ERD diagram where the 'users' has 2x 1:M relationship with the 'fellowships' table. This is because a user can be both a follower and a followee, where a follower can have many followees and vice versa.
* Used Bootstrap extensive for the first time, and implemented a responsive bootstrap carousel display for Bootstrap Cards on the home page

### Future Implementations ###
* Can extend the app by having a newsfeed to see what the users followed activities are.
* To integrate with Spotify / SoundCloud API. Currently using only SoundCloud embed links because they are free.

### Known Issues ###
<details>  
  <summary> Restricted to only pasting soundcloud embed links during podcast creation </summary>
  <p> Users currently can only upload a podcast by using an Embed SoundCloudLink 
(e.g <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?.... >) and not an mp3/wav audio file. <p>
</details>

<details>
  <summary>Rename and cleanup of `newRoutes` branch for Heroku deployment</summary>
  <p>Yet to rename route for deployment and new routes added on heroku (currently sit as newRoute branch). This was created for practice on deployment away from AWS onto Heroku <p>
 </details>
 
 <details>
  <summary>Manual Input of Seed Data</summary>
  <p>Seed data are manually input at deployment (due to lack of time to automate the generation of scrapping soundcloud embed links). Future implementation if integrated with Spotify/Soundcloud API may negate this</p>
</details>

### Running the code ###

1. Clone the Repo

`git clone https://github.com/jcleow/podcast-app.git`

2. Run on node and specify port

`node index.js 3000`


