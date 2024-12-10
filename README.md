# NZPMC Mini Registration Platform
Created as part of the technical training for the NZPMC CY24/25

## Preface
Honestly, I have no clue where to even begin. It feels like I've done so much on this project but also couldn't find the time to do the multitude of other things I set out hoping to complete. Regardless, I hope I've at least managed to hit the basic functionality of the brief.

This has admittedly been a monumentally difficult project for me to finish. But I've learnt so much about fullstack development in these past few weeks, and hopefully this outcome also manages to showcase some of that.

## Frontend
The hierarchy of pages and components looks something like this (different line types are irrelevant and purely visual)

![image](https://github.com/user-attachments/assets/c81b5704-c3ce-409b-afca-07ea564a62d1)

Since going through each component individually would probably be far too cumbersome, I'll just highlight any and all interesting features I can recall.

### Access Tokens
Logging in grants users an access token which provides users with the credentials to their make relevant requests. An access level is also assigned to every user based on their, well, access level. This ensures that users are directed to their relevant pages. Further improvement to this would involve the addition of a refresh token to allow the access token to be constantly updated (so it's more secure).

### Jotai
Used in order to store global states which can be used across components. I personally prefer this over React Context given how much simpler it is. Currently Jotai is used to store the user's access token and access level.

### Session Storage
The access token and access level variables are also stored in session storage so that refreshing the page keeps the user logged in.

### CSS Styling
In this project, CSS styling was declared in both the relevant component files, as well as a root index.css file. The index.css file provided styling for all tags used repeatedly across multiple components, but also in cases where attributes depended on the root pseudo-class. All other styling (generally unique styling) was done in their respective components.

## Backend
The backend structure is a lot more straightforward (although working on it gave me twice as many headaches). The code handling the majority of the requests can be found in the index.js files, this file basically uses every other js file in the backend in order to execute it's code (which includes middleware, MongoDB/mongoose models, and a script to connect to MongoDB). Interesting features include:

### JsonWebToken
Used to generate the aforementioned access tokens.

### Argon2
Used to hash passwords (although, usage could definitely be expanded upon to strengthen security).

## Link to Render
The project's backend is up and running on Render! You can access it using the link, but it can be rather slow at times and there's one fairly big issue (which I've noted below).
https://nzpmc-mini-registration-platform.onrender.com/

For Admin access use the following:
- email: admin@gmail.com
- password: 1234 (I know, it's so secure)

## A Not-So-Nice Flaw
When refreshing the site on the backend or manually trying to reach a certain path, the server returns a 404. From what I gather, this is due to the way React works. Since React applications are single page applications with the index.html file, when you try to access an alternate path directly rather than through React Router, the server doesn't have anything to return. Initiating the frontend via the npm run dev command works perfectly fine though, although I'm not sure why.

There's also an additional problem with an inability to load session storage data from the backend, but I haven't had the time to look into the issue. Unfortunately both these issues were found super late into development when I was deploying things earlier this evening, and I really just lack the time to fix them.

## Oh God I've Gone On Too Long
Sorry for exceeding the word count, hopefully it was at least a somewhat enjoable read 😅
