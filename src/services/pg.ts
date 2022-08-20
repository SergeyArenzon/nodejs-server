import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();




const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
        ssl: {
      rejectUnauthorized: false
    }
  }); 
  
  
export const createLocation = async(location:any) => {
    const {name, price, locationName, description} = location;
    try {
        const client = await pool.connect();
        const query = `INSERT INTO location (name,price,location,description) VALUES ('${name}', ${price}, '${locationName}', '${description}')`
        console.log("-2-", query)
        const result = await client.query(query)
        client.release();
        return result
    } catch (error) {
        console.log("-3-", error)
        return error
    }
}