import User from "models/User.model";
import passport, {serializeUser } from "passport";


import GoogleStrategy from "passport-google-oauth20"


passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.G_CLIENT_ID as string,
      clientSecret: process.env.G_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"]
    },
    async(accessToken, refreshToken, profile, done) => {
     const firstName = profile._json.given_name;
     const lastName = profile._json.family_name;
     const email = profile._json.email;
     const profileAvatar = profile._json.picture;
     const source = ["google"];

     try {
      const user = await User.findOne({email})
      if(user) {
        console.log("FirstName", firstName)
        console.log("lastname", lastName)
        console.log("email",email)
        console.log("profileAvatar", profileAvatar)
        console.log("source", source)

        // if(!user.avatar){
        //   // TODO: update profile photo 
        //   // const updateUser = await User.findOneAndUpdate({email}, {profile}, {new : true})
        //   console.log(profileAvatar)
        //   return done(null, profileAvatar)
        // }

        // if (!user.source.includes("google")) {
        //   const updatedUser = await userModel.findOneAndUpdate(
        //     { email },
        //     { source: ["local ,google"] },
        //     { new: true }
        //   );
        //   return done(null, updatedUser);
        // }
        
        // return done(null, user)
      // } else if (!user){
      //   const saveUserInfo = new User({
      //     firstName,
      //     lastName,
      //     email,
      //     profileAvatar,
      //     source,
      //     created_at: new Date()
      //   });
      //   const result = await saveUserInfo.save();
      //   return done(null, result);

      }
     } 
     catch (error) {
      console.log("error in password js", error);
      done(error as Error, { status: false, message: "failed to login with Google" });
    }
    }
  )
)

// serialize - add user details to session
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log("user in serialize - ", serializeUser)
    cb(null, user);
  });
});

// deserialize - remove user details from session
passport.deserializeUser((user: string, done) => {
  console.log("deserilize user - ", user)
  done(null, user);

});

