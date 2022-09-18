import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();


const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
        ssl: {
      rejectUnauthorized: false
    }
  }); 
  
  
export const createLocation = async(location: {name: string, price: number, locationName: string, description: string, userId: string}) => {
    const {name, price, locationName, description, userId} = location;
    const client = await pool.connect();
    const query = `INSERT INTO location (name,user_id,price,location,description) 
                    VALUES ('${name}', ${userId}, ${price}, '${locationName}', '${description}')`
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

export const getUserByEmail = async(email: string) => {
  const client = await pool.connect();
  const selectUserByEmailQuery = `SELECT * FROM "user" WHERE EMAIL =  ('${email}')`;
  const result = await client.query(selectUserByEmailQuery)
  try{
    const rows = (await client.query(selectUserByEmailQuery)).rows
    client.release();
    return rows[0]
  } catch (error) {
    client.release();
    throw(error)
  }
}
export const getUserById = async(id: string) => {
  const client = await pool.connect();
  const selectUserByIdQuery = `SELECT * FROM "user" WHERE ID =  ('${id}')`;
  const result = await client.query(selectUserByIdQuery)
  try{
    const rows = (await client.query(selectUserByIdQuery)).rows
    client.release();
    return rows[0]
  } catch (error) {
    client.release();
    throw(error)
  }
}


export const getAllLocations = async() => {
  const client = await pool.connect();
  const selectAllLocationQuery = `SELECT * FROM location`;
  try{
    const locations = (await client.query(selectAllLocationQuery)).rows
    client.release();
    return locations
  } catch (error) {
    client.release();
    throw(error)
  }
}
export const getLocationById = async(id: string) => {
  const client = await pool.connect();
  const selectLocationByIdQuery = `SELECT * FROM location WHERE ID = '${id}' `;
  try{
    const location = (await client.query(selectLocationByIdQuery)).rows[0]
    client.release();
    return location
  } catch (error) {
    client.release();
    throw(error)
  }
}
export const getCommentsByLocationId = async(location_id: string) => {
  const client = await pool.connect();
  const selectLocationByIdQuery = `SELECT * FROM comment WHERE LOCATION_ID = '${location_id}' `;
  try{
    const comments = (await client.query(selectLocationByIdQuery)).rows
    client.release();
    return comments;
  } catch (error) {
    client.release();
    throw(error)
  }
}
export const createCommentByUserId = async(userId: string, locationId: string, body: string, title: string) => {
  const client = await pool.connect();
  const selectLocationByIdQuery = `INSERT INTO comment(user_id, title, body, location_id)
            VALUES('${userId}','${title}','${body}','${locationId}')`;
  try{
    const comments = (await client.query(selectLocationByIdQuery)).rows[0]
    client.release();
    return comments;
  } catch (error) {
    client.release();
    throw(error)
  }
}