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
    const query = `INSERT INTO location (name,price,location,description) 
                    VALUES ('${name}', ${price}, '${locationName}', '${description}')`
    try {
        const result = await client.query(query)
        client.release();
        return result
    } catch (error) {
        client.release();
        throw(error)
    }
}