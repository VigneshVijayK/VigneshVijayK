HOW TO ADD YOUR PROFILE IMAGE:

1. Place your profile photo in this folder and name it "profile.jpg" (or .png)

2. Update the HTML file (index.html):
   - Find the section with class "image-placeholder"
   - Replace it with:
     <img src="images/profile.jpg" alt="Vignesh Vijay K" class="profile-image">

3. Add this CSS to styles.css:
   .profile-image {
       width: 300px;
       height: 300px;
       border-radius: 50%;
       object-fit: cover;
       border: 5px solid rgba(255, 255, 255, 0.3);
       box-shadow: var(--shadow-xl);
   }

Optional: You can also add project images, certification badges, or other portfolio images here!


