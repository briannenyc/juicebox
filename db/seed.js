const { client,
        getAllUsers,
        createUser,
        updateUser,
     } = require('./index');


     //drop all tables

async function dropTables() {
    try {
        console.log("Starting to drop tables...")
        await client.query(`
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

        

        console.log(albert);
        console.log("finished creating users!");

    } catch (error){
        console.log("Error creating users!");
        throw error ;
    }
}


async function createTablePosts() {
    try {

        console.log("Starting to build tables for posts...");

        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);

        console.log("Finished building post tables!")
        
    } catch (error) {
        console.error("Error building post tables!")
        throw error;
    }
}


async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        
    } catch (error){
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

        console.log("Finished database tests!");

    }   catch (error) {
        console.error("error testing database!");
        throw error;
    }   
}


rebuildDB()

.then(testDB)
.catch(console.error)
.finally(() => client.end());