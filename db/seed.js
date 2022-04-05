const { client,
        getAllUsers,
        createUser,
        updateUser,
        getUserById,
        createPost,
        updatePost,
        getAllPosts,
        getPostsByTagName,
        getAllTags
     } = require('./index');


     //drop all tables

async function dropTables() {
    try {
        console.log("Starting to drop tables...")
        await client.query(`
         DROP TABLE IF EXISTS post_tags;
         DROP TABLE IF EXISTS tags;
         DROP TABLE IF EXISTS posts;
         DROP TABLE IF EXISTS users;

        `);

        console.log("finished droppiing tables!")
    } catch (error) {
        console.error("Error dropping tables!")
        throw error;
    }
}

async function createTables() {
    try {

        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          );

        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
          );

        CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
        )  
        `);

        console.log("Finished building tables!")
        
    } catch (error) {
        console.error("Error building tables!")
        throw error;
    }
}



async function createInitialUsers() {
    try {
        console.log("starting to create users...");

        const albert = await createUser({username: 'albert', password: 'bertie99', name: 'alberto', location: 'florida'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me', name: 'sandy', location: 'san francisco'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'annie', location: 'boise'});

        

        
        console.log("finished creating users!");

    } catch (error){
        console.log("Error creating users!");
        throw error ;
    }
}


// async function createTablePosts() {
//     try {

//         console.log("Starting to build tables for posts...");

//         await client.query(`
//         CREATE TABLE users (
//             id SERIAL PRIMARY KEY,
//             "authorId" INTEGER REFERENCES users(id) NOT NULL,
//             title VARCHAR(255) NOT NULL,
//             content TEXT NOT NULL,
//             active BOOLEAN DEFAULT true
//         );
//         `);

//         console.log("Finished building post tables!")
        
//     } catch (error) {
//         console.error("Error building post tables!")
//         throw error;
//     }
// }

async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
        tags: ["#happy", "#youcandoanything"]
      });
  
      await createPost({
        authorId: sandra.id,
        title: "Happy Day",
        content: "I got a new puppy.",
        tags: ["#happy", "#worst-day-ever"]
      });

      await createPost({
        authorId: glamgal.id,
        title: "Why Me",
        content: "I went swimming and my eyelashes fell off. I cried.",
        tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
      });
      console.log("Finished creating posts!");
    } catch (error) {
      console.log("Error creating posts!");
      throw error;
    }
  }


//   async function createInitialTags() {
//     try {
//       console.log("Starting to create tags...");
  
//       const [happy, sad, inspo, catman] = await createTags([
//         '#happy', 
//         '#worst-day-ever', 
//         '#youcandoanything',
//         '#catmandoeverything'
//       ]);
  
//       const [postOne, postTwo, postThree] = await getAllPosts();
  
//       await addTagsToPost(postOne.id, [happy, inspo]);
//       await addTagsToPost(postTwo.id, [sad, inspo]);
//       await addTagsToPost(postThree.id, [happy, catman, inspo]);
  
//       console.log("Finished creating tags!");
//     } catch (error) {
//       console.log("Error creating tags!");
//       throw error;
//     }
//   }


  // REBUILD DATABASE
async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
       
        
    } catch (error){
        console.log("error during rebuildDB")
        throw error;
    } 
}


async function testDB() {
    try {
        console.log("Starting to test database...");

        const users = await getAllUsers();

        console.log("getAllUsers:", users);

        console.log("calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("Result:", updatePostTagsResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);


     console.log("Calling getPostsByTagName with #happy");
     const postsWithHappy = await getPostsByTagName("#happy");
     console.log("Result:", postsWithHappy);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


rebuildDB()

.then(testDB)
.catch(console.error)
.finally(() => client.end());