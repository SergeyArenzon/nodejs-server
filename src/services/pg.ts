import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
        ssl: {
      rejectUnauthorized: false
    }
  }); 
  
  
export const createLocation = async(location: {name: string, price: number, locationName: string, description: string}) => {
    const {name, price, locationName, description} = location;
    const client = await pool.connect();
    const query = `INSERT INTO location (name,user_id,price,location,description) 
                    VALUES ('${name}', ${1}, ${price}, '${locationName}', '${description}')`
    try {
        const result = await client.query(query)
        client.release();
        return result
    } catch (error) {
        client.release();
        throw(error)
    }
}


export const createUser = async(user: {email: string, firstName: string, lastName: string, hashedPassword: string }) => {
  const client = await pool.connect();
  const {email, firstName, lastName, hashedPassword} = user; 




  const insertUserQuery = `INSERT INTO "user" (email,firstName,lastName,password) 
                  VALUES ('${email}', '${firstName}', '${lastName}', '${hashedPassword}')`

  const selectUserByEmailQuery = `SELECT * FROM "user" WHERE EMAIL =  ('${email}')`

  try {

    const rows = (await client.query(selectUserByEmailQuery)).rows
    if(rows.length) throw "Email is already exist."
    const result = await client.query(insertUserQuery)
    client.release();
    return result
  } catch (error) {
    client.release();
    throw(error)
  }

}


